"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";
import { DEFAULT_ACCENT } from "@/lib/theme";

function ApexMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="apexg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-brand)" />
          <stop offset="1" stopColor="var(--color-brand-600)" />
        </linearGradient>
      </defs>
      <path d="M24 4 44 42H30L24 28 18 42H4L24 4Z" fill="url(#apexg)" />
      <path d="M24 22 31 36H17L24 22Z" fill="var(--color-card)" opacity="0.9" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}
function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 21 21">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

const SOCIAL = [
  { name: "Google", icon: <GoogleIcon /> },
  { name: "Microsoft", icon: <MicrosoftIcon /> },
  { name: "GitHub", icon: <Icon name="Github" size={18} className="text-ink" /> },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);

  const signIn = (e) => { e.preventDefault(); router.push("/"); };

  const fieldWrap = "flex items-center gap-2.5 h-12 px-3.5 rounded-xl border border-line bg-card focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)] transition-[border-color,box-shadow]";

  return (
    // login always uses the brand primary, not the user's saved accent
    <div className="flex min-h-screen bg-bg" style={{ "--color-brand": DEFAULT_ACCENT }}>
      {/* illustration */}
      <div className="relative hidden lg:block lg:w-[44%] xl:w-[42%] m-3 rounded-[20px] overflow-hidden bg-[#0b1020]">
        <Image src="/assets/ApexRocket.webp" alt="Apex" fill priority className="object-cover" sizes="44vw" />
      </div>

      {/* form */}
      <div className="flex-1 grid place-items-center p-5 sm:p-8">
        <form onSubmit={signIn} className="w-full max-w-[400px] flex flex-col">
          {/* logo */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="flex items-center gap-2.5">
              <ApexMark size={40} />
              <span className="text-[30px] font-bold tracking-[-0.02em] text-heading">Apex</span>
            </div>
            <span className="text-[12.5px] text-ink-3 mt-1.5">by Eclipse Softworks</span>
          </div>

          <h1 className="text-[24px] font-bold text-heading text-center m-0">Welcome back 👋</h1>
          <p className="text-[13.5px] text-ink-2 text-center mt-1.5 mb-7">Sign in to continue to your workspace</p>

          {/* email */}
          <label className="flex flex-col gap-2 mb-4">
            <span className="text-[13px] font-semibold text-ink">Email address</span>
            <span className={fieldWrap}>
              <Icon name="Mail" size={17} className="text-ink-3 flex-none" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-ink-3" autoComplete="email" />
            </span>
          </label>

          {/* password */}
          <label className="flex flex-col gap-2 mb-4">
            <span className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-ink">Password</span>
              <a className="text-[12.5px] font-medium text-brand cursor-pointer hover:text-brand-600">Forgot password?</a>
            </span>
            <span className={fieldWrap}>
              <Icon name="Lock" size={17} className="text-ink-3 flex-none" />
              <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••" className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-ink-3" autoComplete="current-password" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label="Toggle password" className="text-ink-3 hover:text-ink-2 flex-none"><Icon name={show ? "EyeOff" : "Eye"} size={18} /></button>
            </span>
          </label>

          {/* remember */}
          <button type="button" onClick={() => setRemember((r) => !r)} className="flex items-center gap-2.5 mb-5 w-fit">
            <span className={cn("grid place-items-center w-[18px] h-[18px] rounded-[5px] border-[1.5px] transition-colors", remember ? "bg-brand border-brand" : "border-ink-3/50")}>
              <Icon name="Check" size={12} strokeWidth={3} className={cn("text-white", remember ? "opacity-100" : "opacity-0")} />
            </span>
            <span className="text-[13px] text-ink-2">Remember me</span>
          </button>

          {/* submit */}
          <button type="submit" className="h-12 rounded-xl bg-brand hover:bg-brand-600 text-white text-[14px] font-semibold shadow-[0_10px_22px_-10px_color-mix(in_srgb,var(--color-brand)_90%,transparent)] transition-[background,transform] hover:-translate-y-px">Sign in</button>

          {/* divider */}
          <div className="flex items-center gap-3 my-6">
            <span className="flex-1 h-px bg-line" />
            <span className="text-[12.5px] text-ink-3">or continue with</span>
            <span className="flex-1 h-px bg-line" />
          </div>

          {/* social */}
          <div className="grid grid-cols-3 gap-2.5">
            {SOCIAL.map((s) => (
              <button key={s.name} type="button" className="flex items-center justify-center gap-2 h-12 rounded-xl border border-line bg-card text-[13px] font-medium text-ink hover:border-[#C7D2FE] hover:bg-bg-soft transition-colors">
                {s.icon}<span className="hidden sm:inline">{s.name}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-[13px] text-ink-2 mt-7 m-0">
            Don&apos;t have an account? <Link href="/onboarding" className="font-semibold text-brand hover:text-brand-600">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
