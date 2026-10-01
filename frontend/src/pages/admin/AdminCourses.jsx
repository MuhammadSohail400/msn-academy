import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Edit,
  Trash2,
  X,
  Check,
  BookOpen,
  DollarSign,
  Tag,
  Layers,
  Image as ImageIcon,
  UploadCloud,
  PlayCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  Loader2,
} from 'lucide-react';
import adminService from '../../services/adminService';
import uploadService from '../../services/uploadService';

const CATEGORIES = [
  'Artificial Intelligence',
  'Web Development',
  'Mobile App Development',
  'Cloud & DevOps',
  'Cybersecurity',
  'Data Science',
  'UI/UX Design',
  'Blockchain',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [modalSuccess, setModalSuccess] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    level: 'Beginner',
    price: 15000,
    discountedPrice: '',
    tagline: '',
    description: '',
    thumbnail: '',
    status: 'PUBLISHED',
  });

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Thumbnail file upload state
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  // Curriculum Builder Modal State
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [curriculumCourse, setCurriculumCourse] = useState(null);
  const [curriculumModules, setCurriculumModules] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [isSavingCurriculum, setIsSavingCurriculum] = useState(false);
  const [curriculumError, setCurriculumError] = useState(null);
  const [curriculumSuccess, setCurriculumSuccess] = useState(null);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getAdminCourses({ limit: 100 });
      if (res.success) {
        setCourses(res.data?.courses || res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load course catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentCourseId(null);
    setFormData({
      title: '',
      category: 'Web Development',
      level: 'Beginner',
      price: 15000,
      discountedPrice: '',
      tagline: '',
      description: '',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      status: 'PUBLISHED',
    });
    setModalError(null);
    setModalSuccess(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setIsEditing(true);
    setCurrentCourseId(course._id || course.id);
    setFormData({
      title: course.title || '',
      category: course.category || 'Web Development',
      level: course.level || 'Beginner',
      price: course.pricing?.amount || course.price || 0,
      discountedPrice: course.pricing?.discountedAmount || '',
      tagline: course.tagline || '',
      description: course.description || '',
      thumbnail: course.thumbnail || '',
      status: course.status || 'PUBLISHED',
    });
    setModalError(null);
    setModalSuccess(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalError(null);
    setModalSuccess(null);
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumbnail(true);
    setModalError(null);
    try {
      const res = await uploadService.uploadFile(file, 'thumbnails');
      const uploadedUrl = res.fullUrl || res.url;
      setFormData((prev) => ({ ...prev, thumbnail: uploadedUrl }));
    } catch (err) {
      setModalError(err.response?.data?.message || err.message || 'Failed to upload thumbnail');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleOpenCurriculumModal = (course) => {
    setCurriculumCourse(course);
    const existing = Array.isArray(course.modules) ? JSON.parse(JSON.stringify(course.modules)) : [];
    const initialModules =
      existing.length > 0
        ? existing
        : [{ title: 'Module 1: Getting Started', order: 1, lectures: [] }];
    setCurriculumModules(initialModules);

    const initialExpanded = {};
    initialModules.forEach((_, idx) => {
      initialExpanded[idx] = true;
    });
    setExpandedModules(initialExpanded);

    setCurriculumError(null);
    setCurriculumSuccess(null);
    setIsCurriculumOpen(true);
  };

  const toggleModuleExpand = (modIdx) => {
    setExpandedModules((prev) => ({ ...prev, [modIdx]: !prev[modIdx] }));
  };

  const handleAddModule = () => {
    const newIdx = curriculumModules.length;
    setCurriculumModules([
      ...curriculumModules,
      {
        title: `Module ${newIdx + 1}: Core Concepts`,
        order: newIdx + 1,
        lectures: [],
      },
    ]);
    setExpandedModules((prev) => ({ ...prev, [newIdx]: true }));
  };

  const handleUpdateModuleTitle = (modIdx, title) => {
    const updated = [...curriculumModules];
    updated[modIdx].title = title;
    setCurriculumModules(updated);
  };

  const handleDeleteModule = (modIdx) => {
    if (curriculumModules.length <= 1) {
      setCurriculumError('Course must have at least one module.');
      return;
    }
    const updated = curriculumModules
      .filter((_, i) => i !== modIdx)
      .map((m, i) => ({ ...m, order: i + 1 }));
    setCurriculumModules(updated);
  };

  const handleAddLecture = (modIdx) => {
    const updated = [...curriculumModules];
    const currentLectures = updated[modIdx].lectures || [];
    const newOrder = currentLectures.length + 1;
    updated[modIdx].lectures = [
      ...currentLectures,
      {
        title: `Lesson ${newOrder}: Lecture Title`,
        order: newOrder,
        durationMinutes: 15,
        isPreview: currentLectures.length === 0,
        videoStreamUrl: '',
        description: '',
      },
    ];
    setCurriculumModules(updated);
  };

  const handleUpdateLecture = (modIdx, lecIdx, field, value) => {
    const updated = [...curriculumModules];
    updated[modIdx].lectures[lecIdx][field] = value;
    setCurriculumModules(updated);
  };

  const handleDeleteLecture = (modIdx, lecIdx) => {
    const updated = [...curriculumModules];
    updated[modIdx].lectures = updated[modIdx].lectures
      .filter((_, i) => i !== lecIdx)
      .map((l, i) => ({ ...l, order: i + 1 }));
    setCurriculumModules(updated);
  };

  const handleSaveCurriculum = async () => {
    if (!curriculumCourse) return;
    for (let i = 0; i < curriculumModules.length; i++) {
      if (!curriculumModules[i].title?.trim()) {
        setCurriculumError(`Module ${i + 1} must have a title.`);
        return;
      }
    }

    setIsSavingCurriculum(true);
    setCurriculumError(null);
    setCurriculumSuccess(null);

    try {
      let totalLectures = 0;
      let totalMinutes = 0;
      curriculumModules.forEach((m) => {
        (m.lectures || []).forEach((l) => {
          totalLectures += 1;
          totalMinutes += Number(l.durationMinutes) || 0;
        });
      });
      const durationHours = Math.max(1, Math.round(totalMinutes / 60));

      const courseId = curriculumCourse._id || curriculumCourse.id;
      await adminService.updateCourse(courseId, {
        modules: curriculumModules,
        totalLectures,
        durationHours,
      });

      setCurriculumSuccess('Curriculum updated successfully!');
      fetchCourses();
      setTimeout(() => {
        setIsCurriculumOpen(false);
      }, 1200);
    } catch (err) {
      setCurriculumError(
        err.response?.data?.message || err.message || 'Failed to save curriculum'
      );
    } finally {
      setIsSavingCurriculum(false);
    }
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setModalError('Please enter a course title.');
      return;
    }
    if (formData.price <= 0) {
      setModalError('Price must be greater than zero.');
      return;
    }

    setIsSaving(true);
    setModalError(null);
    setModalSuccess(null);

    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        level: formData.level,
        price: Number(formData.price),
        ...(formData.discountedPrice && {
          originalPrice: Number(formData.price),
          price: Number(formData.discountedPrice),
        }),
        subtitle: formData.tagline.trim() || 'Comprehensive practical course for tech professionals.',
        description: formData.description.trim() || formData.tagline.trim() || 'Comprehensive course by MSN Academy',
        thumbnail: formData.thumbnail.trim(),
        status: formData.status,
      };

      let res;
      if (isEditing) {
        res = await adminService.updateCourse(currentCourseId, payload);
      } else {
        res = await adminService.createCourse(payload);
      }

      if (res.success) {
        setModalSuccess(isEditing ? 'Course updated successfully!' : 'New course published successfully!');
        setTimeout(() => {
          handleCloseModal();
          fetchCourses();
        }, 1200);
      } else {
        setModalError(res.message || 'Operation failed');
      }
    } catch (err) {
      setModalError(err.response?.data?.message || err.message || 'Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    setIsDeleting(true);
    try {
      const res = await adminService.deleteCourse(courseId);
      if (res.success) {
        setCourses((prev) => prev.filter((c) => (c._id || c.id) !== courseId));
        setDeleteConfirmId(null);
      } else {
        alert(res.message || 'Failed to archive course');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to archive course');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesCategory =
      selectedCategory === 'ALL' || c.category?.toLowerCase() === selectedCategory.toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      c.title?.toLowerCase().includes(term) ||
      c.tagline?.toLowerCase().includes(term) ||
      c.category?.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Course Catalog Management</h1>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/20">
              Live Catalog
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Create new courses, edit pricing, curriculum parameters, and archive offerings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start">
          <button
            onClick={fetchCourses}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        {/* Category Pills / Dropdown */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.slice(0, 4).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Courses Cards Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Loading course catalog...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 py-16 text-center text-slate-500 text-xs">
          No courses found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((c) => {
            const courseId = c._id || c.id;
            const price = c.pricing?.amount || c.price || 0;
            const discountedPrice = c.pricing?.discountedAmount;
            const isArchived = c.status === 'ARCHIVED';

            return (
              <div
                key={courseId}
                className={`group rounded-2xl border bg-slate-900/70 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg ${
                  isArchived ? 'opacity-60 border-slate-800/50' : 'border-slate-800'
                }`}
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                    {c.thumbnail ? (
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-800 text-slate-600">
                        <GraduationCap className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                    {/* Category & Status badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/80 text-amber-400 border border-amber-500/30 backdrop-blur-sm">
                        {c.category || 'Tech'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          c.status === 'PUBLISHED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm'
                            : isArchived
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 backdrop-blur-sm'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-sm'
                        }`}
                      >
                        {c.status || 'DRAFT'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="capitalize">{c.level || 'Beginner'}</span>
                      <span>•</span>
                      <span>
                        {c.totalLectures || (c.modules?.reduce((acc, m) => acc + (m.lectures?.length || 0), 0)) || 0} lessons
                      </span>
                      <span>•</span>
                      <span>{c.modules?.length || 0} modules</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {c.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {c.tagline || c.description || 'No course overview provided.'}
                    </p>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="p-4 pt-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-amber-400">
                      PKR {price.toLocaleString()}
                    </span>
                    {discountedPrice && (
                      <span className="text-xs text-slate-500 line-through ml-2">
                        PKR {discountedPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Curriculum / Syllabus button */}
                    <button
                      onClick={() => handleOpenCurriculumModal(c)}
                      title="Manage Curriculum (Modules & Lectures)"
                      className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-2.5 py-1.5 text-xs font-semibold text-sky-400 hover:bg-sky-500/20 hover:border-sky-400 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Syllabus</span>
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => handleOpenEditModal(c)}
                      title="Edit Course"
                      className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>

                    {/* Archive button */}
                    {deleteConfirmId === courseId ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteCourse(courseId)}
                          disabled={isDeleting}
                          title="Confirm Archive"
                          className="rounded-lg bg-rose-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-rose-500 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="rounded-lg bg-slate-800 px-1.5 py-1 text-[10px] text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(courseId)}
                        title="Archive Course"
                        className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isEditing ? 'Edit Course Curriculum' : 'Create New Academy Course'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set up course details, pricing, level, and enrollment parameters.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{modalError}</span>
              </div>
            )}
            {modalSuccess && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{modalSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitCourse} className="space-y-4 text-xs">
              {/* Course Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Full Stack MERN Development Bootcamp"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Category & Level Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Skill Level *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    {LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Regular Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Discounted Price (PKR, Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                    placeholder="e.g. 12000"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Course Tagline (Short Summary)
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Master React, Node, Express, and MongoDB from scratch to deployment."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive syllabus overview, prerequisites, and learning outcomes..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Thumbnail Image URL & Direct Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Thumbnail Image
                  </label>
                  <label className="cursor-pointer text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>{uploadingThumbnail ? 'Uploading...' : 'Upload Image from PC'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleThumbnailUpload}
                      disabled={uploadingThumbnail}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div className="flex gap-3 items-center">
                  {formData.thumbnail && (
                    <img
                      src={formData.thumbnail.startsWith('/uploads') ? `http://localhost:5000${formData.thumbnail}` : formData.thumbnail}
                      alt="Thumbnail preview"
                      className="h-12 w-20 rounded-lg object-cover border border-slate-700 shrink-0 bg-slate-950"
                    />
                  )}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="Paste image URL or click 'Upload Image from PC'"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                    {uploadingThumbnail && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Publishing Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Catalog Publishing Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="PUBLISHED">Published (Available for purchase)</option>
                  <option value="DRAFT">Draft (Staff only preview)</option>
                  <option value="ARCHIVED">Archived (Hidden from catalog)</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  <span>{isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Course'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Curriculum Builder Modal ────────────────────────────────────── */}
      {isCurriculumOpen && curriculumCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    Curriculum Builder
                  </span>
                  <span className="text-xs text-slate-400">
                    {curriculumModules.length} Modules •{' '}
                    {curriculumModules.reduce((acc, m) => acc + (m.lectures?.length || 0), 0)} Lessons
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white line-clamp-1">
                  {curriculumCourse.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddModule}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-400 hover:bg-sky-500/20 transition-colors shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Module</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCurriculumOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Alerts */}
            {curriculumError && (
              <div className="m-4 mb-0 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{curriculumError}</span>
              </div>
            )}
            {curriculumSuccess && (
              <div className="m-4 mb-0 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{curriculumSuccess}</span>
              </div>
            )}

            {/* Modal Body / Modules Accordion */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {curriculumModules.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No modules yet. Click "Add Module" above to start building your course syllabus.</p>
                </div>
              ) : (
                curriculumModules.map((mod, modIdx) => {
                  const isExpanded = !!expandedModules[modIdx];
                  const lectures = mod.lectures || [];

                  return (
                    <div
                      key={modIdx}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden shadow-sm"
                    >
                      {/* Module Top Bar */}
                      <div className="flex items-center justify-between p-3.5 bg-slate-950/80 gap-3">
                        <button
                          type="button"
                          onClick={() => toggleModuleExpand(modIdx)}
                          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors shrink-0"
                        >
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          />
                          <span className="text-[11px] font-mono font-bold uppercase text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            Mod {modIdx + 1}
                          </span>
                        </button>

                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) => handleUpdateModuleTitle(modIdx, e.target.value)}
                          placeholder="Module Title (e.g. Module 1: Web Fundamentals)"
                          className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                        />

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {lectures.length} lessons
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteModule(modIdx)}
                            title="Delete Module"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Module Content / Lectures */}
                      {isExpanded && (
                        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-900/40">
                          {lectures.length === 0 ? (
                            <p className="text-xs text-slate-500 italic py-2">
                              No lessons in this module yet.
                            </p>
                          ) : (
                            <div className="space-y-2.5">
                              {lectures.map((lec, lecIdx) => (
                                <div
                                  key={lecIdx}
                                  className="rounded-xl border border-slate-800/80 bg-slate-950 p-3 space-y-2.5"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-mono text-slate-300 font-bold shrink-0">
                                      {lecIdx + 1}
                                    </span>
                                    <input
                                      type="text"
                                      value={lec.title}
                                      onChange={(e) =>
                                        handleUpdateLecture(modIdx, lecIdx, 'title', e.target.value)
                                      }
                                      placeholder="Lesson Title (e.g. Setting Up VS Code & Git)"
                                      className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none font-medium"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteLecture(modIdx, lecIdx)}
                                      title="Delete Lesson"
                                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                                    {/* Video Stream URL */}
                                    <div className="sm:col-span-8 relative">
                                      <Video className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                                      <input
                                        type="url"
                                        value={lec.videoStreamUrl || ''}
                                        onChange={(e) =>
                                          handleUpdateLecture(
                                            modIdx,
                                            lecIdx,
                                            'videoStreamUrl',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Video Stream URL (MP4, YouTube unlisted, Cloudflare)"
                                        className="w-full rounded-lg border border-slate-800 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                      />
                                    </div>

                                    {/* Duration in Minutes */}
                                    <div className="sm:col-span-2 relative">
                                      <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                                      <input
                                        type="number"
                                        min="1"
                                        value={lec.durationMinutes || 15}
                                        onChange={(e) =>
                                          handleUpdateLecture(
                                            modIdx,
                                            lecIdx,
                                            'durationMinutes',
                                            Number(e.target.value)
                                          )
                                        }
                                        placeholder="Min"
                                        className="w-full rounded-lg border border-slate-800 bg-slate-900 pl-8 pr-2 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                                      />
                                    </div>

                                    {/* Free Preview Toggle */}
                                    <div className="sm:col-span-2 flex items-center justify-start sm:justify-end gap-1.5 pl-1">
                                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-slate-400 select-none">
                                        <input
                                          type="checkbox"
                                          checked={!!lec.isPreview}
                                          onChange={(e) =>
                                            handleUpdateLecture(
                                              modIdx,
                                              lecIdx,
                                              'isPreview',
                                              e.target.checked
                                            )
                                          }
                                          className="rounded border-slate-700 bg-slate-800 text-brand-crimson focus:ring-0 focus:ring-offset-0"
                                        />
                                        <span className={lec.isPreview ? 'text-amber-400' : ''}>
                                          Preview
                                        </span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => handleAddLecture(modIdx)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-700/80 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add Lesson</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/80">
              <div className="text-xs text-slate-400">
                <span>Total: </span>
                <strong className="text-white">
                  {curriculumModules.reduce((acc, m) => acc + (m.lectures?.length || 0), 0)} lessons
                </strong>
                <span> across </span>
                <strong className="text-white">{curriculumModules.length} modules</strong>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCurriculumOpen(false)}
                  disabled={isSavingCurriculum}
                  className="rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCurriculum}
                  disabled={isSavingCurriculum}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 transition-all shadow-md shadow-sky-500/20 disabled:opacity-50"
                >
                  {isSavingCurriculum ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving Syllabus...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Save Curriculum</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
