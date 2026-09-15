import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileText, Download, Play, BookOpen, Sparkles } from 'lucide-react';
import learningService from '../../services/learningService';
import VideoPlayer from '../../components/learning/VideoPlayer';
import LessonSidebar from '../../components/learning/LessonSidebar';
import ResourceList from '../../components/learning/ResourceList';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function LecturePlayer() {
  const { courseId = 'solar-pv-tech', id: lessonId = 'mod-3-lesson-2' } = useParams();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    learningService.getLessonDetails(courseId, lessonId).then(res => {
      if (res.success) {
        setData(res.data);
        setIsCompleted(res.data.lesson?.completed || false);
      }
    });
  }, [courseId, lessonId]);

  if (!data || !data.lesson) {
    return <div className="p-8 text-center text-gray-500">Loading lecture streaming player...</div>;
  }

  const { lesson, module: currentModule, allModules, progress, courseTitle } = data;

  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted);
    learningService.toggleLessonComplete(courseId, lesson.id);
  };

  const handleNextLesson = () => {
    let nextLessonId = null;
    let foundCurrent = false;

    for (const mod of allModules) {
      for (const l of mod.lessons) {
        if (foundCurrent) {
          nextLessonId = l.id;
          break;
        }
        if (l.id === lesson.id) foundCurrent = true;
      }
      if (nextLessonId) break;
    }

    if (nextLessonId) {
      navigate(`/learn/${courseId}/lesson/${nextLessonId}`);
    } else {
      navigate(`/learn/${courseId}/assessment`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/learn/${courseId}`)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Badge variant="navy">{courseTitle}</Badge>
              <span className="text-xs text-gray-500">• {currentModule?.title}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-display text-brand-navy">{lesson.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={isCompleted ? "secondary" : "primary"}
            size="sm"
            onClick={handleToggleComplete}
            icon={CheckCircle2}
          >
            {isCompleted ? 'Completed' : 'Mark as Complete'}
          </Button>
        </div>
      </div>

      {/* Main Grid: Video Player + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Stream & Tabs (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayer
            videoUrl={lesson.videoUrl}
            title={lesson.title}
            isCompleted={isCompleted}
            onToggleComplete={handleToggleComplete}
            onNextLesson={handleNextLesson}
          />

          {/* Bottom Information Tabs */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
              {[
                { id: 'overview', label: 'Overview & Topics' },
                { id: 'resources', label: `Attachments (${lesson.resources?.length || 0})` },
                { id: 'notes', label: 'Transcript & Notes' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
                <p>{lesson.summary}</p>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Key Topics Covered:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {lesson.keyTopics?.map((topic, i) => (
                      <li key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800">
                        <Sparkles className="h-3.5 w-3.5 text-brand-crimson shrink-0" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Resources */}
            {activeTab === 'resources' && (
              <ResourceList resources={lesson.resources} />
            )}

            {/* Tab 3: Notes */}
            {activeTab === 'notes' && (
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700 leading-relaxed space-y-2">
                <p>[00:15] Welcome to Lesson: Inverter Sizing & MPPT String Calculation.</p>
                <p>[04:30] In Pakistan's climate, solar panel cell temperature frequently exceeds 60°C during summer peak.</p>
                <p>[12:40] Calculate minimum string Voc based on local winter temperature records (-5°C).</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Module Syllabus Tree (1 Col) */}
        <div>
          <LessonSidebar
            modules={allModules}
            currentLessonId={lesson.id}
            courseId={courseId}
            progress={progress}
          />
        </div>
      </div>
    </div>
  );
}
