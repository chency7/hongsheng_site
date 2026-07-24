'use client';

import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  LoaderCircle,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShieldX,
  UserRound,
  Users,
} from 'lucide-react';
import { useAdminSession } from '../components/AdminSessionContext';

type ManagedUser = {
  id: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  createdAt: string | null;
  confirmedAt: string | null;
  lastSignInAt: string | null;
};

const USERS_CACHE_TTL_MS = 30000;
let usersCache: { users: ManagedUser[]; expiresAt: number } | null = null;

function formatDate(value: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function readApiMessage(response: Response | null, fallback: string) {
  if (!response) return fallback;
  const data = await response.json().catch(() => null) as { message?: string } | null;
  return data?.message || fallback;
}

export default function AdminUsersPage() {
  const currentUser = useAdminSession();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createAsAdmin, setCreateAsAdmin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter((user) => user.isAdmin).length,
  }), [users]);

  const loadUsers = useCallback(async (force = false) => {
    setError('');
    if (!force && usersCache && usersCache.expiresAt > Date.now()) {
      setUsers(usersCache.users);
      setLoading(false);
      return;
    }

    setLoading(true);
    const response = await fetch('/api/admin/users', { cache: 'no-store' }).catch(() => null);
    const data = response?.ok ? await response.json().catch(() => null) as { users?: ManagedUser[] } | null : null;

    if (!response?.ok || !data?.users) {
      setError(await readApiMessage(response, '账号列表读取失败'));
      setLoading(false);
      return;
    }

    setUsers(data.users);
    usersCache = { users: data.users, expiresAt: Date.now() + USERS_CACHE_TTL_MS };
    setLoading(false);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => loadUsers());
  }, [loadUsers]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setCreating(true);

    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, isAdmin: createAsAdmin }),
    }).catch(() => null);
    const data = response?.ok ? await response.json().catch(() => null) as { user?: ManagedUser } | null : null;

    if (!response?.ok || !data?.user) {
      setError(await readApiMessage(response, '账号创建失败'));
      setCreating(false);
      return;
    }

    setUsers((current) => {
      const nextUsers = [data.user!, ...current.filter((user) => user.id !== data.user!.id)];
      usersCache = { users: nextUsers, expiresAt: Date.now() + USERS_CACHE_TTL_MS };
      return nextUsers;
    });
    setEmail('');
    setPassword('');
    setCreateAsAdmin(true);
    setMessage(`已创建账号 ${data.user.email}`);
    setCreating(false);
  };

  const handleRoleChange = async (user: ManagedUser, isAdmin: boolean) => {
    setError('');
    setMessage('');
    setUpdatingUserId(user.id);

    const response = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, isAdmin }),
    }).catch(() => null);
    const data = response?.ok ? await response.json().catch(() => null) as { user?: ManagedUser } | null : null;

    if (!response?.ok || !data?.user) {
      setError(await readApiMessage(response, '账号权限更新失败'));
      setUpdatingUserId(null);
      return;
    }

    setUsers((current) => {
      const nextUsers = current.map((item) => (item.id === data.user!.id ? data.user! : item));
      usersCache = { users: nextUsers, expiresAt: Date.now() + USERS_CACHE_TTL_MS };
      return nextUsers;
    });
    setMessage(`${data.user.email} 已${data.user.isAdmin ? '授予' : '取消'}管理员权限`);
    setUpdatingUserId(null);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1E3A5F]">账号权限</h1>
          <p className="mt-1 text-sm text-[#999999]">
            共 {stats.total} 个账号，{stats.admins} 个管理员
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadUsers(true)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#E8ECF0] bg-white px-4 py-2.5 text-sm font-medium text-[#666666] shadow-sm transition-colors duration-150 hover:bg-[#F5F7FA] hover:text-[#1E3A5F] disabled:cursor-wait disabled:text-[#A6B0BB]"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          刷新列表
        </button>
      </div>

      {error ? (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {message ? (
        <div role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-xl border border-[#E8ECF0] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="mb-5 flex items-center gap-3 border-b border-[#E8ECF0] pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0F5FA] text-[#4A90D9]">
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#1E3A5F]">新增后台账号</h2>
              <p className="mt-0.5 text-xs text-[#999999]">创建后可立即用于后台登录</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label htmlFor="admin-user-email" className="mb-2 block text-sm font-medium text-[#32485c]">
                邮箱
              </label>
              <input
                id="admin-user-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                className="h-11 w-full rounded-lg border border-[#E8ECF0] px-3 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="admin-user-password" className="mb-2 block text-sm font-medium text-[#32485c]">
                初始密码
              </label>
              <input
                id="admin-user-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="不少于 6 位"
                className="h-11 w-full rounded-lg border border-[#E8ECF0] px-3 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <label className="flex items-center justify-between gap-3 rounded-lg border border-[#E8ECF0] bg-[#F9FAFB] px-3 py-3 text-sm text-[#32485c]">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#28A745]" aria-hidden="true" />
                授予管理员权限
              </span>
              <input
                type="checkbox"
                checked={createAsAdmin}
                onChange={(event) => setCreateAsAdmin(event.target.checked)}
                className="h-4 w-4 rounded border-[#CBD5E1] text-[#1E3A5F]"
              />
            </label>

            <button
              type="submit"
              disabled={creating}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1E3A5F] px-5 text-sm font-medium text-white shadow-md shadow-[#1E3A5F]/10 transition-[background-color,transform] duration-150 hover:-translate-y-[1px] hover:bg-[#162A45] disabled:cursor-wait disabled:bg-[#7f8fa1]"
            >
              {creating ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
              {creating ? '正在创建' : '创建账号'}
            </button>
          </form>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#E8ECF0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-[#E8ECF0] bg-[#F9FAFB] px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1E3A5F]">
              <Users className="h-4 w-4" aria-hidden="true" />
              Auth 账号
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-[#E8ECF0] bg-[#F9FAFB]">
                <tr>
                  <th className="px-4 py-4 text-xs font-medium uppercase text-[#999999]">账号</th>
                  <th className="px-4 py-4 text-xs font-medium uppercase text-[#999999]">权限</th>
                  <th className="px-4 py-4 text-xs font-medium uppercase text-[#999999]">创建时间</th>
                  <th className="px-4 py-4 text-xs font-medium uppercase text-[#999999]">最近登录</th>
                  <th className="px-4 py-4 text-xs font-medium uppercase text-[#999999]">操作</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-14 text-center text-sm text-[#999999]">
                      正在读取账号列表...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-14 text-center text-sm text-[#999999]">
                      暂无账号
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const isSelf = currentUser?.id === user.id;
                    const isUpdating = updatingUserId === user.id;

                    return (
                      <tr key={user.id} className="border-b border-[#E8ECF0] transition-colors hover:bg-[#F9FAFB]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0F5FA] text-[#4A90D9]">
                              <UserRound className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-[#333333]">{user.displayName}</p>
                              <p className="truncate text-xs text-[#999999]">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {user.isAdmin ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                              管理员
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                              <ShieldX className="h-3.5 w-3.5" aria-hidden="true" />
                              普通账号
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#666666]">{formatDate(user.createdAt)}</td>
                        <td className="px-4 py-3 text-[#666666]">{formatDate(user.lastSignInAt)}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => void handleRoleChange(user, !user.isAdmin)}
                            disabled={isUpdating || (isSelf && user.isAdmin)}
                            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                              user.isAdmin
                                ? 'border border-red-100 bg-red-50 text-red-600 hover:bg-red-100'
                                : 'border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {isUpdating ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : null}
                            {user.isAdmin ? '取消权限' : '设为管理员'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
