'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Factory, LoaderCircle, LockKeyhole, LogIn, Mail } from 'lucide-react';

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

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).catch(() => null);

    if (response?.ok) {
      router.replace('/admin/dashboard');
      router.refresh();
      return;
    }

    const data = response ? await response.json().catch(() => null) : null;
    setError(data?.message || '登录服务暂时不可用，请稍后重试');
    setLoading(false);
  };

  return (
    <main className="login-stage relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#f6f3ee] px-4 py-10 text-[#172438] sm:px-6">
      <style>{`
        .login-stage {
          background-image:
            linear-gradient(rgba(34, 49, 63, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 49, 63, 0.045) 1px, transparent 1px),
            linear-gradient(135deg, #f7f4ef 0%, #eef4f7 52%, #f8f6f0 100%);
          background-size: 40px 40px, 40px 40px, auto;
        }
        .login-stage::before {
          content: '';
          position: absolute;
          inset: 7% auto auto 50%;
          height: 68%;
          width: min(780px, 86vw);
          transform: translateX(-50%);
          border: 1px solid rgba(30, 58, 95, 0.08);
          background: linear-gradient(120deg, rgba(255,255,255,0.62), rgba(255,255,255,0.18));
          pointer-events: none;
        }
        .login-enter {
          animation: login-enter 420ms ease-out both;
        }
        @keyframes login-enter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .login-enter {
            animation: none !important;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[8%] top-[16%] hidden h-24 w-px bg-[#1e3a5f]/15 lg:block" />
        <div className="absolute left-[8%] top-[16%] hidden h-px w-36 bg-[#1e3a5f]/15 lg:block" />
        <div className="absolute bottom-[18%] right-[9%] hidden h-28 w-px bg-[#c56a2b]/20 lg:block" />
        <div className="absolute bottom-[18%] right-[9%] hidden h-px w-40 bg-[#c56a2b]/20 lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/55 to-transparent" />
      </div>

      <section className="login-enter relative z-10 w-full max-w-[440px]">
        <div className="mb-6 flex items-center justify-center gap-3 sm:mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#d7dde3] bg-white text-[#1e3a5f] shadow-[0_10px_30px_rgba(30,58,95,0.08)]">
            <Factory className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-[#16283a]">湖南协力鸿胜机械</p>
            <p className="mt-0.5 text-xs font-medium text-[#708090]">产品管理后台</p>
          </div>
        </div>

        <div className="rounded-[8px] border border-white/70 bg-white/88 px-5 py-6 shadow-[0_24px_70px_rgba(24,42,56,0.14)] backdrop-blur-xl sm:px-8 sm:py-8">
          <div className="mb-7 flex items-end justify-between gap-4 border-b border-[#e5eaee] pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c56a2b]">Admin Console</p>
              <h1 className="mt-3 text-[22px] font-semibold leading-tight text-[#172d42]">管理员登录</h1>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#e3e8ed] bg-[#f7f9fa]" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#c56a2b] shadow-[0_0_0_5px_rgba(197,106,43,0.12)]" />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error ? (
              <div role="alert" className="rounded-[6px] border border-[#f0c8c5] bg-[#fff7f6] px-3 py-2.5 text-sm text-[#a93636]">
                {error}
              </div>
            ) : null}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#32485c]">
                邮箱
              </label>
              <div className="flex h-12 items-center rounded-[6px] border border-[#d6dee6] bg-[#fbfcfd] px-3 transition-colors focus-within:border-[#1e3a5f] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1e3a5f]/10">
                <Mail className="mr-2.5 h-[18px] w-[18px] shrink-0 text-[#7a8a99]" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#172d42] outline-none placeholder:text-[#9aa9b5]"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#32485c]">
                密码
              </label>
              <div className="flex h-12 items-center rounded-[6px] border border-[#d6dee6] bg-[#fbfcfd] px-3 transition-colors focus-within:border-[#1e3a5f] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1e3a5f]/10">
                <LockKeyhole className="mr-2.5 h-[18px] w-[18px] shrink-0 text-[#7a8a99]" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="请输入密码"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#172d42] outline-none placeholder:text-[#9aa9b5]"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-[#71889a] transition-colors hover:bg-[#eef3f6] hover:text-[#1e3a5f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f]"
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
              className="flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[#1e3a5f] px-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(30,58,95,0.18)] transition-colors hover:bg-[#162a45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f] focus-visible:ring-offset-2 disabled:cursor-wait disabled:bg-[#7f8fa1]"
            >
              {loading ? <LoaderCircle className="h-[18px] w-[18px] animate-spin" aria-hidden="true" /> : <LogIn className="h-[18px] w-[18px]" aria-hidden="true" />}
              {loading ? '正在验证' : '登录后台'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-[#748696]">
          &copy; {new Date().getFullYear()} 湖南协力鸿胜机械有限公司
        </p>
      </section>
    </main>
  );
}
