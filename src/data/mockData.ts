import {
  User,
  Reel,
  Course,
  Lesson,
  Quiz,
  Assignment,
  ArticleNote,
  Comment,
  NotificationItem,
  EnrolledStudent,
  AdminAnalytics,
  Badge,
  BadgeDefinition,
  DiscountVoucher,
  ContentApprovalItem
} from '../types';

export const INITIAL_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'badge-def-1',
    title: 'Java Beginner',
    description: 'Complete Java Fundamentals course with quiz score >= 70%',
    icon: '☕',
    rarity: 'common',
    conditionType: 'quiz_score',
    conditionCourseId: 'course-java',
    conditionThreshold: 70,
    conditionText: 'Complete Java Fundamentals course with quiz score >= 70%',
    isActive: true,
    earnedCount: 42,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'badge-def-2',
    title: 'Speed Learner',
    description: 'Completed your first 5-reel micro-assessment with a perfect score!',
    icon: '⚡',
    rarity: 'rare',
    conditionType: 'reels_watched',
    conditionThreshold: 5,
    conditionText: 'Score 100% on a 5-reel micro-assessment',
    isActive: true,
    earnedCount: 128,
    createdAt: '2026-08-05T00:00:00Z',
  },
  {
    id: 'badge-def-3',
    title: 'Streak Master',
    description: 'Maintained a 7-day continuous learning streak.',
    icon: '🔥',
    rarity: 'epic',
    conditionType: 'streak_days',
    conditionThreshold: 7,
    conditionText: 'Maintain 7 consecutive days active streak',
    isActive: true,
    earnedCount: 84,
    createdAt: '2026-08-10T00:00:00Z',
  },
  {
    id: 'badge-def-4',
    title: 'DSA Champion',
    description: 'Master binary search trees, graph algorithms, and dynamic programming.',
    icon: '🌳',
    rarity: 'legendary',
    conditionType: 'quiz_score',
    conditionCourseId: 'course-dsa',
    conditionThreshold: 85,
    conditionText: 'Complete Data Structures & Algorithms course with >= 85%',
    isActive: true,
    earnedCount: 19,
    createdAt: '2026-08-12T00:00:00Z',
  },
  {
    id: 'badge-def-5',
    title: 'Full-Stack Architect',
    description: 'Aced React 19 & Agentic AI workflows masterclass.',
    icon: '💻',
    rarity: 'epic',
    conditionType: 'course_completion',
    conditionCourseId: 'course-1',
    conditionThreshold: 100,
    conditionText: 'Complete 100% of Modern AI Architecture course',
    isActive: true,
    earnedCount: 35,
    createdAt: '2026-08-15T00:00:00Z',
  },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    title: 'Speed Learner',
    description: 'Completed your first 5-reel micro-assessment with a perfect score!',
    icon: '⚡',
    unlockedAt: '2026-08-20T10:00:00Z',
    rarity: 'rare',
  },
  {
    id: 'badge-2',
    title: 'Streak Master',
    description: 'Maintained a 7-day continuous learning streak.',
    icon: '🔥',
    unlockedAt: '2026-08-22T14:30:00Z',
    rarity: 'epic',
  },
  {
    id: 'badge-3',
    title: 'Java Beginner',
    description: 'Complete Java Fundamentals course with quiz score >= 70%',
    icon: '☕',
    unlockedAt: '2026-08-23T09:15:00Z',
    rarity: 'common',
  },
  {
    id: 'badge-4',
    title: 'DSA Champion',
    description: 'Master binary search trees, graph algorithms, and dynamic programming.',
    icon: '🌳',
    unlockedAt: '2026-08-24T08:00:00Z',
    rarity: 'legendary',
  },
];

export const INITIAL_VOUCHERS: DiscountVoucher[] = [
  {
    id: 'vouch-1',
    code: 'REELPRO30',
    discountPercent: 30,
    description: '30% off any premium course on the marketplace',
    expiresAt: '2026-09-30T23:59:59Z',
    isUsed: false,
  },
  {
    id: 'vouch-2',
    code: 'MASTER50',
    discountPercent: 50,
    description: '50% off Next.js Masterclass (Earned via Assessment Pass)',
    expiresAt: '2026-09-15T23:59:59Z',
    isUsed: false,
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-student',
    name: 'Yashwanth Gowda',
    email: 'yashwanth.gowda@lms.ai',
    role: 'student',
    status: 'active',
    points: 1450,
    xp: 2850,
    streakDays: 7,
    level: 4,
    bio: 'Aspiring Full-Stack AI Engineer. Learning through bite-sized reels & interactive masterclasses daily!',
    assignedMentorId: 'user-mentor',
    assignedMentorName: 'Dr. Meera Iyer',
    enrolledCourseIds: ['course-1', 'course-2', 'course-java'],
    completedCourseIds: ['course-3'],
    badges: INITIAL_BADGES,
    discountVouchers: INITIAL_VOUCHERS,
    weeklyHours: [2.5, 3.8, 4.2, 1.9, 5.1, 6.0, 4.5],
    totalLearningHours: 42.5,
    quizAverage: 92,
    completedLessonsCount: 18,
    reelsWatchedTotal: 65,
    assignmentsCompletedCount: 4,
    registeredAt: '2026-07-15T10:00:00Z',
    lastActive: '2026-08-25T11:45:00Z',
    recentActivity: [
      {
        id: 'act-1',
        type: 'quiz',
        title: 'Aced React 19 Micro-Assessment',
        description: 'Scored 100% on 5-question automated assessment',
        timestamp: '2 hours ago',
        scoreOrPoints: '+100 XP'
      },
      {
        id: 'act-2',
        type: 'reel',
        title: 'Watched 5 Tech & AI Reels',
        description: 'Completed reel series on LLM Function Calling',
        timestamp: 'Yesterday',
        scoreOrPoints: '+50 pts'
      },
      {
        id: 'act-3',
        type: 'badge',
        title: 'Unlocked "Streak Master" Badge',
        description: 'Maintained 7 days continuous streak',
        timestamp: '2 days ago',
        scoreOrPoints: 'Epic Badge'
      },
      {
        id: 'act-4',
        type: 'course',
        title: 'Progressed in AI Architecture Course',
        description: 'Finished Module 2: Structured Output & Tool Calling',
        timestamp: '3 days ago',
        scoreOrPoints: '68% Complete'
      }
    ]
  },
  {
    id: 'user-learner-2',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@lms.ai',
    role: 'student',
    status: 'active',
    points: 980,
    xp: 1950,
    streakDays: 4,
    level: 3,
    bio: 'Computer Science sophomore focusing on DSA and System Design.',
    assignedMentorId: 'user-mentor-2',
    assignedMentorName: 'Rakesh Verma',
    enrolledCourseIds: ['course-dsa', 'course-2'],
    completedCourseIds: [],
    badges: [INITIAL_BADGES[0], INITIAL_BADGES[2]],
    discountVouchers: [],
    weeklyHours: [1.8, 2.4, 3.1, 2.0, 4.0, 3.5, 2.2],
    totalLearningHours: 28.0,
    quizAverage: 84,
    completedLessonsCount: 11,
    reelsWatchedTotal: 42,
    assignmentsCompletedCount: 2,
    registeredAt: '2026-08-01T09:30:00Z',
    lastActive: '2026-08-25T08:15:00Z',
    recentActivity: [
      {
        id: 'act-201',
        type: 'quiz',
        title: 'Completed Binary Search Trees Quiz',
        description: 'Scored 85% on DSA Module 1',
        timestamp: 'Yesterday',
        scoreOrPoints: '+80 XP'
      }
    ]
  },
  {
    id: 'user-learner-3',
    name: 'Priya Sharma',
    email: 'priya.sharma@lms.ai',
    role: 'student',
    status: 'active',
    points: 2150,
    xp: 4300,
    streakDays: 14,
    level: 5,
    bio: 'Backend developer transitioning to Cloud & Distributed Systems.',
    assignedMentorId: 'user-mentor',
    assignedMentorName: 'Dr. Meera Iyer',
    enrolledCourseIds: ['course-1', 'course-java', 'course-dbms'],
    completedCourseIds: ['course-java'],
    badges: INITIAL_BADGES,
    discountVouchers: [INITIAL_VOUCHERS[0]],
    weeklyHours: [3.5, 4.0, 5.2, 4.8, 6.0, 5.5, 4.0],
    totalLearningHours: 56.4,
    quizAverage: 96,
    completedLessonsCount: 24,
    reelsWatchedTotal: 98,
    assignmentsCompletedCount: 6,
    registeredAt: '2026-07-01T14:00:00Z',
    lastActive: '2026-08-25T10:30:00Z',
    recentActivity: [
      {
        id: 'act-301',
        type: 'course',
        title: 'Completed Java Fundamentals Course',
        description: 'Earned Java Beginner Badge with 96% score',
        timestamp: '3 days ago',
        scoreOrPoints: '100% Done'
      }
    ]
  },
  {
    id: 'user-learner-4',
    name: 'Kiran Kumar',
    email: 'kiran.kumar@devmail.io',
    role: 'student',
    status: 'inactive',
    points: 340,
    xp: 600,
    streakDays: 0,
    level: 1,
    bio: 'Exploring career transition to web development.',
    assignedMentorId: 'user-mentor-2',
    assignedMentorName: 'Rakesh Verma',
    enrolledCourseIds: ['course-2'],
    completedCourseIds: [],
    badges: [],
    discountVouchers: [],
    weeklyHours: [0.5, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],
    totalLearningHours: 6.2,
    quizAverage: 62,
    completedLessonsCount: 3,
    reelsWatchedTotal: 12,
    assignmentsCompletedCount: 0,
    registeredAt: '2026-08-10T11:00:00Z',
    lastActive: '2026-08-18T16:20:00Z',
    recentActivity: []
  },
  {
    id: 'user-learner-5',
    name: 'Ananya Reddy',
    email: 'ananya.reddy@polytech.edu',
    role: 'student',
    status: 'active',
    points: 1680,
    xp: 3200,
    streakDays: 9,
    level: 4,
    bio: 'Software engineer eager to master DBMS and Operating Systems.',
    assignedMentorId: 'user-mentor-3',
    assignedMentorName: 'Prof. Deepak Nair',
    enrolledCourseIds: ['course-dbms', 'course-dsa'],
    completedCourseIds: [],
    badges: [INITIAL_BADGES[0], INITIAL_BADGES[1]],
    discountVouchers: [INITIAL_VOUCHERS[1]],
    weeklyHours: [2.0, 3.2, 4.5, 3.8, 4.0, 5.0, 3.5],
    totalLearningHours: 36.8,
    quizAverage: 89,
    completedLessonsCount: 15,
    reelsWatchedTotal: 58,
    assignmentsCompletedCount: 3,
    registeredAt: '2026-07-28T09:00:00Z',
    lastActive: '2026-08-25T09:40:00Z',
    recentActivity: []
  },
  {
    id: 'user-mentor',
    name: 'Dr. Meera Iyer',
    email: 'meera.iyer@lms.ai',
    role: 'mentor',
    status: 'active',
    points: 8400,
    xp: 12500,
    streakDays: 45,
    level: 8,
    bio: 'Lead AI Scientist & Tech Educator. Author of "Practical Deep Learning" with 40k+ students.',
    specialty: 'Artificial Intelligence & Neural Architectures',
    assignedLearnerIds: ['user-student', 'user-learner-3'],
    enrolledCourseIds: [],
    completedCourseIds: [],
    badges: INITIAL_BADGES,
    discountVouchers: [],
    weeklyHours: [5.0, 6.5, 7.2, 4.8, 8.1, 6.0, 5.5],
    registeredAt: '2026-06-01T08:00:00Z',
    lastActive: '2026-08-25T11:50:00Z',
  },
  {
    id: 'user-mentor-2',
    name: 'Rakesh Verma',
    email: 'rakesh.verma@lms.ai',
    role: 'mentor',
    status: 'active',
    points: 6200,
    xp: 9800,
    streakDays: 32,
    level: 7,
    bio: 'Principal Frontend Architect & Open Source Contributor specializing in TypeScript & React internals.',
    specialty: 'Full-Stack Web & TypeScript Engineering',
    assignedLearnerIds: ['user-learner-2', 'user-learner-4'],
    enrolledCourseIds: [],
    completedCourseIds: [],
    badges: INITIAL_BADGES,
    discountVouchers: [],
    weeklyHours: [4.0, 5.0, 6.0, 4.5, 6.5, 5.0, 4.0],
    registeredAt: '2026-06-15T10:00:00Z',
    lastActive: '2026-08-25T10:15:00Z',
  },
  {
    id: 'user-mentor-3',
    name: 'Prof. Deepak Nair',
    email: 'deepak.nair@lms.ai',
    role: 'mentor',
    status: 'active',
    points: 7100,
    xp: 11200,
    streakDays: 60,
    level: 8,
    bio: 'Systems Engineering Professor. Research in Database Concurrency, Operating Systems & Distributed Consensus.',
    specialty: 'Core CS (DBMS, OS, Computer Networks)',
    assignedLearnerIds: ['user-learner-5'],
    enrolledCourseIds: [],
    completedCourseIds: [],
    badges: INITIAL_BADGES,
    discountVouchers: [],
    weeklyHours: [4.5, 5.5, 6.0, 5.0, 7.0, 4.5, 5.0],
    registeredAt: '2026-05-20T08:00:00Z',
    lastActive: '2026-08-25T07:30:00Z',
  },
  {
    id: 'user-mentor-4',
    name: 'Divya Rao',
    email: 'divya.rao@lms.ai',
    role: 'mentor',
    status: 'inactive',
    points: 3100,
    xp: 4500,
    streakDays: 0,
    level: 5,
    bio: 'Technical Interview Coach and Competitive Programming Master (Candidate Master on Codeforces).',
    specialty: 'DSA & Technical Interview Preparation',
    assignedLearnerIds: [],
    enrolledCourseIds: [],
    completedCourseIds: [],
    badges: [INITIAL_BADGES[0]],
    discountVouchers: [],
    weeklyHours: [1.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0],
    registeredAt: '2026-07-10T12:00:00Z',
    lastActive: '2026-08-15T14:00:00Z',
  },
  {
    id: 'user-admin',
    name: 'Gagan',
    email: 'admin@lms.ai',
    role: 'admin',
    status: 'active',
    points: 9999,
    xp: 25000,
    streakDays: 120,
    level: 10,
    bio: 'Platform Governor & Curriculum Lead at LMS Platform.',
    specialty: 'Platform Operations & Quality Governance',
    assignedLearnerIds: [],
    enrolledCourseIds: [],
    completedCourseIds: [],
    badges: INITIAL_BADGES,
    discountVouchers: [],
    weeklyHours: [6.0, 7.0, 8.0, 6.5, 7.5, 5.0, 6.0],
    registeredAt: '2026-01-01T00:00:00Z',
    lastActive: '2026-08-25T12:00:00Z',
  }
];

export const INITIAL_REELS: Reel[] = [
  {
    id: 'reel-java-1',
    title: 'Java 21 Virtual Threads vs OS Threads in 60s',
    description: 'Learn how Project Loom lightweight threads allow 1 million concurrent tasks without memory exhaustion.',
    category: 'Tech',
    subject: 'Java',
    topic: 'Concurrency & Virtual Threads',
    courseId: 'course-java',
    courseTitle: 'Java Core & Modern Enterprise Architecture',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    creatorId: 'user-admin',
    creatorName: 'Gagan',
    creatorRole: 'Admin',
    difficulty: 'Intermediate',
    durationSeconds: 52,
    likesCount: 2150,
    commentsCount: 124,
    sharesCount: 512,
    viewsCount: 28400,
    isLiked: true,
    isBookmarked: true,
    isPublished: true,
    tags: ['Java', 'VirtualThreads', 'JVM', 'Backend'],
    createdAt: '2026-08-18T10:00:00Z',
    questions: [
      {
        id: 'q-jv-1',
        category: 'Java',
        type: 'mcq',
        prompt: 'What primary problem do Java 21 Virtual Threads solve compared to platform threads?',
        options: [
          'They allow Java bytecode to run natively on GPUs',
          'They provide M:N lightweight threading that avoids blocking 1MB OS stack threads during I/O operations',
          'They remove garbage collection overhead completely',
          'They disable thread synchronization globally'
        ],
        correctIndex: 1,
        explanation: 'Virtual Threads are managed by the JVM rather than the OS, allowing high-throughput concurrent servers without thread pool exhaustion.',
        difficulty: 'Intermediate',
        marks: 5
      }
    ]
  },
  {
    id: 'reel-spring-1',
    title: 'Spring Boot 3: @Transactional Pitfalls & Self-Invocation',
    description: 'Why calling an @Transactional method from inside the same bean skips proxy interception and fails to roll back.',
    category: 'Tech',
    subject: 'Spring Boot',
    topic: 'Transaction Proxies',
    courseId: 'course-java',
    courseTitle: 'Java Core & Modern Enterprise Architecture',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    creatorId: 'user-mentor',
    creatorName: 'Dr. Meera Iyer',
    creatorRole: 'Mentor',
    difficulty: 'Advanced',
    durationSeconds: 58,
    likesCount: 3100,
    commentsCount: 198,
    sharesCount: 890,
    viewsCount: 37200,
    isLiked: false,
    isBookmarked: true,
    isPublished: true,
    tags: ['Spring Boot', 'Transactions', 'AOP', 'Architecture'],
    createdAt: '2026-08-19T14:00:00Z',
    questions: [
      {
        id: 'q-sp-1',
        category: 'Spring Boot',
        type: 'true_false',
        prompt: 'Direct method calls within the same class bypass Spring CGLIB/JDK dynamic proxy interceptors for @Transactional.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! Spring transactions use AOP proxies. Self-invocation calls "this.method()" directly, bypassing the transaction interceptor.',
        difficulty: 'Advanced',
        marks: 5
      }
    ]
  },
  {
    id: 'reel-dsa-1',
    title: 'DSA: Two Pointers vs Sliding Window Visualized',
    description: 'Master when to use Fixed Window, Dynamic Window, and Bidirectional Pointers for array & string problems in O(N).',
    category: 'Tech',
    subject: 'DSA',
    topic: 'Array Algorithms',
    courseId: 'course-dsa',
    courseTitle: 'Data Structures & Algorithms for FAANG Interviews',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    creatorId: 'user-mentor-2',
    creatorName: 'Rakesh Verma',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 49,
    likesCount: 4200,
    commentsCount: 230,
    sharesCount: 1450,
    viewsCount: 52100,
    isLiked: true,
    isBookmarked: false,
    isPublished: true,
    tags: ['DSA', 'Algorithms', 'SlidingWindow', 'CodingInterview'],
    createdAt: '2026-08-20T11:00:00Z',
    questions: [
      {
        id: 'q-dsa-1',
        category: 'DSA',
        type: 'mcq',
        prompt: 'Which algorithmic technique is optimal for finding the "longest contiguous subarray with sum at most K with positive numbers"?',
        options: ['Dynamic Programming with Memoization', 'Variable-size Sliding Window with two pointers in O(N)', 'Binary Search on the Answer in O(N^2)', 'Dijkstra Shortest Path'],
        correctIndex: 1,
        explanation: 'A dynamic sliding window maintains left and right pointers, expanding right and shrinking left when the sum exceeds K in amortized O(N) time.',
        difficulty: 'Intermediate',
        marks: 5
      }
    ]
  },
  {
    id: 'reel-sql-1',
    title: 'SQL: Clustered vs Non-Clustered Indexes in 60s',
    description: 'Understand how B-Tree leaf nodes store actual row data in clustered indexes versus bookmark pointers in secondary indexes.',
    category: 'Tech',
    subject: 'DBMS',
    topic: 'B-Tree Indexing',
    courseId: 'course-dbms',
    courseTitle: 'Relational Database Management & SQL Mastery',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    creatorId: 'user-mentor-3',
    creatorName: 'Prof. Deepak Nair',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 55,
    likesCount: 1890,
    commentsCount: 95,
    sharesCount: 410,
    viewsCount: 24500,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['SQL', 'DBMS', 'Indexing', 'Databases'],
    createdAt: '2026-08-21T09:30:00Z',
    questions: [
      {
        id: 'q-sql-1',
        category: 'DBMS',
        type: 'mcq',
        prompt: 'Why can a database table have only one Clustered Index?',
        options: [
          'Because SQL standard allows only 1 index per table',
          'Because the clustered index defines the physical sorting order of actual data pages on disk',
          'Because non-clustered indexes cannot reference primary keys',
          'Because memory caches only support 1 index root'
        ],
        correctIndex: 1,
        explanation: 'Data rows on disk can only be physically arranged in one sorted sequence, which is defined by the clustered index.',
        difficulty: 'Intermediate',
        marks: 5
      }
    ]
  },
  {
    id: 'reel-os-1',
    title: 'OS: Deadlock Detection & Banker\'s Algorithm in 60s',
    description: 'The 4 Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait with visual resource allocation graph.',
    category: 'Tech',
    subject: 'Operating Systems',
    topic: 'Concurrency & Deadlocks',
    courseId: 'course-dbms',
    courseTitle: 'Relational Database Management & SQL Mastery',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    creatorId: 'user-mentor-3',
    creatorName: 'Prof. Deepak Nair',
    creatorRole: 'Mentor',
    difficulty: 'Advanced',
    durationSeconds: 56,
    likesCount: 2750,
    commentsCount: 140,
    sharesCount: 680,
    viewsCount: 33800,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['OperatingSystems', 'Deadlock', 'Concurrency', 'ComputerScience'],
    createdAt: '2026-08-22T13:00:00Z',
    questions: [
      {
        id: 'q-os-1',
        category: 'Operating Systems',
        type: 'true_false',
        prompt: 'Breaking even one of the 4 Coffman conditions is sufficient to prevent deadlocks completely.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! All 4 conditions must hold simultaneously for a deadlock to occur. Invalidating any one condition prevents deadlocks.',
        difficulty: 'Intermediate',
        marks: 5
      }
    ]
  },
  {
    id: 'reel-net-1',
    title: 'Computer Networks: TCP 3-Way Handshake & SYN Floods',
    description: 'SYN → SYN-ACK → ACK lifecycle, TCB connection state memory, and how SYN cookies mitigate DDoS attacks.',
    category: 'Tech',
    subject: 'Computer Networks',
    topic: 'Transport Layer Protocols',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    creatorId: 'user-admin',
    creatorName: 'Gagan',
    creatorRole: 'Admin',
    difficulty: 'Intermediate',
    durationSeconds: 51,
    likesCount: 1950,
    commentsCount: 88,
    sharesCount: 390,
    viewsCount: 22100,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['ComputerNetworks', 'TCP', 'Security', 'Handshake'],
    createdAt: '2026-08-23T15:30:00Z',
    questions: [
      {
        id: 'q-net-1',
        category: 'Computer Networks',
        type: 'mcq',
        prompt: 'What defense mechanism prevents a server from allocating half-open connection memory during a SYN flood attack?',
        options: ['DNS Anycast routing', 'SYN Cookies in the initial sequence number', 'Disabling UDP packets', 'Setting TTL to zero'],
        correctIndex: 1,
        explanation: 'SYN Cookies encode connection parameters cryptographically inside the initial sequence number without allocating server memory until the final ACK is received.',
        difficulty: 'Intermediate',
        marks: 5
      }
    ]
  },
  {
    id: 'reel-cpp-1',
    title: 'C++20: RAII & Smart Pointers (unique_ptr vs shared_ptr)',
    description: 'Zero memory leaks: Learn move semantics with unique_ptr and control block reference counting with make_shared.',
    category: 'Tech',
    subject: 'C++',
    topic: 'Modern Memory Management',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    creatorId: 'user-mentor-2',
    creatorName: 'Rakesh Verma',
    creatorRole: 'Mentor',
    difficulty: 'Advanced',
    durationSeconds: 54,
    likesCount: 3400,
    commentsCount: 162,
    sharesCount: 920,
    viewsCount: 41200,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['CPP', 'C++', 'MemoryManagement', 'SmartPointers'],
    createdAt: '2026-08-24T09:00:00Z',
    questions: [
      {
        id: 'q-cpp-1',
        category: 'C++',
        type: 'mcq',
        prompt: 'Why should you prefer `std::make_shared<T>()` over `std::shared_ptr<T>(new T())`?',
        options: [
          'It compiles to pure assembly',
          'It performs a single memory allocation for both the object and the reference control block instead of two',
          'It prevents cyclic references automatically',
          'It makes the object immutable'
        ],
        correctIndex: 1,
        explanation: '`std::make_shared` allocates the object and control block in a single contiguous memory block, reducing heap allocations and improving cache locality.',
        difficulty: 'Advanced',
        marks: 5
      }
    ]
  },
  {
    id: 'reel-interview-1',
    title: 'Interview Preparation: System Design Blueprint for Rate Limiting',
    description: 'Comparing Token Bucket, Leaky Bucket, and Redis Sliding Window Log with real-world latency benchmarks.',
    category: 'Tech',
    subject: 'Interview Preparation',
    topic: 'System Design & Rate Limiters',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    creatorId: 'user-mentor',
    creatorName: 'Dr. Meera Iyer',
    creatorRole: 'Mentor',
    difficulty: 'Advanced',
    durationSeconds: 59,
    likesCount: 5200,
    commentsCount: 310,
    sharesCount: 2100,
    viewsCount: 68000,
    isLiked: false,
    isBookmarked: true,
    isPublished: true,
    tags: ['SystemDesign', 'InterviewPrep', 'DistributedSystems', 'Redis'],
    createdAt: '2026-08-24T16:00:00Z',
    questions: [
      {
        id: 'q-int-1',
        category: 'Interview Preparation',
        type: 'mcq',
        prompt: 'Which rate limiting algorithm is most resilient to bursts while maintaining an average consumption rate?',
        options: ['Fixed Window Counter', 'Token Bucket algorithm', 'Sliding Window Log with full timestamps', 'Strict Round Robin'],
        correctIndex: 1,
        explanation: 'Token Bucket allows bursts up to the capacity of the bucket while refilling tokens at a constant rate, providing flexibility and efficiency.',
        difficulty: 'Advanced',
        marks: 5
      }
    ]
  }
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'les-jv-101',
    courseId: 'course-java',
    moduleId: 'mod-jv-1',
    title: 'JVM Memory Model: Heap, Stack & Metaspace',
    description: 'Understanding GC generational architecture, Young Gen, Old Gen, and Escape Analysis.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    learningObjectives: [
      'Understand JVM memory partition regions',
      'Diagnose OutOfMemoryError scenarios',
      'Optimize JVM flags for low-latency heap sizing'
    ],
    supportingContent: 'Download the JVM Memory Layout cheatsheet and Garbage Collector benchmarking script.',
    estimatedDurationMinutes: 35,
    order: 1,
    viewsCount: 1420,
    isFreePreview: true,
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'les-jv-102',
    courseId: 'course-java',
    moduleId: 'mod-jv-1',
    title: 'Java 21 Pattern Matching & Record Patterns',
    description: 'Writing expressive, boilerplate-free data-oriented code with sealed classes and switch patterns.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    learningObjectives: [
      'Deconstruct records seamlessly with record patterns',
      'Exhaustive switch expressions without default clauses',
      'Compile-time validation with sealed interface hierarchies'
    ],
    estimatedDurationMinutes: 40,
    order: 2,
    viewsCount: 980,
    isFreePreview: false,
    createdAt: '2026-08-02T10:00:00Z'
  },
  {
    id: 'les-dsa-101',
    courseId: 'course-dsa',
    moduleId: 'mod-dsa-1',
    title: 'Amortized Complexity & Dynamic Array Resizing',
    description: 'Mathematical proof of why ArrayList append is O(1) amortized using the accounting method.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    learningObjectives: [
      'Differentiate worst-case vs amortized time complexity',
      'Calculate geometric series sum for vector doubling',
      'Avoid hidden O(N) allocation loops in performance-critical paths'
    ],
    estimatedDurationMinutes: 30,
    order: 1,
    viewsCount: 2150,
    isFreePreview: true,
    createdAt: '2026-08-05T10:00:00Z'
  },
  {
    id: 'les-dsa-102',
    courseId: 'course-dsa',
    moduleId: 'mod-dsa-1',
    title: 'Graph Traversals: BFS vs DFS & Topological Sort',
    description: 'Kahn\'s algorithm for cycle detection in Directed Acyclic Graphs (DAG) with dependency resolution.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    learningObjectives: [
      'Implement in-degree counting and queue-based Kahn algorithm',
      'Detect cycles in build systems and task schedulers',
      'Master BFS shortest path on unweighted graphs'
    ],
    estimatedDurationMinutes: 50,
    order: 2,
    viewsCount: 1840,
    isFreePreview: false,
    createdAt: '2026-08-06T10:00:00Z'
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-jv-1',
    courseId: 'course-java',
    courseTitle: 'Java Core & Modern Enterprise Architecture',
    moduleId: 'mod-jv-1',
    moduleTitle: 'Module 1: JVM Internals & Memory Architecture',
    title: 'JVM Memory & Pattern Matching Assessment',
    difficulty: 'Intermediate',
    totalMarks: 20,
    passingPercentage: 70,
    createdAt: '2026-08-03T10:00:00Z',
    questions: [
      {
        id: 'qz-j-1',
        category: 'Java',
        type: 'mcq',
        prompt: 'Where are String literals and interned strings stored in modern Java (Java 8+)?',
        options: ['Permanent Generation (PermGen)', 'Java Heap (String Pool inside Heap)', 'Native OS Stack', 'Metaspace Off-Heap'],
        correctIndex: 1,
        explanation: 'Starting in Java 7 and finalized in Java 8, the String Constant Pool was relocated to the main Java Heap for unified Garbage Collection.',
        difficulty: 'Intermediate',
        marks: 10
      },
      {
        id: 'qz-j-2',
        category: 'Java',
        type: 'mcq',
        prompt: 'What happens when a switch pattern matches against a `sealed` interface with all subclasses covered?',
        options: [
          'A runtime exception is thrown if default is missing',
          'The compiler verifies exhaustiveness and does not require a `default` case',
          'The switch converts to if-else chains dynamically',
          'Reflection is executed on every iteration'
        ],
        correctIndex: 1,
        explanation: 'Because the sealed hierarchy lists all permissible subtypes at compile time, the compiler can guarantee exhaustive coverage without a fallback default branch.',
        difficulty: 'Intermediate',
        marks: 10
      }
    ]
  },
  {
    id: 'quiz-dsa-1',
    courseId: 'course-dsa',
    courseTitle: 'Data Structures & Algorithms for FAANG Interviews',
    moduleId: 'mod-dsa-1',
    moduleTitle: 'Module 1: Complexity Analysis & Core Graph Primitives',
    title: 'Graph Traversal & Topological Sorting Quiz',
    difficulty: 'Advanced',
    totalMarks: 20,
    passingPercentage: 75,
    createdAt: '2026-08-07T10:00:00Z',
    questions: [
      {
        id: 'qz-dsa-1',
        category: 'DSA',
        type: 'mcq',
        prompt: 'If Kahn\'s algorithm processes fewer vertices than the total graph vertex count V, what does that conclude?',
        options: [
          'The graph has disconnected sub-components',
          'The graph contains at least one directed cycle (is not a DAG)',
          'All nodes have equal in-degrees',
          'Topological order is ambiguous'
        ],
        correctIndex: 1,
        explanation: 'In Kahn\'s algorithm, nodes in a cycle never reach an in-degree of 0, so they are never enqueued. Thus, if processed count < V, a cycle exists.',
        difficulty: 'Advanced',
        marks: 10
      },
      {
        id: 'qz-dsa-2',
        category: 'DSA',
        type: 'mcq',
        prompt: 'What is the time complexity of Dijkstra\'s algorithm using a Min-Heap / Priority Queue on a graph with V vertices and E edges?',
        options: ['O(V^2)', 'O((V + E) log V)', 'O(V * E)', 'O(V!)'],
        correctIndex: 1,
        explanation: 'Each vertex is extracted once from the heap (V log V) and each edge is relaxed once (E log V), yielding O((V + E) log V).',
        difficulty: 'Intermediate',
        marks: 10
      }
    ]
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-jv-1',
    courseId: 'course-java',
    courseTitle: 'Java Core & Modern Enterprise Architecture',
    moduleId: 'mod-jv-1',
    moduleTitle: 'Module 1: JVM Internals & Memory Architecture',
    title: 'Implement a Non-Blocking Concurrent Ring Buffer in Java',
    instructions: 'Build a bounded lock-free circular buffer using `AtomicLong` / `VarHandle` sequence counters with zero synchronization locks. Provide JUnit 5 concurrent stress tests demonstrating linearizability.',
    dueDate: '2026-09-10T23:59:59Z',
    maxMarks: 100,
    submissionType: 'code',
    createdAt: '2026-08-04T10:00:00Z',
    submissions: [
      {
        id: 'sub-1',
        assignmentId: 'assign-jv-1',
        userId: 'user-student',
        userName: 'Yashwanth Gowda',
        submittedAt: '2026-08-22T16:40:00Z',
        content: 'https://github.com/siriwodiyer/concurrent-ring-buffer-lms',
        status: 'graded',
        marksAwarded: 96,
        feedback: 'Outstanding lock-free implementation with cache-line padding to prevent false sharing!'
      },
      {
        id: 'sub-2',
        assignmentId: 'assign-jv-1',
        userId: 'user-learner-3',
        userName: 'Priya Sharma',
        submittedAt: '2026-08-23T11:20:00Z',
        content: 'https://github.com/priyasharma/java-ringbuffer-solution',
        status: 'graded',
        marksAwarded: 98,
        feedback: 'Superb CAS loop validation and clean memory order documentation.'
      }
    ]
  },
  {
    id: 'assign-dsa-1',
    courseId: 'course-dsa',
    courseTitle: 'Data Structures & Algorithms for FAANG Interviews',
    moduleId: 'mod-dsa-1',
    moduleTitle: 'Module 1: Complexity Analysis & Core Graph Primitives',
    title: 'Design a Distributed Task Dependency Scheduler (DAG Engine)',
    instructions: 'Implement a topological-sorting task dependency runner with concurrency limits. If tasks A, B depend on C, the engine must execute C first, then A and B in parallel.',
    dueDate: '2026-09-15T23:59:59Z',
    maxMarks: 100,
    submissionType: 'code',
    createdAt: '2026-08-08T10:00:00Z',
    submissions: [
      {
        id: 'sub-3',
        assignmentId: 'assign-dsa-1',
        userId: 'user-learner-2',
        userName: 'Rohan Mehta',
        submittedAt: '2026-08-24T18:00:00Z',
        content: 'https://github.com/alexchen/dag-scheduler-engine',
        status: 'pending',
      }
    ]
  }
];

export const INITIAL_ARTICLES: ArticleNote[] = [
  {
    id: 'art-1',
    courseId: 'course-java',
    courseTitle: 'Java Core & Modern Enterprise Architecture',
    title: 'Demystifying Spring Boot Bean Lifecycle & BeanPostProcessors',
    content: `# Spring Boot Bean Lifecycle Deep Dive

Every Spring Bean undergoes a rigorous deterministic lifecycle within the \`ApplicationContext\`:

1. **Instantiation**: The JVM invokes the constructor via reflection.
2. **Populate Properties**: Dependency injection of \`@Autowired\` fields.
3. **BeanNameAware / BeanFactoryAware**: Injects container identifiers.
4. **BeanPostProcessor (Before Initialization)**: Custom transformations before init.
5. **@PostConstruct / InitializingBean**: Custom business initialization.
6. **BeanPostProcessor (After Initialization)**: **AOP Proxies** (such as \`@Transactional\` and \`@Async\`) wrap the bean here!
7. **Ready for Use**: Injected into other services.
8. **@PreDestroy**: Clean shutdown.

> **Key Takeaway**: AOP proxy wrapping happens in Step 6. Calling internal methods bypasses this proxy interceptor!`,
    subject: 'Java / Spring Boot',
    topic: 'Spring Framework Internals',
    tags: ['Spring', 'Java', 'EnterpriseArchitecture', 'DeepDive'],
    authorId: 'user-admin',
    authorName: 'Gagan',
    readTimeMinutes: 6,
    createdAt: '2026-08-14T09:00:00Z',
    isPublished: true
  },
  {
    id: 'art-2',
    courseId: 'course-dbms',
    courseTitle: 'Relational Database Management & SQL Mastery',
    title: 'Deep Dive: B+ Trees vs LSM Trees in Storage Engines',
    content: `# B+ Trees vs Log-Structured Merge (LSM) Trees

When architecting database engines, write performance versus read amplification dictates the indexing data structure:

### B+ Trees (e.g. Postgres, MySQL InnoDB)
* **Optimization**: Read-heavy workloads.
* **Structure**: Fixed-size pages (4KB-16KB) on disk organized as a balanced multi-way search tree.
* **Trade-off**: Random I/O during writes because updates modify disk pages in-place.

### LSM Trees (e.g. RocksDB, Cassandra, ClickHouse)
* **Optimization**: High-throughput write-intensive telemetry & ingestion.
* **Structure**: In-memory MemTable (SSTable) flushed sequentially to disk, followed by background compaction.
* **Trade-off**: Read amplification during point lookups across multiple SSTable levels.`,
    subject: 'DBMS',
    topic: 'Database Storage Internals',
    tags: ['DBMS', 'SQL', 'BTree', 'StorageEngine'],
    authorId: 'user-mentor-3',
    authorName: 'Prof. Deepak Nair',
    readTimeMinutes: 8,
    createdAt: '2026-08-16T14:30:00Z',
    isPublished: true
  }
];

export const INITIAL_APPROVAL_QUEUE: ContentApprovalItem[] = [
  {
    id: 'appr-1',
    contentType: 'course',
    contentId: 'course-spring-adv',
    title: 'Spring Cloud Microservices with Kubernetes & Istio Service Mesh',
    categoryOrSubject: 'Java & Cloud Architecture',
    creatorId: 'user-mentor',
    creatorName: 'Dr. Meera Iyer',
    creatorRole: 'Mentor',
    status: 'submitted',
    submissionDate: '2026-08-24T14:30:00Z',
    feedbackHistory: [
      {
        date: '2026-08-24T14:30:00Z',
        adminName: 'System Gateway',
        action: 'submitted',
        feedback: 'Course submitted by Dr. Meera Iyer for curriculum vetting.'
      }
    ]
  },
  {
    id: 'appr-2',
    contentType: 'reel',
    contentId: 'reel-cand-1',
    title: 'C++ Move Semantics & Rvalue References (&&) in 60s',
    categoryOrSubject: 'C++',
    creatorId: 'user-mentor-2',
    creatorName: 'Rakesh Verma',
    creatorRole: 'Mentor',
    status: 'under_review',
    submissionDate: '2026-08-24T16:00:00Z',
    reviewedBy: 'Gagan (Admin)',
    reviewedDate: '2026-08-25T09:00:00Z',
    feedbackHistory: [
      {
        date: '2026-08-24T16:00:00Z',
        adminName: 'System Gateway',
        action: 'submitted',
        feedback: 'Educational reel submitted for quality assurance.'
      },
      {
        date: '2026-08-25T09:00:00Z',
        adminName: 'Gagan',
        action: 'under_review',
        feedback: 'Assigned to Admin Gagan for technical accuracy verification.'
      }
    ]
  },
  {
    id: 'appr-3',
    contentType: 'course',
    contentId: 'course-c-lowlevel',
    title: 'Low-Level Operating Systems Kernel Development in C',
    categoryOrSubject: 'Operating Systems & C',
    creatorId: 'user-mentor-3',
    creatorName: 'Prof. Deepak Nair',
    creatorRole: 'Mentor',
    status: 'rejected',
    submissionDate: '2026-08-21T10:00:00Z',
    reviewedBy: 'Gagan (Admin)',
    reviewedDate: '2026-08-22T11:00:00Z',
    rejectionReason: 'Please improve the explanation in Module 2 and add code examples for Interrupt Descriptor Table (IDT) before publishing.',
    feedbackHistory: [
      {
        date: '2026-08-21T10:00:00Z',
        adminName: 'System Gateway',
        action: 'submitted',
        feedback: 'Course submitted.'
      },
      {
        date: '2026-08-22T11:00:00Z',
        adminName: 'Gagan',
        action: 'rejected',
        feedback: 'Please improve the explanation in Module 2 and add code examples for Interrupt Descriptor Table (IDT) before publishing.'
      }
    ]
  },
  {
    id: 'appr-4',
    contentType: 'course',
    contentId: 'course-java',
    title: 'Java Core & Modern Enterprise Architecture',
    categoryOrSubject: 'Java',
    creatorId: 'user-mentor',
    creatorName: 'Dr. Meera Iyer',
    creatorRole: 'Mentor',
    status: 'published',
    submissionDate: '2026-08-10T09:00:00Z',
    reviewedBy: 'Gagan (Admin)',
    reviewedDate: '2026-08-12T10:00:00Z',
    feedbackHistory: [
      {
        date: '2026-08-10T09:00:00Z',
        adminName: 'System Gateway',
        action: 'submitted',
        feedback: 'Initial submission.'
      },
      {
        date: '2026-08-12T10:00:00Z',
        adminName: 'Gagan',
        action: 'approved',
        feedback: 'All curriculum standards met with distinction.'
      },
      {
        date: '2026-08-12T10:05:00Z',
        adminName: 'Gagan',
        action: 'published',
        feedback: 'Published to learner catalog.'
      }
    ]
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Full-Stack Modern AI Architecture & Agentic Workflows',
    subtitle: 'From React 19, FastAPI, Vector Search to Autonomous Multi-Agent Tool Calling',
    description: 'Comprehensive 12-hour masterclass designed by Dr. Meera Iyer. Master building enterprise LLM applications, RAG pipelines with Qdrant, structured outputs, streaming UI, and self-evaluating agents.',
    category: 'AI & Engineering',
    price: 89,
    discountedPrice: 59,
    instructorId: 'user-mentor',
    instructorName: 'Dr. Meera Iyer',
    instructorBio: 'Lead AI Scientist & Tech Educator. Ex-FAANG AI Researcher.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    level: 'Intermediate',
    rating: 4.9,
    reviewsCount: 320,
    studentsCount: 1420,
    status: 'published',
    progressPercent: 68,
    lastLessonTitle: 'Module 2: Structured Output Generation',
    durationHours: 12,
    lessonsCount: 14,
    quizzesCount: 4,
    assignmentsCount: 2,
    learningOutcomes: [
      'Architect robust Retrieval-Augmented Generation (RAG) pipelines',
      'Deploy tool-calling agents with fallback validation loops',
      'Optimize latency with semantic caching & streaming responses',
      'Build rich React 19 interactive interfaces for AI chat & artifact canvases'
    ],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Foundations of Embedding Spaces & Vector Databases',
        description: 'Deep dive into cosine similarity, Euclidean distance, and HNSW graph indexing.',
        durationMinutes: 45,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        isFreePreview: true,
        order: 1
      },
      {
        id: 'mod-2',
        title: 'Module 2: Structured Output Generation & JSON Schema Enforcement',
        description: 'Constrained sampling and guaranteed function calling reliability.',
        durationMinutes: 60,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        order: 2
      },
      {
        id: 'mod-3',
        title: 'Module 3: Multi-Agent Choreography & Tool Execution',
        description: 'Building autonomous coding assistants and self-correcting test runners.',
        durationMinutes: 80,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        order: 3
      }
    ],
    createdAt: '2026-08-10T00:00:00Z'
  },
  {
    id: 'course-java',
    title: 'Java Core & Modern Enterprise Architecture',
    subtitle: 'Master Java 21, Virtual Threads, JVM Internals & High-Concurrency Systems',
    description: 'The definitive Java engineering masterclass covering JVM byte code, garbage collectors (ZGC/G1), Project Loom virtual threads, concurrent data structures, and Spring Boot 3 enterprise best practices.',
    category: 'Java',
    price: 79,
    discountedPrice: 49,
    instructorId: 'user-mentor',
    instructorName: 'Dr. Meera Iyer',
    instructorBio: 'Lead AI Scientist & Tech Educator with 15+ years Java experience.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    level: 'Intermediate',
    rating: 4.95,
    reviewsCount: 410,
    studentsCount: 2350,
    status: 'published',
    progressPercent: 100,
    lastLessonTitle: 'Course Completed! Certificate & Badge Issued.',
    durationHours: 16,
    lessonsCount: 20,
    quizzesCount: 5,
    assignmentsCount: 3,
    learningOutcomes: [
      'Master JVM memory anatomy and optimize Garbage Collection for sub-millisecond pauses',
      'Build scalable I/O services using Java 21 Virtual Threads and Structured Concurrency',
      'Write rock-solid enterprise backend services with Spring Boot 3 and JPA',
      'Earn the verified Java Beginner & Enterprise Specialist badges'
    ],
    modules: [
      {
        id: 'mod-jv-1',
        title: 'Module 1: JVM Internals, Memory Architecture & Concurrency',
        description: 'Heap tuning, stack frames, escape analysis, and Virtual Threads.',
        durationMinutes: 75,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        isFreePreview: true,
        order: 1
      },
      {
        id: 'mod-jv-2',
        title: 'Module 2: Enterprise Spring Boot 3 & Reactive Microservices',
        description: 'Building resilient API gateways with Spring Security and Kafka integration.',
        durationMinutes: 90,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        order: 2
      }
    ],
    createdAt: '2026-08-12T00:00:00Z'
  },
  {
    id: 'course-dsa',
    title: 'Data Structures & Algorithms for FAANG Interviews',
    subtitle: 'From Big-O, Dynamic Programming, Graphs to Hard LeetCode Patterns',
    description: 'Systematic visual framework to crack top-tier technical interviews. Includes step-by-step intuition for sliding window, dynamic programming with bitmasking, union-find, and graph algorithms.',
    category: 'DSA',
    price: 99,
    discountedPrice: 69,
    instructorId: 'user-mentor-2',
    instructorName: 'Rakesh Verma',
    instructorBio: 'Principal Frontend Architect & Open Source Contributor.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    level: 'Advanced',
    rating: 4.88,
    reviewsCount: 530,
    studentsCount: 3100,
    status: 'published',
    progressPercent: 45,
    lastLessonTitle: 'Module 1: Amortized Complexity',
    durationHours: 22,
    lessonsCount: 30,
    quizzesCount: 8,
    assignmentsCount: 4,
    learningOutcomes: [
      'Deconstruct complex array and graph interview problems into recognizable algorithmic patterns',
      'Implement custom data structures: Trie, Segment Tree, Disjoint Set Union (DSU)',
      'Analyze space and time complexity with mathematical rigor'
    ],
    modules: [
      {
        id: 'mod-dsa-1',
        title: 'Module 1: Complexity Analysis & Core Graph Primitives',
        description: 'Big-O proofs, DFS/BFS graph exploration, and Topological Sorting.',
        durationMinutes: 80,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        isFreePreview: true,
        order: 1
      }
    ],
    createdAt: '2026-08-05T00:00:00Z'
  },
  {
    id: 'course-dbms',
    title: 'Relational Database Management & SQL Mastery',
    subtitle: 'ACID transactions, B+ Tree indexing, isolation levels & query optimization',
    description: 'Deep dive into how relational databases execute queries, buffer pool management, write-ahead logging (WAL), multi-version concurrency control (MVCC), and distributed SQL architectures.',
    category: 'DBMS',
    price: 69,
    discountedPrice: 45,
    instructorId: 'user-mentor-3',
    instructorName: 'Prof. Deepak Nair',
    instructorBio: 'Systems Engineering Professor specializing in database internals.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    level: 'Intermediate',
    rating: 4.92,
    reviewsCount: 280,
    studentsCount: 1890,
    status: 'published',
    progressPercent: 20,
    durationHours: 14,
    lessonsCount: 16,
    quizzesCount: 4,
    assignmentsCount: 2,
    learningOutcomes: [
      'Write optimized SQL queries that utilize index covering and avoid full table scans',
      'Understand dirty reads, non-repeatable reads, and phantom reads across isolation levels',
      'Diagnose locking contention and deadlocks in high-throughput transactional OLTP systems'
    ],
    modules: [
      {
        id: 'mod-dbms-1',
        title: 'Module 1: Query Execution Engine & Index Architectures',
        description: 'Physical storage pages, Clustered B+ Trees, and explain plan cost estimation.',
        durationMinutes: 60,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        isFreePreview: true,
        order: 1
      }
    ],
    createdAt: '2026-08-14T00:00:00Z'
  },
  {
    id: 'course-2',
    title: 'Advanced TypeScript & Production Design Patterns',
    subtitle: 'Write type-safe, highly composable systems with zero type assertions',
    description: 'Learn template literal types, mapped types, recursive AST parsers in type land, and enterprise architecture patterns from lead architects.',
    category: 'Tech',
    price: 69,
    discountedPrice: 45,
    instructorId: 'user-mentor-2',
    instructorName: 'Rakesh Verma',
    instructorBio: 'Principal Frontend Architect & Open Source Contributor.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    level: 'Advanced',
    rating: 4.85,
    reviewsCount: 195,
    studentsCount: 860,
    status: 'published',
    progressPercent: 32,
    lastLessonTitle: 'Module 1: Deep Dive into Conditional Types',
    durationHours: 10,
    lessonsCount: 12,
    quizzesCount: 3,
    assignmentsCount: 2,
    learningOutcomes: [
      'Master advanced generic constraints, conditional infer logic, and variance',
      'Build end-to-end type-safe RPC APIs without code generation',
      'Refactor brittle any/unknown codebases into bulletproof types'
    ],
    modules: [
      {
        id: 'mod-21',
        title: 'Module 1: Deep Dive into Conditional Types & Distributive Law',
        description: 'How naked type parameters distribute over union types in conditionals.',
        durationMinutes: 50,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        isFreePreview: true,
        order: 1
      }
    ],
    createdAt: '2026-08-15T00:00:00Z'
  },
  {
    id: 'course-3',
    title: 'Micro-Interactions & Modern Motion Design with Framer Motion',
    subtitle: 'Craft liquid animations, layout transitions, and tactile feedback',
    description: 'Transform standard web apps into mesmerizing, award-worthy digital experiences with fluid physics and gestural interactions.',
    category: 'Design',
    price: 49,
    instructorId: 'user-student',
    instructorName: 'Yashwanth Gowda',
    instructorBio: 'Creative technologist & UI animator specializing in high-converting web experiences.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80',
    level: 'Beginner',
    rating: 5.0,
    reviewsCount: 12,
    studentsCount: 45,
    status: 'published',
    progressPercent: 100,
    lastLessonTitle: 'Course Completed! Certificate Unlocked.',
    durationHours: 6,
    lessonsCount: 8,
    quizzesCount: 2,
    assignmentsCount: 1,
    learningOutcomes: [
      'Implement seamless layout animations using layoutId',
      'Create custom drag, swipe, and spring physics',
      'Optimize 60fps GPU-accelerated motion in React'
    ],
    modules: [
      {
        id: 'mod-31',
        title: 'Module 1: Spring Physics vs Easing Curves',
        description: 'Understanding stiffness, damping, and mass for natural tactile responsiveness.',
        durationMinutes: 30,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        isFreePreview: true,
        order: 1
      }
    ],
    createdAt: '2026-08-24T11:00:00Z'
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    reelId: 'reel-java-1',
    userId: 'user-student',
    userName: 'Yashwanth Gowda',
    content: 'Virtual threads make high-throughput I/O in Java 21 so straightforward! Great explanation 🔥',
    createdAt: '2026-08-24T12:30:00Z',
    likes: 14,
  },
  {
    id: 'comm-2',
    reelId: 'reel-dsa-1',
    userId: 'user-learner-2',
    userName: 'Rohan Mehta',
    content: 'The visual sliding window breakdown clarified why right expands and left contracts in O(N).',
    createdAt: '2026-08-24T13:10:00Z',
    likes: 8,
  },
  {
    id: 'comm-3',
    reelId: 'reel-sql-1',
    userId: 'user-33',
    userName: 'SpamBot99',
    content: 'FREE CRYPTO AIRDROP CLICK HERE => bit.ly/fake-promo $$$',
    createdAt: '2026-08-24T14:00:00Z',
    likes: 0,
    isFlagged: true,
    flagReason: 'Spam / Phishing link detected by auto-filter',
  }
];

export const INITIAL_ENROLLED_STUDENTS: EnrolledStudent[] = [
  {
    id: 'enr-1',
    userId: 'user-student',
    userName: 'Yashwanth Gowda',
    userEmail: 'yashwanth.gowda@lms.ai',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Modern AI Architecture & Agentic Workflows',
    enrolledAt: '2026-08-21T09:00:00Z',
    progressPercent: 68,
    lastActive: '2026-08-25T11:45:00Z',
    quizAverage: 94
  },
  {
    id: 'enr-2',
    userId: 'user-student',
    userName: 'Yashwanth Gowda',
    userEmail: 'yashwanth.gowda@lms.ai',
    courseId: 'course-java',
    courseTitle: 'Java Core & Modern Enterprise Architecture',
    enrolledAt: '2026-08-15T10:00:00Z',
    progressPercent: 100,
    completedAt: '2026-08-23T16:00:00Z',
    lastActive: '2026-08-23T16:00:00Z',
    quizAverage: 96
  },
  {
    id: 'enr-3',
    userId: 'user-learner-2',
    userName: 'Rohan Mehta',
    userEmail: 'rohan.mehta@lms.ai',
    courseId: 'course-dsa',
    courseTitle: 'Data Structures & Algorithms for FAANG Interviews',
    enrolledAt: '2026-08-22T11:30:00Z',
    progressPercent: 45,
    lastActive: '2026-08-25T08:15:00Z',
    quizAverage: 84
  },
  {
    id: 'enr-4',
    userId: 'user-learner-3',
    userName: 'Priya Sharma',
    userEmail: 'priya.sharma@lms.ai',
    courseId: 'course-java',
    courseTitle: 'Java Core & Modern Enterprise Architecture',
    enrolledAt: '2026-08-18T14:00:00Z',
    progressPercent: 100,
    completedAt: '2026-08-24T18:00:00Z',
    lastActive: '2026-08-25T10:30:00Z',
    quizAverage: 98
  },
  {
    id: 'enr-5',
    userId: 'user-learner-5',
    userName: 'Ananya Reddy',
    userEmail: 'ananya.reddy@polytech.edu',
    courseId: 'course-dbms',
    courseTitle: 'Relational Database Management & SQL Mastery',
    enrolledAt: '2026-08-20T10:00:00Z',
    progressPercent: 20,
    lastActive: '2026-08-25T09:40:00Z',
    quizAverage: 89
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-student',
    title: '🏆 Perfect Score on AI Assessment!',
    message: 'You scored 100% on the latest micro-assessment. +100 XP and a 30% Course Voucher added to your wallet!',
    type: 'reward',
    read: false,
    createdAt: '2026-08-24T10:00:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-student',
    title: '⚡ Badge Unlocked: Streak Master',
    message: 'You have completed reels for 7 days in a row! +200 bonus points credited.',
    type: 'reward',
    read: false,
    createdAt: '2026-08-22T14:30:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-mentor',
    title: '📚 New Course Approved by Admin',
    message: 'Your course "Java Core & Modern Enterprise Architecture" is now live on the marketplace!',
    type: 'course',
    read: true,
    createdAt: '2026-08-24T11:05:00Z'
  }
];

export const INITIAL_ANALYTICS: AdminAnalytics = {
  totalUsers: 14850,
  activeUsersDAU: 4210,
  activeUsersMAU: 12900,
  totalReelsWatched: 184500,
  totalAssessmentsCompleted: 36900,
  overallPassRate: 84.6,
  totalCourses: 6,
  approvedMentorsCount: 3,
  pendingCourseReviews: 2,
  totalMarketplaceRevenue: 28450,
  dailyEngagement: [
    { day: 'Mon', views: 24000, assessments: 4800 },
    { day: 'Tue', views: 27500, assessments: 5500 },
    { day: 'Wed', views: 31000, assessments: 6200 },
    { day: 'Thu', views: 29000, assessments: 5800 },
    { day: 'Fri', views: 34500, assessments: 6900 },
    { day: 'Sat', views: 39000, assessments: 7800 },
    { day: 'Sun', views: 42000, assessments: 8400 },
  ],
  userGrowthData: [
    { date: 'Aug 19', learners: 1320, mentors: 38, activeUsers: 3400 },
    { date: 'Aug 20', learners: 1380, mentors: 39, activeUsers: 3620 },
    { date: 'Aug 21', learners: 1450, mentors: 40, activeUsers: 3850 },
    { date: 'Aug 22', learners: 1520, mentors: 41, activeUsers: 3990 },
    { date: 'Aug 23', learners: 1610, mentors: 41, activeUsers: 4150 },
    { date: 'Aug 24', learners: 1720, mentors: 42, activeUsers: 4210 },
    { date: 'Aug 25', learners: 1850, mentors: 43, activeUsers: 4350 },
  ],
  coursePerformanceData: [
    { courseId: 'course-java', title: 'Java Core & Modern Enterprise Architecture', enrolled: 2350, completed: 890, completionRate: 37.8, avgRating: 4.95 },
    { courseId: 'course-dsa', title: 'Data Structures & Algorithms for FAANG Interviews', enrolled: 3100, completed: 940, completionRate: 30.3, avgRating: 4.88 },
    { courseId: 'course-1', title: 'Full-Stack Modern AI Architecture & Agentic Workflows', enrolled: 1420, completed: 510, completionRate: 35.9, avgRating: 4.90 },
    { courseId: 'course-dbms', title: 'Relational Database Management & SQL Mastery', enrolled: 1890, completed: 480, completionRate: 25.4, avgRating: 4.92 },
    { courseId: 'course-2', title: 'Advanced TypeScript & Production Design Patterns', enrolled: 860, completed: 290, completionRate: 33.7, avgRating: 4.85 },
    { courseId: 'course-3', title: 'Micro-Interactions & Modern Motion Design', enrolled: 45, completed: 32, completionRate: 71.1, avgRating: 5.0 },
  ],
  contentPerformanceData: [
    { reelId: 'reel-interview-1', title: 'Interview Preparation: System Design Rate Limiting', views: 68000, completions: 52400, likes: 5200 },
    { reelId: 'reel-dsa-1', title: 'DSA: Two Pointers vs Sliding Window Visualized', views: 52100, completions: 41000, likes: 4200 },
    { reelId: 'reel-cpp-1', title: 'C++20: RAII & Smart Pointers (unique_ptr vs shared_ptr)', views: 41200, completions: 31800, likes: 3400 },
    { reelId: 'reel-spring-1', title: 'Spring Boot 3: @Transactional Pitfalls & Self-Invocation', views: 37200, completions: 29400, likes: 3100 },
    { reelId: 'reel-os-1', title: 'OS: Deadlock Detection & Banker\'s Algorithm', views: 33800, completions: 26100, likes: 2750 },
    { reelId: 'reel-java-1', title: 'Java 21 Virtual Threads vs OS Threads in 60s', views: 28400, completions: 22900, likes: 2150 },
    { reelId: 'reel-sql-1', title: 'SQL: Clustered vs Non-Clustered Indexes in 60s', views: 24500, completions: 19800, likes: 1890 },
    { reelId: 'reel-net-1', title: 'Computer Networks: TCP 3-Way Handshake & SYN Floods', views: 22100, completions: 18000, likes: 1950 },
  ],
  learningAnalyticsData: {
    totalHours: 18450,
    avgScore: 84.6,
    quizAccuracy: 88.2,
    assignmentCompletionRate: 78.5
  }
};
