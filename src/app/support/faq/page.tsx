import { redirect } from "next/navigation";

// หน้า FAQ แยกถูกยุบรวมเข้าหน้า /support (accordion) — redirect กันลิงก์เก่า 404
export default function FAQRedirect() {
  redirect("/support");
}
