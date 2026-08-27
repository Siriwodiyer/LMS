import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Question, AssessmentResult } from '../../types';
import {
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  Zap,
  Gift,
  Clock,
  TrendingUp,
  X,
  UserCheck,
  Copy,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AssessmentModalProps {
  onNavigateToRewards?: () => void;
  onNavigateToProfile?: () => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  onNavigateToRewards,
  onNavigateToProfile
}) => {
  const {
    isAssessmentOpen,
    closeAssessment,
    getAssessmentQuestionsForUser,
    submitAssessmentAnswers,
    latestAssessmentResult,
    adminSettings,
    currentUser,
    isUserEligibleForMentor,
    showToast
  } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(90);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<AssessmentResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Initialize questions when modal opens
  useEffect(() => {
    if (isAssessmentOpen) {
      const qList = getAssessmentQuestionsForUser();
      setQuestions(qList);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setTimeLeft(90);
      setShowResult(false);
      setResultData(null);
    }
  }, [isAssessmentOpen]);

  // Timer tick
  useEffect(() => {
    if (!isAssessmentOpen || showResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAssessmentOpen, showResult, selectedAnswers, questions]);

  if (!isAssessmentOpen) return null;

  const currentQ = questions[currentQuestionIndex] || questions[0];

  const handleSelectOption = (index: number) => {
    if (currentQ) {
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQ.id]: index
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    const result = submitAssessmentAnswers(selectedAnswers, questions);
    setResultData(result);
    setShowResult(true);

    // Trigger confetti if passed
    if (result.passed) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#10b981', '#f59e0b']
      });
    }
  };

  const isAnswered = currentQ && selectedAnswers[currentQ.id] !== undefined;
  const eligibility = isUserEligibleForMentor(currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">6-Reel Micro-Assessment</h3>
              <p className="text-[11px] text-slate-500">Test concepts from the 6 Learn reels & unlock rewards</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!showResult && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono text-amber-600 font-bold shadow-xs">
                <Clock size={13} />
                <span>{timeLeft}s</span>
              </div>
            )}

            <button
              onClick={closeAssessment}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!showResult ? (
            /* ACTIVE QUIZ QUESTIONS (1 to 6) */
            <div className="space-y-6">
              {/* Progress indicator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span className="text-blue-600 font-mono">{currentQ?.category}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-200"
                    style={{ width: `${((currentQuestionIndex + 1) / (questions.length || 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              {currentQ && (
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {currentQ.prompt}
                  </h4>

                  <div className="space-y-2.5">
                    {currentQ.options.map((opt, idx) => {
                      const isSelected = selectedAnswers[currentQ.id] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{opt}</span>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <Check size={12} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* RESULTS SCREEN */
            <div className="space-y-6 animate-in fade-in">
              {resultData && (
                <>
                  {/* Score Card Hero */}
                  <div
                    className={`p-6 rounded-2xl border text-center space-y-3 ${
                      resultData.passed
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-rose-50/70 border-rose-200'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white shadow-md ${
                        resultData.passed ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    >
                      {resultData.passed ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                    </div>

                    <div>
                      <span className="text-3xl font-black font-display text-slate-900">
                        {resultData.scorePercentage}%
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">
                        {resultData.passed ? 'Assessment Passed! 🎉' : 'Assessment Incomplete'}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        You answered {resultData.correctCount} out of {resultData.totalQuestions} questions correctly.
                        {resultData.passed
                          ? ' Minimum threshold (80%) satisfied.'
                          : ' You need 80% to pass. You can retake anytime!'}
                      </p>
                    </div>
                  </div>

                  {/* Rewards Breakdown */}
                  {resultData.passed && resultData.rewardsEarned && (
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                        <Gift size={16} className="text-blue-600" />
                        <span>Rewards Credited to Your Account</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-white border border-blue-100 font-semibold text-slate-800">
                          <span className="text-[10px] text-slate-400 block">Experience Points</span>
                          <span className="text-blue-600 font-bold">+{resultData.rewardsEarned.points} XP</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-blue-100 font-semibold text-slate-800">
                          <span className="text-[10px] text-slate-400 block">Streak Update</span>
                          <span className="text-amber-600 font-bold">🔥 +1 Day Streak</span>
                        </div>
                      </div>

                      {resultData.rewardsEarned.voucher && (
                        <div className="p-3 rounded-lg bg-white border border-blue-200 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              25% Off Voucher
                            </span>
                            <p className="text-xs font-mono font-bold text-slate-900 mt-1">
                              {resultData.rewardsEarned.voucher.code}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(resultData.rewardsEarned?.voucher?.code || '');
                              showToast('Voucher code copied to clipboard!', 'success');
                            }}
                            className="px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Copy size={12} />
                            <span>Copy</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mentor Eligibility Milestone */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
                    <UserCheck size={18} className="text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Mentor Qualification Progress:</span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">
                        {eligibility.isEligible
                          ? '🎉 You have satisfied all mentor eligibility criteria! You can now apply for verified Mentor status.'
                          : eligibility.reason}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {!showResult ? (
            <>
              <button
                onClick={closeAssessment}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                Exit
              </button>

              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                  isAnswered
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Assessment'}</span>
                <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setShowResult(false);
                  setCurrentQuestionIndex(0);
                  setSelectedAnswers({});
                  setTimeLeft(90);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Retake Quiz</span>
              </button>

              <button
                onClick={closeAssessment}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
