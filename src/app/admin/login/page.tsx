'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Factory, LoaderCircle, LockKeyhole, LogIn, Mail } from 'lucide-react';
import { getSupabaseBrowserClient, hasAdminRole } from '@/lib/supabase-browser';

function mapLoginError(error: { status?: number; message?: string }): string {
  if (error.status === 400) return '邮箱或密码错误，请重试';
  if (error.status === 422) return '请输入有效的邮箱和密码';
  if (error.status === 429) return '尝试次数过多，请稍后再试';
  if (error.message) return error.message;
  return '登录服务暂时不可用，请稍后重试';
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        setError(mapLoginError(loginError));
        setLoading(false);
        return;
      }

      if (!data.user || !hasAdminRole(data.user)) {
        await supabase.auth.signOut();
        setError('该账号没有后台管理权限');
        setLoading(false);
        return;
      }

      router.replace('/admin/dashboard');
      return;
    } catch {
      setError('登录服务暂时不可用，请稍后重试');
    }

    setLoading(false);
  };

  return (
    <main
      className="login-stage relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#0B0F16] px-4 py-10 text-white sm:px-6"
      style={{ colorScheme: 'dark' }}
    >
      <style>{`
        .login-stage {
          background-color: #0B0F16;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            radial-gradient(70% 55% at 78% 8%, rgba(244, 180, 0, 0.16) 0%, transparent 60%),
            radial-gradient(65% 60% at 12% 96%, rgba(11, 42, 74, 0.55) 0%, transparent 62%),
            linear-gradient(160deg, #0B0F16 0%, #0A1628 55%, #0B0F16 100%);
          background-size: 44px 44px, 44px 44px, auto, auto, auto;
        }
        .login-stage::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(60% 40% at 50% 100%, rgba(0, 0, 0, 0.55) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-card {
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
        }
        .login-enter {
          animation: login-enter 460ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes login-enter {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .login-enter {
            animation: none !important;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[8%] top-[16%] hidden h-24 w-px bg-white/10 lg:block" />
        <div className="absolute left-[8%] top-[16%] hidden h-px w-36 bg-white/10 lg:block" />
        <div className="absolute bottom-[18%] right-[9%] hidden h-28 w-px bg-[#F4B400]/30 lg:block" />
        <div className="absolute bottom-[18%] right-[9%] hidden h-px w-40 bg-[#F4B400]/30 lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <section className="login-enter relative z-10 w-full max-w-[440px]">
        <div className="mb-6 flex items-center justify-center gap-3 sm:mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#F4B400]/35 bg-[#F4B400]/10 text-[#F4B400] shadow-[0_0_28px_rgba(244,180,0,0.18)] backdrop-blur">
            <Factory className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-white">湖南协力鸿胜机械</p>
            <p className="mt-0.5 text-xs font-medium text-zinc-400">产品管理后台</p>
          </div>
        </div>

        <div className="login-card relative overflow-hidden rounded-2xl border border-white/10 px-5 py-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F4B400]/60 to-transparent" />

          <div className="mb-7 flex items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F4B400]">
                Admin Console
              </p>
              <h1 className="mt-3 text-[22px] font-semibold leading-tight text-white">管理员登录</h1>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-white/10 bg-white/5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#F4B400] shadow-[0_0_0_5px_rgba(244,180,0,0.14)]" />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error ? (
              <div
                role="alert"
                className="rounded-[8px] border border-red-400/25 bg-red-500/10 px-3 py-2.5 text-sm text-red-300"
              >
                {error}
              </div>
            ) : null}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
                邮箱
              </label>
              <div className="flex h-12 items-center rounded-[8px] border border-white/10 bg-white/[0.04] px-3 transition-colors focus-within:border-[#F4B400]/70 focus-within:bg-white/[0.06] focus-within:ring-2 focus-within:ring-[#F4B400]/20">
                <Mail className="mr-2.5 h-[18px] w-[18px] shrink-0 text-zinc-500" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-300">
                密码
              </label>
              <div className="flex h-12 items-center rounded-[8px] border border-white/10 bg-white/[0.04] px-3 transition-colors focus-within:border-[#F4B400]/70 focus-within:bg-white/[0.06] focus-within:ring-2 focus-within:ring-[#F4B400]/20">
                <LockKeyhole className="mr-2.5 h-[18px] w-[18px] shrink-0 text-zinc-500" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="请输入密码"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400]"
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                  title={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[#F4B400] px-4 text-sm font-semibold text-[#0B0F16] shadow-[0_14px_30px_rgba(244,180,0,0.22)] transition-colors hover:bg-[#F7D060] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F16] disabled:cursor-wait disabled:bg-zinc-600 disabled:text-zinc-300 disabled:shadow-none"
            >
              {loading ? <LoaderCircle className="h-[18px] w-[18px] animate-spin" aria-hidden="true" /> : <LogIn className="h-[18px] w-[18px]" aria-hidden="true" />}
              {loading ? '正在验证' : '登录后台'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} 湖南协力鸿胜机械有限公司
        </p>
      </section>
    </main>
  );
}
