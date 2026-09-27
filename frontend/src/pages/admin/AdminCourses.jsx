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
} from 'lucide-react';
import adminService from '../../services/adminService';

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
                      <span>{c.lessonsCount || (c.curriculum?.length || 0)} lessons</span>
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

              {/* Thumbnail URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
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
    </div>
  );
}
