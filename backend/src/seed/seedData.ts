import {
  User,
  Reel,
  Course,
  CourseReel,
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
  ContentApprovalItem,
  MentorApplication,
  CourseFeedback,
  PlatformFeedbackItem,
  AdminSettings
} from '../types/index.js';

export const INITIAL_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'badge-def-1',
    title: 'Java Specialist',
    description: 'Complete Java Fundamentals course with assessment score >= 80%',
    icon: '☕',
    rarity: 'common',
    conditionType: 'quiz_score',
    conditionCourseId: 'course-java',
    conditionThreshold: 80,
    conditionText: 'Complete Java Fundamentals course with score >= 80%',
    isActive: true,
    earnedCount: 0,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'badge-def-2',
    title: 'Speed Learner',
    description: 'Completed your first 6-reel micro-assessment with a passing score!',
    icon: '⚡',
    rarity: 'rare',
    conditionType: 'reels_watched',
    conditionThreshold: 6,
    conditionText: 'Complete all 6 Learn reels and pass the assessment',
    isActive: true,
    earnedCount: 0,
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
    earnedCount: 0,
    createdAt: '2026-08-10T00:00:00Z',
  }
];

export const INITIAL_BADGES: Badge[] = [];
export const INITIAL_VOUCHERS: DiscountVoucher[] = [];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-student',
    name: 'Learner',
    email: 'user@lms.ai',
    password: 'password123',
    role: 'student',
    status: 'active',
    points: 0,
    xp: 0,
    streakDays: 0,
    level: 1,
    bio: 'Software engineering learner exploring courses, vertical reels, and assessments.',
    enrolledCourseIds: [],
    completedCourseIds: [],
    badges: [],
    discountVouchers: [],
    weeklyHours: [0, 0, 0, 0, 0, 0, 0],
    totalLearningHours: 0,
    quizAverage: 0,
    completedLessonsCount: 0,
    reelsWatchedTotal: 0,
    assignmentsCompletedCount: 0,
    registeredAt: '2026-08-01T00:00:00Z',
    lastActive: '2026-08-31T00:00:00Z',
    recentActivity: []
  },
  {
    id: 'user-mentor',
    name: 'Mentor 001',
    email: 'mentor@lms.ai',
    password: 'password123',
    role: 'mentor',
    status: 'active',
    points: 0,
    xp: 0,
    streakDays: 0,
    level: 1,
    bio: 'Senior Java & AI Systems Architect • Verified Mentor.',
    specialty: 'Java Core & Modern Enterprise Architecture',
    assignedLearnerIds: [],
    enrolledCourseIds: [],
    completedCourseIds: [],
    badges: [],
    discountVouchers: [],
    weeklyHours: [0, 0, 0, 0, 0, 0, 0],
    registeredAt: '2026-08-01T00:00:00Z',
    lastActive: '2026-08-31T00:00:00Z',
  },
  {
    id: 'user-admin',
    name: 'Administrator',
    email: 'admin@lms.ai',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    points: 0,
    xp: 0,
    streakDays: 0,
    level: 1,
    bio: 'Platform Administrator & Curriculum Governance Lead.',
    specialty: 'Platform Governance & Operations',
    assignedLearnerIds: [],
    enrolledCourseIds: [],
    completedCourseIds: [],
    badges: [],
    discountVouchers: [],
    weeklyHours: [0, 0, 0, 0, 0, 0, 0],
    registeredAt: '2026-01-01T00:00:00Z',
    lastActive: '2026-08-31T00:00:00Z',
  }
];

// EXACTLY 6 VERTICAL EDUCATIONAL LEARN REELS
export const INITIAL_REELS: Reel[] = [
  {
    id: 'reel-1',
    title: 'Python Variables & Memory References in 60s',
    description: 'Understand mutable vs immutable objects, reference counting, and how Python points variable names to heap memory addresses.',
    category: 'Python',
    subject: 'Python',
    topic: 'Memory Management & References',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    creatorId: 'user-mentor',
    creatorName: 'Mentor 001',
    creatorRole: 'Mentor',
    difficulty: 'Beginner',
    durationSeconds: 50,
    likesCount: 2450,
    commentsCount: 0,
    sharesCount: 620,
    viewsCount: 31200,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Python', 'Memory', 'Variables', 'Beginner'],
    createdAt: '2026-08-18T10:00:00Z',
    questions: [
      {
        id: 'q-reel-1',
        category: 'Python',
        type: 'mcq',
        prompt: 'In Python, when you assign `a = [1, 2]` and `b = a`, what actually happens in memory?',
        options: [
          'A deep copy of the list is created and stored in a new memory address for b',
          'Both `a` and `b` reference the exact same list object in heap memory',
          'Python freezes variable `a` into an immutable tuple',
          'A compile error occurs unless `copy()` is called explicitly'
        ],
        correctIndex: 1,
        explanation: 'In Python, variables are references to objects in memory. `b = a` assigns the same memory address reference to `b`, so modifying `b` will also affect `a`.',
        difficulty: 'Beginner',
        marks: 15
      }
    ]
  },
  {
    id: 'reel-2',
    title: 'Java 21: Virtual Threads vs OS Threads in 60s',
    description: 'Learn how Project Loom lightweight threads allow 1 million concurrent tasks without OS stack memory exhaustion.',
    category: 'Java',
    subject: 'Java',
    topic: 'Concurrency & Virtual Threads',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    creatorId: 'user-admin',
    creatorName: 'Administrator',
    creatorRole: 'Admin',
    difficulty: 'Intermediate',
    durationSeconds: 52,
    likesCount: 3150,
    commentsCount: 0,
    sharesCount: 780,
    viewsCount: 38400,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Java', 'VirtualThreads', 'JVM', 'Concurrency'],
    createdAt: '2026-08-19T11:00:00Z',
    questions: [
      {
        id: 'q-reel-2',
        category: 'Java',
        type: 'mcq',
        prompt: 'What primary architectural advantage do Java 21 Virtual Threads provide over traditional platform threads?',
        options: [
          'They bypass JVM garbage collection entirely',
          'They provide M:N lightweight threading that does not tie up 1MB OS stack memory during blocking I/O',
          'They make Java bytecode compile natively to GPU shaders',
          'They eliminate thread synchronization locking globally'
        ],
        correctIndex: 1,
        explanation: 'Virtual Threads are managed directly by the JVM with tiny heap memory overhead, enabling high concurrency without exhausting OS thread pools.',
        difficulty: 'Intermediate',
        marks: 15
      }
    ]
  },
  {
    id: 'reel-3',
    title: 'Spring Boot 3: Transaction Proxies & Self-Invocation',
    description: 'Why calling an @Transactional method from inside the same bean skips proxy interception and fails rollback.',
    category: 'Web Dev',
    subject: 'Spring Boot',
    topic: 'Transaction Proxies & AOP',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    creatorId: 'user-mentor',
    creatorName: 'Mentor 001',
    creatorRole: 'Mentor',
    difficulty: 'Advanced',
    durationSeconds: 58,
    likesCount: 2890,
    commentsCount: 0,
    sharesCount: 710,
    viewsCount: 34100,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Spring Boot', 'Transactions', 'AOP', 'Architecture'],
    createdAt: '2026-08-20T14:00:00Z',
    questions: [
      {
        id: 'q-reel-3',
        category: 'Web Dev',
        type: 'true_false',
        prompt: 'Direct method self-invocation within the same Spring bean bypasses AOP transaction interceptors for @Transactional.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! Spring transactions use dynamic proxy wrappers. Internal `this.method()` calls bypass the proxy boundary.',
        difficulty: 'Advanced',
        marks: 15
      }
    ]
  },
  {
    id: 'reel-4',
    title: 'DSA: Two Pointers vs Sliding Window Visualized',
    description: 'Master when to use Fixed Window, Dynamic Window, and Bidirectional Pointers for O(N) linear array & string algorithms.',
    category: 'Data Structures',
    subject: 'DSA',
    topic: 'Array Algorithms & Sliding Window',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    creatorId: 'user-mentor',
    creatorName: 'Mentor 001',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 49,
    likesCount: 4100,
    commentsCount: 0,
    sharesCount: 1350,
    viewsCount: 49800,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['DSA', 'Algorithms', 'SlidingWindow', 'Arrays'],
    createdAt: '2026-08-21T09:30:00Z',
    questions: [
      {
        id: 'q-reel-4',
        category: 'Data Structures',
        type: 'mcq',
        prompt: 'When is a dynamic sliding window algorithm mathematically applicable over a naive O(N^2) nested loop approach?',
        options: [
          'Only on sorted numeric arrays with binary search',
          'When the problem seeks an optimal contiguous subarray/substring with monotonic expand/shrink conditions',
          'When the array contains exclusively negative values',
          'When processing non-contiguous tree traversals'
        ],
        correctIndex: 1,
        explanation: 'Sliding Window transforms nested subsegment evaluations into linear O(N) by expanding the right boundary and contracting the left boundary monotonically.',
        difficulty: 'Intermediate',
        marks: 15
      }
    ]
  },
  {
    id: 'reel-5',
    title: 'SQL: Clustered vs Non-Clustered Indexes in 60s',
    description: 'Learn B-Tree root/leaf physical data ordering, leaf page lookups, and why a table can have only 1 clustered index.',
    category: 'DBMS',
    subject: 'SQL & Database Design',
    topic: 'Indexing & B-Trees',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    creatorId: 'user-mentor',
    creatorName: 'Mentor 001',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 55,
    likesCount: 2750,
    commentsCount: 0,
    sharesCount: 540,
    viewsCount: 32900,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['SQL', 'DBMS', 'Indexes', 'BTree'],
    createdAt: '2026-08-22T12:00:00Z',
    questions: [
      {
        id: 'q-reel-5',
        category: 'DBMS',
        type: 'mcq',
        prompt: 'Why can a database table have only ONE Clustered Index, while having multiple Non-Clustered Indexes?',
        options: [
          'SQL standards limit index file sizes to 10MB',
          'The clustered index determines the physical on-disk sorting order of actual table row pages',
          'Non-clustered indexes are stored exclusively in temporary RAM caches',
          'Foreign keys automatically convert into secondary clustered indexes'
        ],
        correctIndex: 1,
        explanation: 'Data rows on disk can physically only be sorted in a single sequence, which is governed by the table clustered index.',
        difficulty: 'Intermediate',
        marks: 15
      }
    ]
  },
  {
    id: 'reel-6',
    title: 'Computer Networks: TCP 3-Way Handshake & SYN Floods',
    description: 'SYN → SYN-ACK → ACK lifecycle, TCB connection state memory allocation, and how SYN cookies mitigate denial-of-service floods.',
    category: 'Cloud',
    subject: 'Computer Networks',
    topic: 'Transport Layer Protocols & Handshake',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    creatorId: 'user-admin',
    creatorName: 'Administrator',
    creatorRole: 'Admin',
    difficulty: 'Intermediate',
    durationSeconds: 51,
    likesCount: 3400,
    commentsCount: 0,
    sharesCount: 890,
    viewsCount: 41500,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Networks', 'TCP', 'Security', 'Protocols'],
    createdAt: '2026-08-23T15:30:00Z',
    questions: [
      {
        id: 'q-reel-6',
        category: 'Cloud',
        type: 'true_false',
        prompt: 'SYN Cookies allow servers to establish TCP connections without pre-allocating Transmission Control Block (TCB) state memory upon receiving a SYN.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! SYN Cookies cryptographically encode connection parameters within the sequence number, deflecting SYN flood resource exhaustion.',
        difficulty: 'Intermediate',
        marks: 20
      }
    ]
  }
];

const createCourseReels = (courseId: string, baseTopic: string, titles: string[]): CourseReel[] => [
  {
    id: `${courseId}-reel-1`,
    courseId,
    order: 1,
    title: `Reel 1: ${titles[0] || 'Fundamentals & Core Concepts'}`,
    description: `Foundations of ${baseTopic}, architectural paradigms, and development environment setup.`,
    topic: `${baseTopic} - Part 1`,
    durationSeconds: 54,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    likesCount: 1420,
    isLiked: false,
    isBookmarked: false,
    isCompleted: false
  },
  {
    id: `${courseId}-reel-2`,
    courseId,
    order: 2,
    title: `Reel 2: ${titles[1] || 'Core Implementation & Deep Dive'}`,
    description: `Hands-on code execution, internals, memory anatomy, and execution lifecycle.`,
    topic: `${baseTopic} - Part 2`,
    durationSeconds: 58,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    likesCount: 1180,
    isLiked: false,
    isBookmarked: false,
    isCompleted: false
  },
  {
    id: `${courseId}-reel-3`,
    courseId,
    order: 3,
    title: `Reel 3: ${titles[2] || 'Advanced Patterns & Architecture'}`,
    description: `Resilient architectural patterns, error handling, and production-grade best practices.`,
    topic: `${baseTopic} - Part 3`,
    durationSeconds: 52,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    likesCount: 950,
    isLiked: false,
    isBookmarked: false,
    isCompleted: false
  },
  {
    id: `${courseId}-reel-4`,
    courseId,
    order: 4,
    title: `Reel 4: ${titles[3] || 'Performance Tuning & Optimization'}`,
    description: `Profiling bottlenecks, memory optimization, caching strategies, and latency minimization.`,
    topic: `${baseTopic} - Part 4`,
    durationSeconds: 56,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    likesCount: 820,
    isLiked: false,
    isBookmarked: false,
    isCompleted: false
  },
  {
    id: `${courseId}-reel-5`,
    courseId,
    order: 5,
    title: `Reel 5: ${titles[4] || 'Production Deployment & Case Studies'}`,
    description: `Deploying to production, telemetry monitoring, real-world case studies, and certification readiness.`,
    topic: `${baseTopic} - Part 5`,
    durationSeconds: 60,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    likesCount: 1340,
    isLiked: false,
    isBookmarked: false,
    isCompleted: false
  }
];

// SINGLE MASTERCLASS COURSE (Java Core & Modern Enterprise Architecture)
export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-java',
    title: 'Java Core & Modern Enterprise Architecture',
    subtitle: 'Master Java 21, Virtual Threads, JVM Internals & High-Concurrency Systems',
    description: 'The definitive 5-reel Java engineering masterclass covering JVM bytecode, garbage collectors (ZGC/G1), Project Loom virtual threads, concurrent data structures, and Spring Boot 3 enterprise best practices.',
    category: 'Java',
    price: 79,
    discountedPrice: 49,
    instructorId: 'user-mentor',
    instructorName: 'Mentor 001',
    instructorBio: 'Senior AI Systems Architect with 15+ years Java experience.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    level: 'Intermediate',
    rating: 4.95,
    reviewsCount: 0,
    studentsCount: 0,
    status: 'published',
    progressPercent: 0,
    durationHours: 5,
    lessonsCount: 5,
    reelsCount: 5,
    quizzesCount: 1,
    assignmentsCount: 1,
    reels: createCourseReels('course-java', 'Java Core', [
      'JVM Memory Model & Metaspace Anatomy',
      'Java 21 Pattern Matching & Record Deconstruction',
      'Virtual Threads & Structured Concurrency in Project Loom',
      'Lock-Free Ring Buffers with Atomic VarHandles',
      'Production Spring Boot 3 Reactive Microservices'
    ]),
    learningOutcomes: [
      'Master JVM memory anatomy and optimize Garbage Collection for sub-millisecond pauses',
      'Build scalable I/O services using Java 21 Virtual Threads and Structured Concurrency',
      'Write rock-solid enterprise backend services with Spring Boot 3 and JPA',
      'Earn the verified Java Specialist badge'
    ],
    modules: [],
    createdAt: '2026-08-12T00:00:00Z'
  }
];

export const INITIAL_LESSONS: Lesson[] = [];

// SINGLE COURSE QUIZ
export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-course-java',
    courseId: 'course-java',
    courseTitle: 'Java Core & Modern Enterprise Architecture',
    moduleId: 'mod-jv-1',
    moduleTitle: 'Module 1: Java 21, JVM & Concurrency',
    title: 'Java 21 Virtual Threads, Metaspace & Concurrency Quiz',
    difficulty: 'Intermediate',
    totalMarks: 50,
    passingPercentage: 80,
    createdAt: '2026-08-21T11:00:00Z',
    questions: [
      {
        id: 'q-jv-1',
        category: 'Java',
        type: 'mcq',
        prompt: 'In Java 21 Project Loom, what happens when a Virtual Thread executes a blocking socket read or sleep?',
        options: [
          'The underlying OS kernel thread is halted until the packet arrives',
          'The JVM unmounts the virtual thread from its carrier thread, allowing other virtual tasks to run',
          'An unrecoverable ThreadBlockedException is thrown',
          'The JVM converts the thread into a 1MB native C-stack allocation'
        ],
        correctIndex: 1,
        explanation: 'Virtual Threads are lightweight heap objects. When blocking I/O occurs, the JVM unmounts them from the carrier platform thread so other tasks can execute.',
        marks: 10
      },
      {
        id: 'q-jv-2',
        category: 'Java',
        type: 'mcq',
        prompt: 'Where are class bytecode metadata, runtime constant pools, and method definitions stored in modern JVMs (Java 8+)?',
        options: [
          'PermGen memory space',
          'Off-heap Metaspace backed directly by native OS memory',
          'Young Generation Eden Space',
          'Thread Local Allocation Buffer (TLAB)'
        ],
        correctIndex: 1,
        explanation: 'Metaspace replaced PermGen in Java 8, allocating class metadata directly into native memory up to MaxMetaspaceSize.',
        marks: 10
      },
      {
        id: 'q-jv-3',
        category: 'Java',
        type: 'mcq',
        prompt: 'How does Java 21 Record Pattern Matching enhance type safety and developer productivity?',
        options: [
          'It forces all record fields to be mutable at runtime',
          'It deconstructs record components directly in switch and instanceof expressions without manual casting',
          'It compiles Java records into JavaScript objects dynamically',
          'It eliminates JVM garbage collection cycles'
        ],
        correctIndex: 1,
        explanation: 'Record pattern matching allows developers to test types and extract component variables in one concise syntax block without redundant type casts.',
        marks: 10
      },
      {
        id: 'q-jv-4',
        category: 'Java',
        type: 'true_false',
        prompt: 'StructuredTaskScope in Java 21 guarantees that child subtasks spawned in a scope complete or cancel before the enclosing code block exits.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! Structured Concurrency treats groups of related tasks as a single atomic unit of work, preventing thread leaks and orphaned background tasks.',
        marks: 10
      },
      {
        id: 'q-jv-5',
        category: 'Java',
        type: 'mcq',
        prompt: 'What architectural benefit do VarHandle atomic operations provide over traditional synchronized blocks in high-concurrency Java systems?',
        options: [
          'They eliminate CPU memory barriers completely',
          'They execute low-level atomic CAS (Compare-And-Swap) instructions with fine-grained memory fences without thread descheduling',
          'They write data directly to SSD flash sectors',
          'They run bytecode in kernel ring 0'
        ],
        correctIndex: 1,
        explanation: 'VarHandles offer lock-free atomic read/write access and memory barriers (Volatile, Acquire/Release, Opaque) without incurring heavyweight thread context switches.',
        marks: 10
      }
    ]
  }
];

// SINGLE COURSE ASSIGNMENT
export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'ass-course-java',
    courseId: 'course-java',
    courseTitle: 'Java Core & Modern Enterprise Architecture',
    moduleId: 'mod-jv-1',
    moduleTitle: 'Module 1: Java 21 & Concurrency',
    title: 'Java 21 Virtual Threads & High-Throughput I/O Benchmark Assignment',
    instructions: 'Design a concurrent processing pipeline using Java 21 Virtual Threads and StructuredTaskScope. Compare memory footprint and throughput against standard fixed thread pools during simulated 10,000 concurrent HTTP requests. Submit your benchmarking code and performance analysis.',
    dueDate: '2026-09-30T23:59:59Z',
    maxMarks: 100,
    submissionType: 'code',
    submissions: [],
    createdAt: '2026-08-19T11:00:00Z'
  }
];

export const INITIAL_ARTICLES: ArticleNote[] = [];
export const INITIAL_APPROVAL_QUEUE: ContentApprovalItem[] = [];
export const INITIAL_MENTOR_APPLICATIONS: MentorApplication[] = [];
export const INITIAL_COURSE_FEEDBACK: CourseFeedback[] = [];
export const INITIAL_PLATFORM_FEEDBACK: PlatformFeedbackItem[] = [];
export const INITIAL_COMMENTS: Comment[] = [];
export const INITIAL_ENROLLED_STUDENTS: EnrolledStudent[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
export const INITIAL_COMPLETED_COURSE_REELS: Record<string, string[]> = {};

export const INITIAL_ANALYTICS: AdminAnalytics = {
  totalUsers: 3,
  activeUsersDAU: 1,
  activeUsersMAU: 3,
  totalReelsWatched: 0,
  totalAssessmentsCompleted: 0,
  overallPassRate: 100,
  totalCourses: 1,
  approvedMentorsCount: 1,
  pendingCourseReviews: 0,
  totalMarketplaceRevenue: 0,
  dailyEngagement: [
    { day: 'Mon', views: 0, assessments: 0 },
    { day: 'Tue', views: 0, assessments: 0 },
    { day: 'Wed', views: 0, assessments: 0 },
    { day: 'Thu', views: 0, assessments: 0 },
    { day: 'Fri', views: 0, assessments: 0 },
    { day: 'Sat', views: 0, assessments: 0 },
    { day: 'Sun', views: 0, assessments: 0 },
  ],
  userGrowthData: [
    { date: 'Aug 31', learners: 1, mentors: 1, activeUsers: 2 },
  ],
  coursePerformanceData: [
    { courseId: 'course-java', title: 'Java Core & Modern Enterprise Architecture (5 Reels)', enrolled: 0, completed: 0, completionRate: 0, avgRating: 5.0 },
  ],
  contentPerformanceData: [
    { reelId: 'reel-1', title: 'Python Variables & Memory References in 60s', views: 0, completions: 0, likes: 0 },
    { reelId: 'reel-2', title: 'Java 21: Virtual Threads vs OS Threads in 60s', views: 0, completions: 0, likes: 0 },
    { reelId: 'reel-3', title: 'Spring Boot 3: Transaction Proxies & Self-Invocation', views: 0, completions: 0, likes: 0 },
    { reelId: 'reel-4', title: 'DSA: Two Pointers vs Sliding Window Visualized', views: 0, completions: 0, likes: 0 },
    { reelId: 'reel-5', title: 'SQL: Clustered vs Non-Clustered Indexes in 60s', views: 0, completions: 0, likes: 0 },
    { reelId: 'reel-6', title: 'Computer Networks: TCP 3-Way Handshake & SYN Floods', views: 0, completions: 0, likes: 0 },
  ],
  learningAnalyticsData: {
    totalHours: 0,
    avgScore: 0,
    quizAccuracy: 0,
    assignmentCompletionRate: 0
  }
};

export const INITIAL_ADMIN_SETTINGS: AdminSettings = {
  platformName: 'LMS Reels Platform',
  allowNewRegistrations: true,
  requireApprovalForCourses: true,
  requireApprovalForReels: true,
  reelsRequiredForAssessment: 6,
  passingScoreThreshold: 80,
  mentorEligibilityMinAssessments: 3,
  mentorEligibilityMinScore: 80,
  mentorEligibilityAvgScore: 85,
  pointsPerCorrectAnswer: 15,
  defaultVoucherDiscountPercent: 25,
  voucherValidityDays: 30,
  maxDailyReelLimit: 20
};
