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
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AssessmentModalProps {
  onOpenSellerModal?: () => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({ onOpenSellerModal }) => {
  const {
    isAssessmentOpen,
    closeAssessment,
    assessmentQueue,
    submitAssessmentAnswers,
    latestAssessmentResult,
    resetAssessmentResult,
    adminSettings,
    currentUser,
  } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<AssessmentResult | null>(null);

  // Extract all questions from the assessment queue
  const questions: Question[] = assessmentQueue.flatMap(r => r.questions);

  // Reset state when opening
  useEffect(() => {
    if (isAssessmentOpen) {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setTimeLeft(60);
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
  }, [isAssessmentOpen, showResult, selectedAnswers]);

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
    const result = submitAssessmentAnswers(selectedAnswers);
    setResultData(result);
    setShowResult(true);

    // Trigger celebratory confetti if passed
    if (result.passed) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#06b6d4', '#10b981', '#fbbf24']
      });
    }
  };

  const isAnswered = currentQ && selectedAnswers[currentQ.id] !== undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-xl glass-panel bg-slate-900/95 border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">5-Reel Micro-Assessment</h3>
              <p className="text-[11px] text-slate-400">Reinforce what you learned & earn rewards</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!showResult && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 border border-white/10 text-xs font-mono text-amber-300">
                <Clock size={13} />
                <span>{timeLeft}s</span>
              </div>
            )}

            <button
              onClick={closeAssessment}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!showResult ? (
            /* Quiz Active View */
            <div className="space-y-6">
              {/* Progress and Category Bar */}
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  {currentQ?.category || 'General'}
                </span>
                <span className="text-slate-400 font-medium">
                  Question <strong className="text-white">{currentQuestionIndex + 1}</strong> of {questions.length}
                </span>
              </div>

              {/* Progress Meter */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Prompt */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/10">
                <h4 className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                  {currentQ?.prompt}
                </h4>
              </div>

              {/* Option Choices */}
              <div className="space-y-2.5">
                {currentQ?.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-600/30 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                          : 'bg-slate-800/40 border-white/5 text-slate-300 hover:bg-slate-800/80 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span>{opt}</span>
                      </div>

                      {isSelected && <Check size={16} className="text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Result Screen */
            resultData && (
              <div className="space-y-6 text-center py-2 animate-in zoom-in-95">
                {/* Status Hero */}
                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl mb-3 ${
                    resultData.passed
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-emerald-500/30'
                      : 'bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-rose-500/30'
                  }`}>
                    {resultData.passed ? <Award size={40} /> : <RotateCcw size={40} />}
                  </div>

                  <h3 className="text-2xl font-black text-white">
                    {resultData.passed ? 'Assessment Passed! 🎉' : 'Keep Learning! 📚'}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    {resultData.passed
                      ? `Great job! You achieved ${resultData.scorePercentage}%, meeting the passing threshold of ${adminSettings.passingScoreThreshold}%.`
                      : `You scored ${resultData.scorePercentage}%. The passing threshold is ${adminSettings.passingScoreThreshold}%. Review the explanations below.`}
                  </p>
                </div>

                {/* Score Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Score</span>
                    <p className={`text-lg font-black mt-0.5 ${resultData.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {resultData.scorePercentage}%
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Correct</span>
                    <p className="text-lg font-black text-white mt-0.5">
                      {resultData.correctCount} / {resultData.totalQuestions}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Points Earned</span>
                    <p className="text-lg font-black text-amber-400 mt-0.5">
                      +{resultData.rewardsEarned.points}
                    </p>
                  </div>
                </div>

                {/* Goodies / Unlocked Rewards */}
                {(resultData.rewardsEarned.badge || resultData.rewardsEarned.voucher) && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-blue-950/40 border border-blue-500/30 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift size={16} className="text-sky-400" />
                      <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">Goodies & Rewards Credited</span>
                    </div>

                    {resultData.rewardsEarned.badge && (
                      <div className="flex items-center gap-2.5 mt-2 bg-black/40 p-2.5 rounded-xl border border-blue-500/20">
                        <span className="text-2xl">{resultData.rewardsEarned.badge.icon}</span>
                        <div>
                          <strong className="text-xs text-white">{resultData.rewardsEarned.badge.title}</strong>
                          <p className="text-[11px] text-slate-400">{resultData.rewardsEarned.badge.description}</p>
                        </div>
                      </div>
                    )}

                    {resultData.rewardsEarned.voucher && (
                      <div className="flex items-center justify-between gap-2.5 mt-2 bg-black/40 p-2.5 rounded-xl border border-sky-500/20">
                        <div>
                          <strong className="text-xs text-amber-300 font-mono">{resultData.rewardsEarned.voucher.code}</strong>
                          <p className="text-[11px] text-slate-400">{resultData.rewardsEarned.voucher.discountPercent}% OFF Course Discount Voucher</p>
                        </div>
                        <span className="text-[10px] bg-sky-600 text-white font-bold px-2 py-0.5 rounded">UNLOCKED</span>
                      </div>
                    )}
                  </div>
                )}

                {/* XP and Course Voucher Promo */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-between text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                      <Zap size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-300">Level Up Faster!</div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight max-w-[200px]">
                        Keep taking assessments to earn XP and unlock exclusive course discount vouchers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Explanations Breakdown */}
                <div className="text-left space-y-2 pt-2 border-t border-white/10">
                  <span className="text-xs font-bold text-slate-300">Question Review & Explanations:</span>
                  {questions.map((q, i) => {
                    const userChoice = selectedAnswers[q.id];
                    const isCorrect = userChoice === q.correctIndex;
                    return (
                      <div key={q.id} className="p-3 rounded-xl bg-slate-800/40 border border-white/5 text-xs">
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <strong className="text-slate-200">{i + 1}. {q.prompt}</strong>
                            <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">
                              <span className="text-blue-300 font-semibold">Explanation:</span> {q.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-900/90 flex items-center justify-between">
          {!showResult ? (
            <>
              <span className="text-xs text-slate-400">
                {isAnswered ? 'Answer selected' : 'Please select an option'}
              </span>

              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="px-5 py-2 rounded-xl gradient-btn-primary text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{currentQuestionIndex === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}</span>
                <ArrowRight size={15} />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-end gap-3">
              <button
                onClick={closeAssessment}
                className="px-5 py-2 rounded-xl gradient-btn-primary text-xs font-bold"
              >
                Back to Learning Feed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
