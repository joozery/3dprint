"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function ProfileFooter() {
  const { t } = useLanguage();
  const p = t.profile;

  return (
    <div className="mt-16 pt-8 border-t border-slate-200/60 pb-4 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center text-[13px] text-slate-400 font-medium">
      <div>© 2026 PrintMyDesign by Septillion Co., Ltd. {p.allRightsReserved}</div>
      <div className="flex flex-wrap justify-center sm:justify-end gap-x-5 gap-y-2 mt-3 sm:mt-0 font-bold">
        <Link href="/privacy" className="hover:text-blue-600 transition-colors">{p.privacyPolicy}</Link>
        <Link href="/terms" className="hover:text-blue-600 transition-colors">{p.termsOfService}</Link>
        <Link href="/cookies" className="hover:text-blue-600 transition-colors">{p.cookiePolicy}</Link>
      </div>
    </div>
  );
}
