/**
 * LMS Frontend API Client (Node.js Express + MongoDB Atlas Backend)
 * Base URL: http://localhost:5000/api
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('lms_auth_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = {
      ...this.getHeaders(),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.detail || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error);
      throw error;
    }
  }

  // Health
  public async getHealth() {
    return this.request('/health');
  }

  // Auth
  public async login(credentials: { email: string; password?: string; role?: string }) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.token) {
      localStorage.setItem('lms_auth_token', res.token);
    }
    return res;
  }

  public async register(userData: { name: string; email: string; password?: string; avatar?: string }) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (res.token) {
      localStorage.setItem('lms_auth_token', res.token);
    }
    return res;
  }

  public async mentorApply(mentorData: {
    name: string;
    email: string;
    password?: string;
    expertise?: string;
    experienceYears?: number;
    bio?: string;
    portfolioUrl?: string;
    skills?: string[];
  }) {
    return this.request('/auth/mentor-apply', {
      method: 'POST',
      body: JSON.stringify(mentorData),
    });
  }

  public async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  public async getMe() {
    return this.request('/auth/me');
  }

  public async switchRole(role: string) {
    const res = await this.request('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    if (res.token) {
      localStorage.setItem('lms_auth_token', res.token);
    }
    return res;
  }

  public logout() {
    localStorage.removeItem('lms_auth_token');
  }

  // Users
  public async getUsers(params?: { role?: string; status?: string; search?: string }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/users${qs ? `?${qs}` : ''}`);
  }

  public async getUser(userId: string) {
    return this.request(`/users/${userId}`);
  }

  public async updateUser(userId: string, updates: any) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  public async toggleUserStatus(userId: string) {
    return this.request(`/users/${userId}/toggle-status`, {
      method: 'POST',
    });
  }

  // Reels
  public async getReels(params?: { category?: string; subject?: string; difficulty?: string; publishedOnly?: boolean; search?: string }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/reels${qs ? `?${qs}` : ''}`);
  }

  public async getReel(reelId: string) {
    return this.request(`/reels/${reelId}`);
  }

  public async createReel(reelData: any) {
    return this.request('/reels', {
      method: 'POST',
      body: JSON.stringify(reelData),
    });
  }

  public async updateReel(reelId: string, updates: any) {
    return this.request(`/reels/${reelId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  public async deleteReel(reelId: string) {
    return this.request(`/reels/${reelId}`, {
      method: 'DELETE',
    });
  }

  public async likeReel(reelId: string) {
    return this.request(`/reels/${reelId}/like`, { method: 'POST' });
  }

  public async markLearnReelComplete(reelId: string, userId?: string) {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return this.request(`/reels/${reelId}/learn-complete${qs}`, { method: 'POST' });
  }

  public async getWatchedStatus(userId: string) {
    return this.request(`/reels/watched-status/${userId}`);
  }

  // Courses
  public async getCourses(params?: { category?: string; level?: string; instructorId?: string; status?: string; search?: string }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/courses${qs ? `?${qs}` : ''}`);
  }

  public async getCourse(courseId: string) {
    return this.request(`/courses/${courseId}`);
  }

  public async createCourse(courseData: any) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  public async updateCourse(courseId: string, updates: any) {
    return this.request(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  public async deleteCourse(courseId: string) {
    return this.request(`/courses/${courseId}`, {
      method: 'DELETE',
    });
  }

  public async enrollCourse(courseId: string, discountCode?: string) {
    return this.request(`/courses/${courseId}/enroll`, {
      method: 'POST',
      body: JSON.stringify({ discountCode }),
    });
  }

  public async markCourseReelComplete(courseId: string, reelId: string, userId?: string) {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return this.request(`/courses/${courseId}/reels/${reelId}/complete${qs}`, { method: 'POST' });
  }

  // Assessments
  public async checkEligibility(userId: string) {
    return this.request(`/assessments/eligibility/${userId}`);
  }

  public async getAssessmentQuestions() {
    return this.request('/assessments/questions');
  }

  public async submitAssessment(data: { userId?: string; answers: Record<string, number>; customQuestions?: any[] }) {
    return this.request('/assessments/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getAssessmentHistory(userId: string) {
    return this.request(`/assessments/history/${userId}`);
  }

  // Approvals
  public async getApprovals(params?: { status?: string; contentType?: string; creatorId?: string }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/approvals${qs ? `?${qs}` : ''}`);
  }

  public async submitForApproval(data: any) {
    return this.request('/approvals/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async processApprovalAction(itemId: string, data: { action: string; feedback?: string; publishImmediately?: boolean }) {
    return this.request(`/approvals/${itemId}/action`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Mentors
  public async getMentors() {
    return this.request('/mentors');
  }

  public async getMentorApplications(status?: string) {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.request(`/mentors/applications${qs}`);
  }

  public async submitMentorApplication(applicationData: any) {
    return this.request('/mentors/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  public async reviewMentorApplication(appId: string, data: { action: string; feedback?: string; reviewerName?: string }) {
    return this.request(`/mentors/applications/${appId}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Rewards & Leaderboard
  public async getBadgeDefinitions() {
    return this.request('/rewards/badge-definitions');
  }

  public async getVouchers() {
    return this.request('/rewards/vouchers');
  }

  public async redeemVoucher(code: string, coursePrice?: number) {
    return this.request('/rewards/vouchers/redeem', {
      method: 'POST',
      body: JSON.stringify({ code, coursePrice }),
    });
  }

  public async getLeaderboard() {
    return this.request('/rewards/leaderboard');
  }

  // Feedback & Comments
  public async getCourseFeedback(courseId: string) {
    return this.request(`/feedback/courses/${courseId}`);
  }

  public async submitCourseFeedback(courseId: string, data: { rating: number; comment: string; userName?: string }) {
    return this.request(`/feedback/courses/${courseId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getPlatformFeedback() {
    return this.request('/feedback/platform');
  }

  public async submitPlatformFeedback(data: { rating: number; category: string; comment: string }) {
    return this.request('/feedback/platform', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getReelComments(reelId: string) {
    return this.request(`/comments/reels/${reelId}`);
  }

  public async addReelComment(reelId: string, data: { content: string; userName?: string }) {
    return this.request(`/comments/reels/${reelId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Notifications
  public async getNotifications(userId?: string) {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return this.request(`/notifications${qs}`);
  }

  public async markNotificationRead(notifId: string) {
    return this.request(`/notifications/${notifId}/read`, { method: 'POST' });
  }

  // Analytics & Settings
  public async getAdminAnalytics() {
    return this.request('/analytics/admin');
  }

  public async getPlatformOverview() {
    return this.request('/analytics/overview');
  }

  public async getAdminSettings() {
    return this.request('/settings');
  }

  public async updateAdminSettings(settings: any) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // AI Tutor & Insights
  public async getAIInsights(userId?: string) {
    return this.request('/ai/insights', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  public async askAITutor(message: string, context?: { userId?: string; courseId?: string; reelId?: string }) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, ...(context || {}) }),
    });
  }
}

export const api = new ApiService();
export default api;
