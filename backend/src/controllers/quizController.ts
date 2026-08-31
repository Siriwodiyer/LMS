import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { Quiz } from '../types/index.js';

export const getQuizzes = (req: Request, res: Response): void => {
  try {
    const { courseId } = req.query;
    const quizzes = db.getQuizzes(courseId as string);
    res.json({ success: true, count: quizzes.length, quizzes });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getQuizById = (req: Request, res: Response): void => {
  try {
    const quiz = db.getQuizById(req.params.id);
    if (!quiz) {
      res.status(404).json({ success: false, message: 'Quiz not found.' });
      return;
    }
    res.json({ success: true, quiz });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createQuiz = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const data = req.body;
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      courseId: data.courseId || 'course-1',
      courseTitle: data.courseTitle || 'Course Quiz',
      moduleId: data.moduleId || 'mod-1',
      moduleTitle: data.moduleTitle || 'Module 1',
      title: data.title || 'Course Module Assessment',
      difficulty: data.difficulty || 'Intermediate',
      totalMarks: data.totalMarks || 30,
      passingPercentage: data.passingPercentage || 80,
      questions: data.questions || [],
      createdAt: new Date().toISOString()
    };

    const saved = db.insertQuiz(newQuiz);
    res.status(201).json({ success: true, message: 'Quiz created successfully.', quiz: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateQuiz = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateQuiz(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Quiz not found.' });
      return;
    }
    res.json({ success: true, message: 'Quiz updated successfully.', quiz: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteQuiz = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = db.deleteQuiz(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Quiz not found.' });
      return;
    }
    res.json({ success: true, message: 'Quiz deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitQuiz = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // { [questionId]: selectedIndex }
    const userId = req.user?.id || req.body.userId || 'user-student';

    const quiz = db.getQuizById(id);
    if (!quiz) {
      res.status(404).json({ success: false, message: 'Quiz not found.' });
      return;
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach(q => {
      const chosen = answers[q.id];
      if (chosen !== undefined && chosen === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = scorePercentage >= quiz.passingPercentage;

    // Award XP/Points if passed
    if (passed) {
      const user = db.getUserById(userId);
      if (user) {
        const points = (user.points || 0) + 100;
        const xp = (user.xp || 0) + 200;
        db.updateUser(userId, {
          points,
          xp,
          recentActivity: [
            {
              id: `act-${Date.now()}`,
              type: 'quiz',
              title: `Completed ${quiz.title}`,
              description: `Scored ${scorePercentage}% on assessment quiz`,
              timestamp: 'Just now',
              scoreOrPoints: '+200 XP'
            },
            ...(user.recentActivity || [])
          ]
        });
      }
    }

    res.json({
      success: true,
      quizId: id,
      totalQuestions,
      correctCount,
      scorePercentage,
      passed,
      passingPercentage: quiz.passingPercentage,
      message: passed ? 'Congratulations! You passed the quiz.' : 'Quiz completed. Keep practicing to reach passing threshold.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
