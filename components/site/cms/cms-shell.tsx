import type { ReactNode } from "react";

export function CmsShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#31417d_0%,#1a2043_44%,#0d132b_100%)] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[860px]">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
          <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#f8fbff_0%,#eef2ff_100%)] px-6 py-8 sm:px-8">
            <span className="inline-flex rounded-full bg-[#e63a39]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-[#e63a39]">
              CMS Rycrep
            </span>
            <h1 className="mt-4 text-[2.2rem] font-black tracking-[-0.05em] text-[#111827] sm:text-[2.6rem]">
              {title}
            </h1>
            <p className="mt-3 max-w-3xl text-[1rem] leading-7 text-slate-500">
              {description}
            </p>
          </div>
          <div className="px-6 py-6 sm:px-8 sm:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
