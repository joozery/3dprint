import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  let maintenance = false;
  try {
    // บังคับ http: เสมอ — sub-request นี้ถูกส่งเข้า Next.js server ในเครื่อง
    // ซึ่งไม่มี TLS (nginx เป็นคนจัดการ SSL) ถ้าปล่อยเป็น https จะ fetch ไม่สำเร็จ
    const apiUrl = new URL("/api/public/maintenance", req.url);
    apiUrl.protocol = "http:";
    const res = await fetch(apiUrl, {
      cache: "no-store",
    });
    const data = await res.json();
    maintenance = !!data?.maintenance;
  } catch {
    // ถ้าเช็คสถานะไม่ได้ ให้เปิดเว็บตามปกติ
    maintenance = false;
  }

  if (maintenance && pathname !== "/under-construction") {
    return NextResponse.rewrite(new URL("/under-construction", req.url));
  }

  if (!maintenance && pathname === "/under-construction") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // ครอบทุกหน้า ยกเว้น /admin, /api, ไฟล์ static และ asset ต่าง ๆ
  matcher: ["/((?!api|admin|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
