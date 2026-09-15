import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, PlayCircle, CheckCircle, Search, ArrowRight } from 'lucide-react';
import learningService from '../../services/learningService';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    learningService.getEnrolledCourses().then(res => {
      if (res.success) setCourses(res.data);
    });
    learningService.getStudentProfile().then(res => {
      if (res.success) setProfile(res.data);
    });
  }, []);

  const filteredCourses = courses.filter(c => {
    if (activeTab === 'in-progress' && c.status !== 'in-progress') return false;
    if (activeTab === 'completed' && c.status !== 'completed') return false;
    if (searchQuery) {
      return (
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl bg-brand-navy p-6 sm:p-8 text-white shadow-card">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="crimson">Student Learning Portal</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            My Enrolled Courses & Assessments
          </h1>
          <p className="mt-1 text-sm text-gray-300">
            Stream video lectures, track your progress, and launch your 120-minute timed certification exam.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search my courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-brand-crimson focus:bg-white/15 transition-all"
          />
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-brand-navy/10 p-2.5 text-brand-navy">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-gray-500 block">Total Enrolled</span>
              <span className="text-2xl font-bold text-gray-900">{profile?.stats?.enrolledCount || 3}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2.5 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-gray-500 block">In Progress</span>
              <span className="text-2xl font-bold text-amber-600">{profile?.stats?.inProgressCount || 2}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-gray-500 block">Completed</span>
              <span className="text-2xl font-bold text-emerald-600">{profile?.stats?.completedCount || 1}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2.5 text-purple-600">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-gray-500 block">Certificates</span>
              <span className="text-2xl font-bold text-purple-600">{profile?.stats?.certificatesEarned || 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        {[
          { id: 'all', label: 'All Courses' },
          { id: 'in-progress', label: 'In Progress' },
          { id: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div 
            key={course.id}
            className="group flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card transition-all hover:shadow-lg"
          >
            <div>
              {/* Thumbnail Header */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="navy">{course.category}</Badge>
                </div>

                {course.hasPassedAssessment && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="success">
                      <Award className="mr-1 h-3.5 w-3.5" /> Certified
                    </Badge>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold font-display text-brand-navy line-clamp-1 group-hover:text-brand-crimson transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {course.subtitle}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                    <span>{course.completedLessons} of {course.totalLessons} Lessons</span>
                    <span className="font-mono text-brand-crimson">{course.progress}%</span>
                  </div>
                  <ProgressBar value={course.progress} variant="crimson" size="sm" />
                </div>

                {/* Resume Prompt */}
                {course.lastAccessedLesson && (
                  <div className="rounded-lg bg-gray-50 p-2.5 text-xs text-gray-600 border border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Resume Lesson:</span>
                    <p className="font-medium text-gray-800 truncate">{course.lastAccessedLesson.title}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 p-5 pt-3 space-y-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                icon={PlayCircle}
                onClick={() => navigate(`/learn/${course.id}`)}
              >
                Continue Learning
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                icon={Award}
                onClick={() => navigate(`/learn/${course.id}/assessment`)}
              >
                120m Timed Exam
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
