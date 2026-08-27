import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, onSnapshot, query, where, orderBy, serverTimestamp, getDocs, getDoc } from 'firebase/firestore';

export type WorkerStatus = 'ONLINE' | 'WORKING' | 'PAUSED' | 'OFFLINE';

export interface AIWorker {
  id: string;
  name: string;
  status: WorkerStatus;
  currentTask: string;
  completedTasks: number;
  failedTasks: number;
  lastActive: Date;
}

export interface AITask {
  id: string;
  workerId: string;
  type: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'WAITING_APPROVAL';
  resourceId?: string;
  payload?: any;
  result?: any;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface AIApproval {
  id: string;
  taskId: string;
  workerId: string;
  action: string;
  resourceName: string;
  reason: string;
  impact: string;
  priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
}

class AIOrchestratorService {
  // Workers
  async registerWorker(worker: Partial<AIWorker>) {
    return await addDoc(collection(db, 'ai_workers'), {
      ...worker,
      status: worker.status || 'ONLINE',
      completedTasks: 0,
      failedTasks: 0,
      lastActive: serverTimestamp()
    });
  }

  async updateWorkerStatus(workerId: string, status: WorkerStatus, currentTask = 'Idle') {
    const workerRef = doc(db, 'ai_workers', workerId);
    await updateDoc(workerRef, { status, currentTask, lastActive: serverTimestamp() });
  }

  subscribeToWorkers(callback: (workers: AIWorker[]) => void) {
    const q = query(collection(db, 'ai_workers'), orderBy('lastActive', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const workers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AIWorker));
      callback(workers);
    });
  }

  // Tasks
  async queueTask(task: Omit<AITask, 'id' | 'createdAt' | 'status'>) {
    return await addDoc(collection(db, 'ai_tasks'), {
      ...task,
      status: 'PENDING',
      createdAt: serverTimestamp()
    });
  }

  async updateTaskStatus(taskId: string, status: AITask['status'], result?: any, error?: string) {
    const taskRef = doc(db, 'ai_tasks', taskId);
    const updateData: any = { status };
    if (result) updateData.result = result;
    if (error) updateData.error = error;
    if (status === 'COMPLETED' || status === 'FAILED') updateData.completedAt = serverTimestamp();
    await updateDoc(taskRef, updateData);
  }

  subscribeToTasks(callback: (tasks: AITask[]) => void, limit = 50) {
    const q = query(collection(db, 'ai_tasks'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AITask));
      callback(tasks);
    });
  }

  // Approvals
  async requestApproval(approval: Omit<AIApproval, 'id' | 'createdAt' | 'status'>) {
    return await addDoc(collection(db, 'ai_approvals'), {
      ...approval,
      status: 'PENDING',
      createdAt: serverTimestamp()
    });
  }

  async processApproval(approvalId: string, taskId: string, approved: boolean) {
    const approvalRef = doc(db, 'ai_approvals', approvalId);
    await updateDoc(approvalRef, { status: approved ? 'APPROVED' : 'REJECTED' });
    
    // Resume task execution or mark as failed/cancelled
    await this.updateTaskStatus(taskId, approved ? 'RUNNING' : 'FAILED', null, approved ? undefined : 'Rejected by admin');
    
    // Log activity
    await this.logActivity(
      'System', 
      approved ? `Admin approved action: ${approvalId}` : `Admin rejected action: ${approvalId}`,
      approved ? 'emerald' : 'red'
    );
  }

  subscribeToApprovals(callback: (approvals: AIApproval[]) => void) {
    const q = query(collection(db, 'ai_approvals'), where('status', '==', 'PENDING'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const approvals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AIApproval));
      callback(approvals);
    });
  }

  // Activity Stream
  async logActivity(workerId: string, message: string, color: 'blue' | 'amber' | 'emerald' | 'red' | 'zinc' = 'zinc') {
    await addDoc(collection(db, 'ai_activity'), {
      workerId,
      message,
      color,
      createdAt: serverTimestamp()
    });
  }

  subscribeToActivity(callback: (activities: any[]) => void) {
    const q = query(collection(db, 'ai_activity'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(activities);
    });
  }

  // Global settings
  async setGlobalMode(mode: string) {
    // Save to settings collection
    const settingsRef = doc(db, 'settings', 'ai_core');
    await updateDoc(settingsRef, { globalMode: mode }).catch(async (e) => {
      // If doc doesn't exist, try setting it
      const { setDoc } = require('firebase/firestore');
      await setDoc(settingsRef, { globalMode: mode });
    });
    
    await this.logActivity('System', `Admin updated GLOBAL AI MODE to: ${mode}`, 'zinc');
  }
}

export const AIOrchestrator = new AIOrchestratorService();
