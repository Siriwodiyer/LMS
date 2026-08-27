import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentApprovalItem, ApprovalStatus } from '../../types';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  MessageSquare,
  Clock,
  BookOpen,
  ShieldCheck,
  ChevronRight,
  X,
  History,
  Filter
} from 'lucide-react';

export const ContentApproval: React.FC = () => {
  const {
    approvalQueue,
    approveContent,
    rejectContent,
    requestChangesContent,
    showToast
  } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ContentApprovalItem | null>(null);

  // Rejection modal state
  const [rejectModalItem, setRejectModalItem] = useState<ContentApprovalItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('Please improve the explanation and add code examples before publishing.');

  // Request changes modal state
  const [changesModalItem, setChangesModalItem] = useState<ContentApprovalItem | null>(null);
  const [changesFeedback, setChangesFeedback] = useState<string>('');

  const filteredQueue = approvalQueue.filter(item => {
    if (selectedStatus === 'all') return true;
    return item.status === selectedStatus;
  });

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem || !rejectionReason.trim()) return;
    rejectContent(rejectModalItem.id, rejectionReason.trim());
    setRejectModalItem(null);
    showToast(`Content "${rejectModalItem.title}" rejected with feedback.`, 'info');
  };

  const handleConfirmChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changesModalItem || !changesFeedback.trim()) return;
    requestChangesContent(changesModalItem.id, changesFeedback.trim());
    setChangesModalItem(null);
    showToast(`Changes requested for "${changesModalItem.title}".`, 'info');
  };

  const statusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'under_review':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'approved':
      case 'published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1">
              <FileCheck2 size={13} /> Quality Assurance Pipeline
            </span>
            <span className="text-xs text-slate-500">• Curriculum Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-2">
            Content Approval & Quality Gateway
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Review and govern mentor course submissions before they are published to learners. Enforce high curriculum standards.
          </p>
        </div>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
        <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Content Lifecycle Progression</span>
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {['1. Draft', '2. Submitted', '3. Under Review', '4. Approved', '5. Published'].map((stage, idx) => (
            <div key={stage} className="flex items-center gap-2 shrink-0">
              <div className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-700 text-xs">
                {stage}
              </div>
              {idx < 4 && <ChevronRight size={14} className="text-slate-400 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {['all', 'submitted', 'under_review', 'approved', 'published', 'rejected'].map(st => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${
              selectedStatus === st
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Approval Queue Items */}
      <div className="space-y-3">
        {filteredQueue.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <CheckCircle2 size={32} className="mx-auto text-emerald-600 opacity-60" />
            <p className="text-sm font-bold text-slate-800">No items in queue for the selected filter.</p>
          </div>
        ) : (
          filteredQueue.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase border border-blue-200">
                    {item.contentType}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Subject: {item.categoryOrSubject}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${statusBadge(item.status)}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 truncate">{item.title}</h3>
                <p className="text-xs text-slate-500">
                  Submitted by <strong className="text-slate-800">{item.creatorName}</strong> ({item.creatorRole}) on {new Date(item.submissionDate).toLocaleDateString()}
                </p>

                {item.rejectionReason && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-0.5">
                    <strong className="font-bold flex items-center gap-1">
                      <AlertTriangle size={12} />
                      <span>Rejection Reason:</span>
                    </strong>
                    <p className="italic">"{item.rejectionReason}"</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end lg:self-center flex-wrap shrink-0">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1"
                >
                  <History size={13} />
                  <span>Audit History</span>
                </button>

                {item.status !== 'published' && item.status !== 'approved' && (
                  <>
                    <button
                      onClick={() => approveContent(item.id, true)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 size={13} />
                      <span>Approve & Publish</span>
                    </button>

                    <button
                      onClick={() => {
                        setChangesModalItem(item);
                        setChangesFeedback('Please review Module 2 and clarify code examples.');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all border border-amber-200"
                    >
                      Request Changes
                    </button>

                    <button
                      onClick={() => {
                        setRejectModalItem(item);
                        setRejectionReason('Please improve the explanation and add practical exercises before publishing.');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all border border-rose-200 flex items-center gap-1"
                    >
                      <XCircle size={13} />
                      <span>Reject</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mandatory Rejection Reason Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle size={18} />
                <h3 className="font-bold text-sm text-slate-900">Provide Mandatory Rejection Reason</h3>
              </div>
              <button
                onClick={() => setRejectModalItem(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              The mentor ({rejectModalItem.creatorName}) will receive this feedback and can edit and resubmit their content.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Rejection Reason *</label>
                <textarea
                  rows={4}
                  required
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {changesModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Request Changes from Mentor</h3>
              <button
                onClick={() => setChangesModalItem(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmChanges} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Feedback Note *</label>
                <textarea
                  rows={3}
                  required
                  value={changesFeedback}
                  onChange={e => setChangesFeedback(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setChangesModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Send Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Audit Trail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 truncate max-w-sm">
                Feedback Audit History: {selectedItem.title}
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {(selectedItem.feedbackHistory || []).map((h, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">{h.adminName}</strong>
                    <span className="text-[10px] text-slate-400">{new Date(h.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600">{h.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
