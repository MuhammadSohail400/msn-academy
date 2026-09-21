import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  User,
  Edit2,
  Lock,
  Bell,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Camera,
  Save,
  X,
} from 'lucide-react';
import profileService from '../../services/profileService';
import { fetchMe } from '../../features/auth/slice/authSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth?.user);

  // Split name for First Name / Last Name
  const splitNames = (nameStr = '') => {
    const parts = nameStr.trim().split(' ');
    const first = parts[0] || '';
    const last = parts.slice(1).join(' ') || '';
    return { first, last };
  };

  const initialNames = splitNames(authUser?.fullName);

  // Profile Information State
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: initialNames.first || 'Ahmed',
    lastName: initialNames.last || 'Hassan',
    email: authUser?.email || 'ahmed@example.com',
    phoneNumber: authUser?.phoneNumber || '+92 300 1234567',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordFieldErrors, setPasswordFieldErrors] = useState({});

  // Notification Preference State
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Fetch latest profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await profileService.getProfile();
        if (res?.data) {
          const user = res.data.user || res.data;
          const { first, last } = splitNames(user.fullName);
          setProfileForm({
            firstName: first,
            lastName: last,
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
          });
        }
      } catch (err) {
        // graceful fallback to Redux auth user
      }
    }
    loadProfile();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profileForm.firstName.trim()) {
      setProfileError('First name is required');
      return;
    }

    setProfileLoading(true);
    const fullName = `${profileForm.firstName.trim()} ${profileForm.lastName.trim()}`.trim();

    try {
      await profileService.updateProfile({
        fullName,
        phoneNumber: profileForm.phoneNumber.trim() || undefined,
      });

      setProfileSuccess('Personal information updated successfully');
      setIsEditing(false);
      dispatch(fetchMe());
    } catch (err) {
      setProfileError(err?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const validatePasswordChange = () => {
    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Enter your current password';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = 'Enter a new password';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Za-z]/.test(passwordForm.newPassword) || !/[0-9]/.test(passwordForm.newPassword)) {
      errors.newPassword = 'Must contain both letters and numbers';
    }

    if (!passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = 'Confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }

    setPasswordFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!validatePasswordChange()) return;

    setPasswordLoading(true);
    try {
      await profileService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordSuccess('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setPasswordFieldErrors({});
    } catch (err) {
      setPasswordError(err?.message || 'Failed to change password. Please verify current password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const fullName = `${profileForm.firstName} ${profileForm.lastName}`.trim() || 'Ahmed Hassan';

  return (
    <div className="space-y-8 pb-12">
      {/* Top Breadcrumb & Heading matching Figma */}
      <div>
        <div className="text-xs text-slate-400 font-medium mb-1">
          Course Overview (LMS) <span className="mx-1">›</span>{' '}
          <span className="text-slate-600 font-semibold">Student Profile</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal information, password and notification preference.
        </p>
      </div>

      {/* Top 2 Cards: Avatar & Personal Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Avatar */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-2xs flex flex-col items-center justify-center text-center">
          <div className="relative mb-4">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-900 text-white font-display text-3xl font-bold shadow-md">
              {profileForm.firstName.charAt(0)}
              {profileForm.lastName.charAt(0)}
            </div>
            <button
              type="button"
              onClick={() => alert('Profile photo upload will be available in the next release.')}
              className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-brand-crimson shadow-xs hover:bg-slate-50 transition-colors"
              title="Change photo"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <h3 className="font-display text-xl font-bold text-slate-900">
            {fullName}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {profileForm.email}
          </p>
        </div>

        {/* Card 2: Personal Information */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Personal Information
              </h2>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-brand-crimson hover:text-brand-crimson-hover hover:underline transition-colors"
                >
                  Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
              )}
            </div>

            {profileSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            {!isEditing ? (
              /* View Mode matching Figma student Profile-desktop.png */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                <div>
                  <span className="text-xs text-slate-400 font-medium">First Name</span>
                  <p className="font-display text-base font-bold text-slate-900 mt-0.5">
                    {profileForm.firstName}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-medium">Last Name</span>
                  <p className="font-display text-base font-bold text-slate-900 mt-0.5">
                    {profileForm.lastName}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-medium">Email</span>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">
                    {profileForm.email}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-medium">Phone</span>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">
                    {profileForm.phoneNumber || '—'}
                  </p>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phoneNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-crimson px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-crimson-hover disabled:opacity-60 transition-colors shadow-2xs"
                  >
                    {profileLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom 2 Cards: Change Password & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 3: Change Password */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
          <h2 className="font-display text-lg font-bold text-slate-900 mb-5 border-b border-slate-100 pb-3">
            Change Password
          </h2>

          {passwordSuccess && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => {
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                  if (passwordFieldErrors.currentPassword) {
                    setPasswordFieldErrors({ ...passwordFieldErrors, currentPassword: '' });
                  }
                }}
                placeholder="••••••••"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-1 ${
                  passwordFieldErrors.currentPassword
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-brand-crimson focus:ring-brand-crimson'
                }`}
              />
              {passwordFieldErrors.currentPassword && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {passwordFieldErrors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => {
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                  if (passwordFieldErrors.newPassword) {
                    setPasswordFieldErrors({ ...passwordFieldErrors, newPassword: '' });
                  }
                }}
                placeholder="••••••••"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-1 ${
                  passwordFieldErrors.newPassword
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-brand-crimson focus:ring-brand-crimson'
                }`}
              />
              {passwordFieldErrors.newPassword && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {passwordFieldErrors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmNewPassword}
                onChange={(e) => {
                  setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value });
                  if (passwordFieldErrors.confirmNewPassword) {
                    setPasswordFieldErrors({ ...passwordFieldErrors, confirmNewPassword: '' });
                  }
                }}
                placeholder="••••••••"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-1 ${
                  passwordFieldErrors.confirmNewPassword
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-brand-crimson focus:ring-brand-crimson'
                }`}
              />
              {passwordFieldErrors.confirmNewPassword && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {passwordFieldErrors.confirmNewPassword}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-crimson px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover disabled:opacity-60 transition-colors"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Card 4: Notifications */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 mb-5 border-b border-slate-100 pb-3">
              Notifications
            </h2>

            <div className="flex items-center justify-between py-2">
              <div className="pr-4">
                <p className="text-xs font-bold text-slate-900">
                  Email Notifications
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Course updates and announcements
                </p>
              </div>

              {/* Toggle Switch matching Figma */}
              <button
                type="button"
                role="switch"
                aria-checked={emailNotifications}
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  emailNotifications ? 'bg-brand-crimson' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    emailNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
