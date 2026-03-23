"use client";

import { useState } from 'react';
import { Bell, Send, Users, Hammer, User, Layers, CheckCircle, AlertCircle, Eye } from 'lucide-react';

import { useSendNotification } from '@/hooks';

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('ALL'); // ALL, TASKERS, CUSTOMERS, SELECTED
  const [userIds, setUserIds] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendNotificationMutation = useSendNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    if (!title || !message) {
      setError('Title and message are required');
      return;
    }

    try {
      const payload: any = {
        title,
        message,
        target,
      };

      if (target === 'SELECTED' && userIds) {
        payload.userIds = userIds.split(',').map(id => id.trim());
      }

      await sendNotificationMutation.mutateAsync(payload);
      setSuccess(true);
      setTitle('');
      setMessage('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send notification');
    }
  };

  const targets = [
    { id: 'ALL', label: 'All Users', icon: Users },
    { id: 'TASKERS', label: 'All Taskers', icon: Hammer },
    { id: 'CUSTOMERS', label: 'All Customers', icon: User },
    { id: 'SELECTED', label: 'Specific User IDs', icon: Layers },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Push Notifications</h1>
        <p className="text-gray-500 text-sm">Send instant push notifications to your users and taskers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statistics or Tips */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
            <h3 className="text-orange-900 font-semibold mb-2 flex items-center gap-2">
              <AlertCircle size={18} />
              Important Note
            </h3>
            <p className="text-orange-800 text-sm leading-relaxed">
              Push notifications are sent immediately to all selected devices. Use clear and concise messaging to avoid spamming users.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-gray-900 font-semibold mb-4">Target Audience</h3>
            <div className="space-y-4">
              {targets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTarget(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${target === t.id
                      ? 'bg-orange-50 border-orange-200 text-orange-600 font-medium scale-[1.02]'
                      : 'border-gray-100 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <t.icon size={20} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 space-y-4">
              {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle size={18} />
                  <span>Notification sent successfully!</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-2 mb-4">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notification Title</label>
                <input
                  type="text"
                  placeholder="e.g., New Offer Alert! 🎁"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message Body</label>
                <textarea
                  rows={4}
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors resize-none"
                />
              </div>

              {target === 'SELECTED' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">User IDs (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="id1, id2, id3"
                    value={userIds}
                    onChange={(e) => setUserIds(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Provide the database IDs of the users you want to target.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={sendNotificationMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 shadow-lg shadow-orange-500/30"
              >
                {sendNotificationMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Notification
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Preview */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye size={20} className="text-gray-400" />
              Live Preview
            </h3>
            <div className="bg-gray-900 rounded-[2rem] p-4 max-w-[300px] border-[6px] border-gray-800 shadow-2xl">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                    <img src="/tasktap-logo.png" className="w-3 h-3 invert" />
                  </div>
                  <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">TaskTap • Now</span>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white truncate">{title || 'Your Title Here'}</div>
                  <div className="text-xs text-white/80 line-clamp-2">{message || 'Your notification message will appear here...'}</div>
                </div>
              </div>
              <div className="mt-40 flex justify-center">
                <div className="w-1/3 h-1 bg-white/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

