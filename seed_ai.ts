import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function seed() {
  console.log("Seeding AI data...");

  // Seed Settings
  await setDoc(doc(db, 'settings', 'ai_core'), { globalMode: 'ONLINE' });

  // Seed Workers
  const workers = [
    { name: 'Product Discovery', status: 'ONLINE', currentTask: 'Idle', completedTasks: 42, failedTasks: 0 },
    { name: 'Product Builder', status: 'ONLINE', currentTask: 'Drafting items', completedTasks: 18, failedTasks: 1 },
    { name: 'Pricing Intelligence', status: 'ONLINE', currentTask: 'Idle', completedTasks: 120, failedTasks: 0 },
    { name: 'Order Operations', status: 'ONLINE', currentTask: 'Monitoring orders', completedTasks: 85, failedTasks: 2 },
    { name: 'Trend Intelligence', status: 'WORKING', currentTask: 'Scanning US market', completedTasks: 34, failedTasks: 0 }
  ];

  for (const w of workers) {
    await addDoc(collection(db, 'ai_workers'), { ...w, lastActive: serverTimestamp() });
  }

  // Seed Tasks
  await addDoc(collection(db, 'ai_tasks'), {
    workerId: 'Product Builder',
    type: 'PRODUCT_IMPORT',
    status: 'WAITING_APPROVAL',
    result: { message: 'Drafted Smart LED Desk Lamp' },
    createdAt: serverTimestamp()
  });

  // Seed Approvals
  await addDoc(collection(db, 'ai_approvals'), {
    taskId: 'mock-task-1',
    workerId: 'Product Builder',
    action: 'PUBLISH PRODUCT',
    resourceName: 'Smart Ergonomic Office Chair',
    reason: 'High demand signal in EU market. Supplier margin is 45%. Draft created, SEO tags applied, price set to $199.99.',
    impact: 'Adds product to store',
    priority: 'HIGH',
    status: 'PENDING',
    createdAt: serverTimestamp()
  });

  await addDoc(collection(db, 'ai_approvals'), {
    taskId: 'mock-task-2',
    workerId: 'Pricing Intelligence',
    action: 'CHANGE PRICE',
    resourceName: 'Wireless Earbuds Pro (SKU: WE-001)',
    reason: 'Supplier price increased by $2.00. Recommend increasing retail price from $49.99 to $54.99 to protect margin.',
    impact: 'Price increase',
    priority: 'NORMAL',
    status: 'PENDING',
    createdAt: serverTimestamp()
  });

  // Seed Activity
  await addDoc(collection(db, 'ai_activity'), {
    workerId: 'Order Operations',
    message: 'Synced Order #1042 to CJ Dropshipping successfully.',
    color: 'blue',
    createdAt: serverTimestamp()
  });

  console.log("Seeding complete.");
  process.exit(0);
}
seed().catch(console.error);
