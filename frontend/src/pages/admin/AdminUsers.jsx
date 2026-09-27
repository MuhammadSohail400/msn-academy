import React, { useEffect, useState } from 'react';
import {
  Users,
  Shield,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  Search,
  CheckCircle2,
  X,
  Check,
  GraduationCap,
} from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Role Change Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [targetRole, setTargetRole] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = { limit: 100 };
      if (roleFilter !== 'ALL') {
        params.role = roleFilter;
      }
      if (search.trim()) {
        params.search = search.trim();
      }
      const res = await adminService.getAdminUsers(params);
      if (res.success) {
        setUsers(res.data?.users || res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load users directory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleOpenRoleModal = (user, newRole) => {
    setSelectedUser(user);
    setTargetRole(newRole);
    setActionError(null);
    setActionSuccess(null);
  };

  const handleCloseRoleModal = () => {
    setSelectedUser(null);
    setTargetRole(null);
    setActionError(null);
    setActionSuccess(null);
  };

  const handleConfirmRoleUpdate = async () => {
    if (!selectedUser || !targetRole) return;
    setIsUpdating(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await adminService.updateUserRole(selectedUser._id || selectedUser.id, targetRole);
      if (res.success) {
        setActionSuccess(`User role updated to ${targetRole} successfully!`);
        setUsers((prev) =>
          prev.map((u) =>
            (u._id || u.id) === (selectedUser._id || selectedUser.id)
              ? { ...u, role: targetRole }
              : u
          )
        );
        setTimeout(() => {
          handleCloseRoleModal();
        }, 1200);
      } else {
        setActionError(res.message || 'Role update failed');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to change user role');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const name = u.fullName?.toLowerCase() || '';
    const email = u.email?.toLowerCase() || '';
    return name.includes(term) || email.includes(term);
  });

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const studentCount = users.filter((u) => u.role !== 'ADMIN').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Users & Students Directory</h1>
            <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-purple-400 border border-purple-500/20">
              Access Control
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Browse registered profiles, audit enrollments, and manage administrative privileges.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={isLoading}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reload Directory</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Volume Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-medium text-slate-400">Total Registered</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{users.length}</span>
            <span className="text-xs text-slate-400">Users on platform</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-medium text-slate-400">Students</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-400">{studentCount}</span>
            <span className="text-xs text-blue-400 font-semibold">Active learners</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-medium text-slate-400">Administrators</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400">{adminCount}</span>
            <span className="text-xs text-amber-400 font-semibold">Privileged staff</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        {/* Role Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'STUDENT', 'ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                roleFilter === r
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r === 'STUDENT' ? 'Students Only' : 'Admins Only'}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name or email..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Users Directory ({filteredUsers.length})
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading user profiles...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No users found matching the search filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">User Profile</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Enrolled Courses</th>
                  <th className="py-3 px-4">Email Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Access Role Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredUsers.map((u) => {
                  const isAdmin = u.role === 'ADMIN';
                  const userId = u._id || u.id;

                  return (
                    <tr key={userId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-amber-400 font-bold text-xs border border-slate-700">
                            {(u.fullName || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{u.fullName || 'Student'}</div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isAdmin
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {isAdmin && <Shield className="h-3 w-3" />}
                          {u.role || 'STUDENT'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white text-xs">
                          {u.enrolledCoursesCount || 0}
                        </span>
                        <span className="text-slate-500 text-[11px] ml-1">courses</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            u.isEmailVerified
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-slate-400 bg-slate-800'
                          }`}
                        >
                          {u.isEmailVerified ? 'VERIFIED' : 'UNVERIFIED'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isAdmin ? (
                          <button
                            onClick={() => handleOpenRoleModal(u, 'STUDENT')}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                          >
                            <span>Revert to Student</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenRoleModal(u, 'ADMIN')}
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-colors"
                          >
                            <Shield className="h-3 w-3" />
                            <span>Make Admin</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Confirmation Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Confirm Role Change
                </h3>
              </div>
              <button
                onClick={handleCloseRoleModal}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {actionError && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{actionError}</span>
              </div>
            )}
            {actionSuccess && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{actionSuccess}</span>
              </div>
            )}

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs">
              <p className="text-slate-300">
                You are about to change the system role for:
              </p>
              <div className="font-bold text-white text-sm">{selectedUser.fullName}</div>
              <div className="text-slate-400">{selectedUser.email}</div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Target Role:</span>
                <span className="font-bold text-amber-400 uppercase text-xs">
                  {targetRole}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {targetRole === 'ADMIN'
                ? 'Granting administrator privileges gives this user full permission to verify payments, edit courses, and inspect student records.'
                : 'Reverting this user to student will revoke their access to the Admin Portal.'}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCloseRoleModal}
                disabled={isUpdating}
                className="rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRoleUpdate}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                <span>{isUpdating ? 'Updating...' : `Confirm ${targetRole}`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
