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
  GraduationCap
} from 'lucide-react';
import { CourseDetailsModal } from './CourseDetailsModal';

export const CourseBrowse: React.FC = () => {
  const { courses, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'browse' | 'my-learning'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const categories = ['All', 'Python', 'Java', 'Web Dev', 'AI & Data Science', 'Cloud'];

  const publishedCourses = courses.filter(c => c.status === 'published' || c.status === 'approved');
  const enrolledCourses = courses.filter(c => currentUser.enrolledCourseIds.includes(c.id));

  const targetCourses = activeTab === 'my-learning' ? enrolledCourses : publishedCourses;

  const filteredCourses = targetCourses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-20 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Courses Catalog</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
              Admin Approved Mentors
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Explore Courses</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            In-depth video courses created by verified mentors and approved by platform administrators.
          </p>
        </div>

        {/* Tab Switcher: Browse Courses vs My Learning */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'browse' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Browse Courses ({publishedCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('my-learning')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'my-learning' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
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
            placeholder="Search course title or mentor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
            <BookOpen size={36} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-900">No courses found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          filteredCourses.map(course => {
            const isEnrolled = currentUser.enrolledCourseIds.includes(course.id);
            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="group rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                {/* Course Thumbnail */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-700 border border-slate-200">
                      {course.level}
                    </span>
                    {isEnrolled && (
                      <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
                        <CheckCircle2 size={11} /> Enrolled
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold text-amber-700 flex items-center gap-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{course.rating || 4.9}</span>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 block mb-1">{course.category}</span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 font-display">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                        {course.instructorName ? course.instructorName[0] : 'M'}
                      </div>
                      <span className="text-xs text-slate-700 font-medium truncate max-w-[120px]">
                        {course.instructorName || 'Dr. Meera Iyer'}
                      </span>
                    </div>

                    <div className="text-right font-mono text-sm font-bold text-slate-900">
                      ${course.price}
                    </div>
                  </div>
                </div>

                {/* Course CTA Button */}
                <div className="px-5 pb-5">
                  <button
                    className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isEnrolled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    }`}
                  >
                    <span>{isEnrolled ? 'Continue Course' : 'Enroll / View Details'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Course Details Modal */}
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

