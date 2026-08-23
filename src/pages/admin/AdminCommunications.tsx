import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Bell, Mail, Radio, Plus, Search, Check, AlertTriangle, Send } from 'lucide-react';

export default function AdminCommunications() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'emails' | 'broadcasts'>('notifications');

  // Broadcast modal
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    name: '',
    subject: '',
    message: '',
    audience: 'all' as 'all' | 'customers' | 'segment'
  });

  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qEmail = query(collection(db, 'email_logs'), orderBy('sentAt', 'desc'));
    const unsubEmail = onSnapshot(qEmail, (snap) => {
      setEmailLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qBroad = query(collection(db, 'broadcasts'), orderBy('createdAt', 'desc'));
    const unsubBroad = onSnapshot(qBroad, (snap) => {
      setBroadcasts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubEmail();
      unsubBroad();
    };
  }, []);

  const handleSendBroadcast = async () => {
    if (!broadcastForm.name || !broadcastForm.subject || !broadcastForm.message) return alert("Fill all fields");
    
    const confirm = window.confirm(`Ready to send to ${broadcastForm.audience.toUpperCase()}?`);
    if (!confirm) return;

    try {
      await addDoc(collection(db, 'broadcasts'), {
        ...broadcastForm,
        status: 'SENT',
        sentAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      setShowBroadcastModal(false);
      setBroadcastForm({ name: '', subject: '', message: '', audience: 'all' });
    } catch(err) {
      console.error(err);
      alert("Error sending broadcast");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">COMMUNICATIONS</h1>
          <p className="text-zinc-500 mt-1">Manage notifications, email logs, and broadcasts.</p>
        </div>
        
        {activeTab === 'broadcasts' && (
          <button 
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Broadcast
          </button>
        )}
      </div>

      <div className="flex items-center gap-6 border-b border-zinc-200">
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'notifications' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Notifications
          {activeTab === 'notifications' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />}
        </button>
        <button 
          onClick={() => setActiveTab('emails')}
          className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'emails' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Email Logs
          {activeTab === 'emails' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />}
        </button>
        <button 
          onClick={() => setActiveTab('broadcasts')}
          className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'broadcasts' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Broadcasts
          {activeTab === 'broadcasts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />}
        </button>
      </div>

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
            <Bell className="w-8 h-8 text-zinc-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Admin Notifications</h2>
          <p className="text-zinc-500 max-w-md">System and order alerts will appear here. Currently filtered to empty.</p>
        </div>
      )}

      {activeTab === 'emails' && (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-medium">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {emailLogs.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No email logs found.</td></tr>
                ) : emailLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-4">{log.sentAt?.toDate ? log.sentAt.toDate().toLocaleString() : 'Just now'}</td>
                    <td className="p-4 font-medium text-zinc-900">{log.recipient}</td>
                    <td className="p-4 text-zinc-600 truncate max-w-xs">{log.subject}</td>
                    <td className="p-4"><span className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded text-xs font-bold">{log.type}</span></td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${log.status === 'sent' || log.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'broadcasts' && (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-medium">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Campaign Name</th>
                  <th className="p-4">Audience</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {broadcasts.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-zinc-500">No broadcasts found.</td></tr>
                ) : broadcasts.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-4">{b.createdAt?.toDate ? b.createdAt.toDate().toLocaleString() : 'Just now'}</td>
                    <td className="p-4 font-medium text-zinc-900">{b.name}</td>
                    <td className="p-4 capitalize">{b.audience}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${b.status === 'SENT' ? 'bg-primary-blue/10 text-primary-blue' : 'bg-zinc-100 text-zinc-600'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900">New Broadcast</h2>
              <button onClick={() => setShowBroadcastModal(false)} className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
                <Check className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Campaign Name</label>
                <input 
                  type="text" 
                  value={broadcastForm.name}
                  onChange={e => setBroadcastForm({...broadcastForm, name: e.target.value})}
                  placeholder="e.g. Summer Flash Sale Announcement"
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Audience</label>
                <select 
                  value={broadcastForm.audience}
                  onChange={e => setBroadcastForm({...broadcastForm, audience: e.target.value as any})}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-indigo-500"
                >
                  <option value="all">All Subscribers</option>
                  <option value="customers">Customers (Purchased at least once)</option>
                  <option value="segment">Specific Segment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Email Subject / Notification Title</label>
                <input 
                  type="text" 
                  value={broadcastForm.subject}
                  onChange={e => setBroadcastForm({...broadcastForm, subject: e.target.value})}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Message Body</label>
                <textarea 
                  value={broadcastForm.message}
                  onChange={e => setBroadcastForm({...broadcastForm, message: e.target.value})}
                  rows={4}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              
              <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm flex gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>Sending a broadcast will immediately dispatch emails and in-app notifications to the selected audience. Please review carefully.</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button onClick={() => setShowBroadcastModal(false)} className="flex-1 py-3 bg-zinc-100 text-zinc-900 font-bold rounded-xl hover:bg-zinc-200 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSendBroadcast} className="flex-1 py-3 bg-primary-blue text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
