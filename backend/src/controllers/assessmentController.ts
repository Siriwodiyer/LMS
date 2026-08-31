import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { AssessmentResult, Question, Badge, DiscountVoucher } from '../types/index.js';

export const getAssessmentQuestions = (req: Request, res: Response): void => {
  try {
    const reels = db.getReels();
    const questions: Question[] = [];

    reels.forEach(reel => {
      if (reel.questions && reel.questions.length > 0) {
        reel.questions.forEach(q => {
          questions.push({
            ...q,
            reelId: reel.id
          });
        });
      }
    });

    res.json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitAssessment = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { answers, customQuestions } = req.body; // answers: Record<string, number>
    const userId = req.user?.id || req.body.userId || 'user-student';
    const settings = db.getAdminSettings();
    const user = db.getUserById(userId);

    // Retrieve active questions
    let questionsToEvaluate: Question[] = [];
    if (customQuestions && Array.isArray(customQuestions) && customQuestions.length > 0) {
      questionsToEvaluate = customQuestions;
    } else {
      const reels = db.getReels();
      reels.forEach(r => {
        if (r.questions) questionsToEvaluate.push(...r.questions);
      });
    }

    let correctCount = 0;
    const totalQuestions = questionsToEvaluate.length || 6;

    questionsToEvaluate.forEach(q => {
      const chosen = answers[q.id];
      if (chosen !== undefined && chosen === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = scorePercentage >= (settings.passingScoreThreshold || 80);

    const rewards: {
      points: number;
      badge?: Badge;
      voucher?: DiscountVoucher;
      goodie?: string;
    } = {
      points: correctCount * (settings.pointsPerCorrectAnswer || 50)
    };

    if (passed) {
      // Award Speed Learner Badge if not already owned
      const existingBadge = user?.badges?.find(b => b.title === 'Speed Learner');
      const awardedBadge: Badge = existingBadge || {
        id: `badge-${Date.now()}`,
        title: 'Speed Learner',
        description: `Completed 6-reel micro-assessment with ${scorePercentage}% score!`,
        icon: '⚡',
        unlockedAt: new Date().toISOString(),
        rarity: 'rare'
      };
      rewards.badge = awardedBadge;

      // Award Discount Voucher
      const voucherCode = `ASSESS${Math.floor(1000 + Math.random() * 9000)}`;
      const awardedVoucher: DiscountVoucher = {
        id: `vouch-${Date.now()}`,
        code: voucherCode,
        discountPercent: scorePercentage >= 90 ? 50 : 30,
        description: `${scorePercentage >= 90 ? '50%' : '30%'} off any course on LMS platform (Assessment Pass Reward)`,
        expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
        isUsed: false
      };
      rewards.voucher = awardedVoucher;
      rewards.goodie = scorePercentage === 100 ? 'Exclusive LMS Developer Swag Pack' : undefined;

      // Update User in DB
      if (user) {
        const points = (user.points || 0) + rewards.points + 200;
        const xp = (user.xp || 0) + 300;
        const userBadges = existingBadge ? user.badges : [awardedBadge, ...(user.badges || [])];
        const userVouchers = [awardedVoucher, ...(user.discountVouchers || [])];

        db.updateUser(userId, {
          points,
          xp,
          badges: userBadges,
          discountVouchers: userVouchers,
          recentActivity: [
            {
              id: `act-${Date.now()}`,
              type: 'quiz',
              title: 'Passed 6-Reel Micro-Assessment',
              description: `Scored ${scorePercentage}%! Unlocked ${awardedVoucher.discountPercent}% Voucher & Speed Learner Badge`,
              timestamp: 'Just now',
              scoreOrPoints: `+${rewards.points + 200} XP`
            },
            ...(user.recentActivity || [])
          ]
        });

        // Insert notification
        db.insertNotification({
          id: `notif-${Date.now()}`,
          userId,
          title: '🎉 Micro-Assessment Passed!',
          message: `Congratulations! You scored ${scorePercentage}%. +${rewards.points + 200} XP and voucher ${voucherCode} credited!`,
          type: 'reward',
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    const result: AssessmentResult = {
      id: `res-${Date.now()}`,
      userId,
      reelIds: questionsToEvaluate.map(q => q.reelId || q.id),
      totalQuestions,
      correctCount,
      scorePercentage,
      passed,
      completedAt: new Date().toISOString(),
      rewardsEarned: rewards
    };

    db.insertAssessmentResult(result);

    res.json({
      success: true,
      result,
      message: passed
        ? `Congratulations! You passed with ${scorePercentage}%!`
        : `You scored ${scorePercentage}%. Passing score is ${settings.passingScoreThreshold}%. Review the reels and try again!`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAssessmentHistory = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id || (req.query.userId as string) || 'user-student';
    const history = db.getAssessmentHistory(userId);
    res.json({ success: true, count: history.length, history });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
