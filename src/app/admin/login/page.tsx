'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  LogIn,
  User,
  Lock,
  Cpu,
  Factory,
  Hammer,
  Gauge,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<'account' | 'password' | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (account === 'admin' && password === 'admin123') {
      localStorage.setItem('admin_authenticated', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('账号或密码错误，请重试');
    }
    setLoading(false);
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-[#0A1628] p-4">

      {/* Gradient Orbs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#4A90D9]/12 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-[#28A745]/8 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1E3A5F]/15 blur-[80px]" />

      {/* Floating Industrial Icons */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.12; }
          50% { transform: translateY(-20px) rotate(5deg); opacity: 0.25; }
        }
        @keyframes floatDelay1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.08; }
          33% { transform: translateY(-25px) rotate(-3deg); opacity: 0.2; }
          66% { transform: translateY(-10px) rotate(2deg); opacity: 0.13; }
        }
        @keyframes floatDelay2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-15px) rotate(-8deg); opacity: 0.22; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay-1 { animation: floatDelay1 8s ease-in-out infinite; }
        .animate-float-delay-2 { animation: floatDelay2 7s ease-in-out infinite; }
        .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .stagger-1 { animation-delay: 0.1s; opacity: 0; }
        .stagger-2 { animation-delay: 0.2s; opacity: 0; }
        .stagger-3 { animation-delay: 0.3s; opacity: 0; }
        .stagger-4 { animation-delay: 0.4s; opacity: 0; }
        .stagger-5 { animation-delay: 0.5s; opacity: 0; }
      `}</style>

      <Cpu className="pointer-events-none absolute left-[10%] top-[15%] text-white animate-float-delay-1" size={36} style={{ opacity: 0.08 }} />
      <Hammer className="pointer-events-none absolute right-[12%] top-[20%] text-white animate-float-delay-2" size={28} style={{ opacity: 0.08 }} />
      <Gauge className="pointer-events-none absolute bottom-[18%] left-[15%] text-white animate-float" size={40} style={{ opacity: 0.06 }} />
      <Factory className="pointer-events-none absolute bottom-[22%] right-[10%] text-white animate-float-delay-1" size={34} style={{ opacity: 0.07 }} />

      {/* Main Card */}
      <div className="animate-fade-in relative z-10 w-full max-w-[440px]">
        {/* Logo & Brand */}
        <div className="mb-10 animate-slide-up stagger-1 flex flex-col items-center">
          <div className="mb-5 flex h-[88px] w-[88px] items-center justify-center">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#162A45] shadow-2xl ring-2 ring-[#4A90D9]/30" style={{ boxShadow: '0 0 30px rgba(74,144,217,0.2), 0 0 60px rgba(74,144,217,0.08)' }}>
              <svg className="h-9 w-9" viewBox="0 0 48 48" fill="none">
                <rect x="6" y="10" width="10" height="28" rx="2" fill="#4A90D9" />
                <rect x="19" y="4" width="10" height="40" rx="2" fill="#28A745" />
                <rect x="32" y="16" width="10" height="16" rx="2" fill="#FF6B35" />
                <rect x="6" y="10" width="10" height="28" rx="2" fill="#4A90D9" opacity="0.3" />
              </svg>
            </div>
          </div>
          <h1 className="bg-gradient-to-r from-[#E8F0FE] via-white to-[#B8D4F0] bg-clip-text text-[26px] font-bold tracking-wide text-transparent">
            湖南协力鸿胜机械
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#4A90D9]/40" />
            <span className="text-[13px] tracking-[0.2em] text-[#7B9EC4]">后台管理系统</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#4A90D9]/40" />
          </div>
        </div>

        {/* Login Form Card */}
        <div className="animate-slide-up stagger-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
          <div className="relative px-8 pb-8 pt-6">
            <h2 className="mb-8 text-center text-[15px] font-medium tracking-wide text-[#A0B8D4]">
              管理员登录
            </h2>

            <form onSubmit={handleLogin}>
              {error && (
                <div className="animate-shake mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                  <p className="text-center text-[13px] text-red-400">{error}</p>
                </div>
              )}

              {/* Account Field */}
              <div className="animate-slide-up stagger-3 mb-5">
                <label htmlFor="account" className="mb-2 block text-xs font-medium tracking-wide text-[#7B9EC4]">
                  账号
                </label>
                <div
                  className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${
                    focused === 'account'
                      ? 'border-[#4A90D9] bg-white/[0.06]'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'
                  } ${error ? 'border-red-500/40' : ''}`}
                >
                  <User
                    className={`h-4 w-4 shrink-0 transition-colors duration-300 ${
                      focused === 'account' || account ? 'text-[#4A90D9]' : 'text-[#4B6485]'
                    }`}
                  />
                  <input
                    id="account"
                    type="text"
                    value={account}
                    onFocus={() => setFocused('account')}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="请输入管理员账号"
                    className="w-full border-none bg-transparent text-[14px] text-white placeholder-[#4B6485] outline-none"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="animate-slide-up stagger-4 mb-2">
                <label htmlFor="password" className="mb-2 block text-xs font-medium tracking-wide text-[#7B9EC4]">
                  密码
                </label>
                <div
                  className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${
                    focused === 'password'
                      ? 'border-[#4A90D9] bg-white/[0.06]'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'
                  } ${error ? 'border-red-500/40' : ''}`}
                >
                  <Lock
                    className={`h-4 w-4 shrink-0 transition-colors duration-300 ${
                      focused === 'password' || password ? 'text-[#4A90D9]' : 'text-[#4B6485]'
                    }`}
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full border-none bg-transparent text-[14px] text-white placeholder-[#4B6485] outline-none"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 text-[#4B6485] transition-colors hover:text-[#7B9EC4]"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="animate-slide-up stagger-5 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-xl py-3.5 text-[15px] font-semibold tracking-wide text-white transition-all duration-300 disabled:pointer-events-none"
                >
                  {/* Button background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F] via-[#2A5A8A] to-[#1E3A5F] bg-[length:200%_100%] transition-all duration-500 group-hover:bg-right" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A90D9]/0 via-[#4A90D9]/20 to-[#4A90D9]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />

                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        登录中...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-[18px] w-[18px]" />
                        登 录
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>

            {/* Demo Account Hint */}
            <div className="mt-6 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-center backdrop-blur-sm">
              <p className="text-xs tracking-wide text-[#4B6485]">
                演示账号 <span className="mx-1 rounded bg-white/[0.05] px-2 py-0.5 font-mono text-[#4A90D9]">admin</span>
                <span className="mx-2 text-white/10">|</span>
                密码 <span className="mx-1 rounded bg-white/[0.05] px-2 py-0.5 font-mono text-[#4A90D9]">admin123</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 animate-fade-in text-center text-xs tracking-wide text-[#3A506B]" style={{ animationDelay: '0.8s', opacity: 0 }}>
          &copy; {new Date().getFullYear()} 湖南协力鸿胜机械有限公司 版权所有
        </p>
      </div>
    </div>
  );
}
