import React, { useState, useEffect } from 'react';
import { Quiz, Course, Question, AssessmentResult } from '../../types';
import { useApp } from '../../context/AppContext';
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
  Clock,
  TrendingUp,
  X,
  ArrowLeft,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CourseQuizModalProps {
  quiz: Quiz;
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseQuizModal: React.FC<CourseQuizModalProps> = ({
  quiz,
  course,
  isOpen,
  onClose
}) => {
  const {
    currentUser,
    submitAssessmentAnswers,
    showToast,
    adminSettings
  } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(120);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<AssessmentResult | null>(null);

  const questions: Question[] = quiz.questions || [];

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setTimeLeft(120);
      setShowResult(false);
      setResultData(null);
    }
  }, [isOpen, quiz.id]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || showResult) return;
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
  }, [isOpen, showResult, selectedAnswers, questions]);

  if (!isOpen) return null;

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
    if (questions.length === 0) return;

    let correctCount = 0;
    const answeredMap: Record<string, number> = {};

    questions.forEach(q => {
      const selected = selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : -1;
      answeredMap[q.id] = selected;
      if (selected === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passingThreshold = adminSettings.passingScoreThreshold || 70;
    const isPassed = scorePercentage >= passingThreshold;

    const result: AssessmentResult = {
      id: `result-${Date.now()}`,
      userId: currentUser.id,
      reelIds: [],
      scorePercentage,
      passed: isPassed,
      totalQuestions: questions.length,
      correctCount,
      completedAt: new Date().toISOString(),
      rewardsEarned: {
        points: scorePercentage
      }
    };

    setResultData(result);
    setShowResult(true);

    if (isPassed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
      showToast(`Quiz Passed! Score: ${scorePercentage}%`, 'success');
    } else {
      showToast(`Quiz Score: ${scorePercentage}%. Minimum required is ${passingThreshold}%.`, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-100 transition-colors">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Zap size={16} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block tracking-wider">
                {course.title} • Milestone Quiz
              </span>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {quiz.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!showResult && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold">
                <Clock size={13} className={timeLeft < 30 ? 'text-rose-500 animate-pulse' : 'text-slate-400'} />
                <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {showResult && resultData ? (
            /* Results View */
            <div className="space-y-6 text-center py-4">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-lg ${
                resultData.passed ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'
              }`}>
                {resultData.passed ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  {resultData.passed ? 'Assessment Passed!' : 'Requires Review'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  {resultData.passed
                    ? 'Congratulations! You demonstrated strong conceptual understanding of the course principles.'
                    : `You scored ${resultData.scorePercentage}%. Review the course reels and try again.`}
                </p>
              </div>

              {/* Score Tile */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
                  <strong className={`text-base font-bold ${resultData.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {resultData.scorePercentage}%
                  </strong>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Correct</span>
                  <strong className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {resultData.correctCount} / {resultData.totalQuestions}
                  </strong>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                  <strong className={`text-xs font-bold uppercase ${resultData.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {resultData.passed ? 'Passed' : 'Failed'}
                  </strong>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers({});
                    setTimeLeft(120);
                    setShowResult(false);
                    setResultData(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Retake Quiz</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  Close & Return
                </button>
              </div>
            </div>
          ) : currentQ ? (
            /* Active Quiz Question View */
            <div className="space-y-6">
              {/* Question Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.prompt}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-200 shadow-xs'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-xs font-semibold leading-relaxed">{option}</span>
                      </div>
                      {isSelected && <Check size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                >
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQ.id] === undefined}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              No questions found for this quiz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
