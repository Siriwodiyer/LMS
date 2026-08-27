import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BadgeDefinition } from '../../types';
import {
  Award,
  Plus,
  Power,
  Edit,
  Trash2,
  Sparkles,
  CheckCircle2,
  X,
  Target,
  BookOpen,
  HelpCircle
} from 'lucide-react';

export const AdminRewardsBadges: React.FC = () => {
  const {
    badgeDefinitions,
    createBadgeDefinition,
    updateBadgeDefinition,
    toggleBadgeActive,
    courses,
    showToast
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<BadgeDefinition | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🏆');
  const [rarity, setRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>('rare');
  const [conditionType, setConditionType] = useState<'quiz_score' | 'course_completion' | 'streak_days' | 'custom'>('quiz_score');
  const [conditionCourseId, setConditionCourseId] = useState(courses[0]?.id || '');
  const [conditionThreshold, setConditionThreshold] = useState(70);
  const [conditionText, setConditionText] = useState('Complete course with quiz score >= 70%');

  const handleOpenCreate = () => {
    setTitle('');
    setDescription('');
    setIcon('🏆');
    setRarity('rare');
    setConditionType('quiz_score');
    setConditionThreshold(70);
    setConditionText('Complete course with quiz score >= 70%');
    setEditingBadge(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (badge: BadgeDefinition) => {
    setEditingBadge(badge);
    setTitle(badge.title);
    setDescription(badge.description);
    setIcon(badge.icon);
    setRarity(badge.rarity);
    setConditionType(badge.conditionType as any);
    setConditionCourseId(badge.conditionCourseId || courses[0]?.id || '');
    setConditionThreshold(badge.conditionThreshold || 70);
    setConditionText(badge.conditionText);
    setIsCreateModalOpen(true);
  };

  const handleSaveBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !conditionText.trim()) return;

    if (editingBadge) {
      updateBadgeDefinition(editingBadge.id, {
        title: title.trim(),
        description: description.trim() || conditionText.trim(),
        icon,
        rarity,
        conditionType,
        conditionCourseId,
        conditionThreshold: Number(conditionThreshold),
        conditionText: conditionText.trim()
      });
      showToast(`Badge "${title}" updated.`, 'success');
    } else {
      createBadgeDefinition({
        title: title.trim(),
        description: description.trim() || conditionText.trim(),
        icon,
        rarity,
        conditionType,
        conditionCourseId,
        conditionThreshold: Number(conditionThreshold),
        conditionText: conditionText.trim(),
        isActive: true
      });
      showToast(`Badge "${title}" created!`, 'success');
    }

    setIsCreateModalOpen(false);
  };

  const emojiPresets = ['🏆', '⚡', '🚀', '🎯', '💎', '🧠', '🛡️', '⚙️', '💻', '🏅'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1">
              <Award size={13} /> Gamification Engine
            </span>
            <span className="text-xs text-slate-500">• Badges & Honors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-2">
            Rewards & Achievement Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Configure system badges, set automated unlocking criteria for quiz scores, course graduations, and learning streaks.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0"
        >
          <Plus size={16} />
          <span>+ Create Badge</span>
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {badgeDefinitions.map(badge => (
          <div
            key={badge.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
                    {badge.icon}
                  </div>
                  <div>
                    <strong className="text-slate-900 font-bold block text-sm">{badge.title}</strong>
                    <span className="px-2 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                      {badge.rarity}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    badge.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {badge.isActive ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {badge.description}
              </p>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[11px]">
                <strong className="block text-slate-900 font-bold mb-0.5">Criteria:</strong>
                <span>{badge.conditionText}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(badge)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
              >
                <Edit size={13} />
                <span>Edit</span>
              </button>

              <button
                onClick={() => {
                  toggleBadgeActive(badge.id);
                  showToast(`Badge ${badge.isActive ? 'disabled' : 'activated'}.`, 'info');
                }}
                className={`p-1.5 rounded-lg border text-xs font-bold ${
                  badge.isActive
                    ? 'text-rose-600 border-slate-200 hover:bg-rose-50'
                    : 'text-emerald-600 border-slate-200 hover:bg-emerald-50'
                }`}
                title={badge.isActive ? 'Disable Badge' : 'Enable Badge'}
              >
                <Power size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Badge Create/Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-base text-slate-900">
                {editingBadge ? 'Edit Achievement Badge' : 'Create Achievement Badge'}
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 rounded-full hover:bg-slate-200 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBadge} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Badge Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Architect"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Icon</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={icon}
                      onChange={e => setIcon(e.target.value)}
                      className="w-12 p-2 rounded-xl border border-slate-200 text-center text-lg"
                    />
                    <div className="flex flex-wrap gap-1">
                      {emojiPresets.slice(0, 5).map(em => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setIcon(em)}
                          className="p-1 rounded hover:bg-slate-100 text-sm"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Rarity</label>
                  <select
                    value={rarity}
                    onChange={e => setRarity(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white"
                  >
                    <option value="common">Common</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Awarded for mastering core concepts..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Criteria Text *</label>
                <input
                  type="text"
                  required
                  value={conditionText}
                  onChange={e => setConditionText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Save Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
