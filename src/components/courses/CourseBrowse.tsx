import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import {
  BookOpen,
  Search,
  Star,
  Users,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  PlaySquare,
  Sparkles,
  Tag
} from 'lucide-react';
import { CourseDetailsModal } from './CourseDetailsModal';

export const CourseBrowse: React.FC = () => {
  const { courses, currentUser, completedCourseReels } = useApp();

  const [activeTab, setActiveTab] = useState<'browse' | 'my-learning'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const categories = ['All', 'Python', 'Java', 'Web Dev', 'AI & Engineering', 'DSA', 'DBMS', 'Design'];

  // Published courses only
  const publishedCourses = courses.filter(c => c.status === 'published' || c.status === 'approved');
  const enrolledCourses = courses.filter(c => currentUser.enrolledCourseIds.includes(c.id));

  const targetCourses = activeTab === 'my-learning' ? enrolledCourses : publishedCourses;

  const filteredCourses = targetCourses.filter(course => {
    const matchesCategory =
      selectedCategory === 'All' ||
      course.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (course.category === 'Web Dev' && (course.category.toLowerCase().includes('web') || course.category.toLowerCase().includes('typescript')));
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Courses Catalog</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              5 Vertical Reels per Course
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Explore Courses</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Professional micro-masterclasses built with 5 vertical learning reels, created by verified Mentors and vetted by Administrators.
          </p>
        </div>

        {/* Tab Switcher: Browse Courses vs My Learning */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'browse' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Browse Courses ({publishedCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('my-learning')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'my-learning' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Learning ({enrolledCourses.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search course or mentor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-2xl bg-white border border-slate-200 shadow-xs">
            <BookOpen size={36} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-900">No courses found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          filteredCourses.map(course => {
            const isEnrolled = currentUser.enrolledCourseIds.includes(course.id);
            const courseCompletedList = completedCourseReels[course.id] || [];
            const completedReelsCount = courseCompletedList.length;
            const progressPct = Math.round((completedReelsCount / 5) * 100);

            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail with 5 Reels Badge */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-xs">
                        5 Vertical Reels
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium">
                        {course.category}
                      </span>
                    </div>

                    {isEnrolled && (
                      <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md p-2 rounded-lg text-white">
                        <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                          <span>Course Progress</span>
                          <span>{completedReelsCount}/5 Reels ({progressPct}%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Course Details */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{course.instructorName}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>{(course.rating || 4.9).toFixed(1)}</span>
                      </div>
                    </div>

                    <h2 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {course.title}
                    </h2>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Footer: Price & Action CTA */}
                <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-slate-900">
                      ${course.discountedPrice || course.price}
                    </span>
                    {course.discountedPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ${course.price}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    {isEnrolled ? 'Open Course' : 'View 5 Reels'}
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Course Details & Player Modal */}
      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};
