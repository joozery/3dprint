import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import LineProvider from "next-auth/providers/line";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    // 1. เข้าสู่ระบบด้วย Email & Password (ทัองถิ่น)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user || user.provider !== "credentials") {
          throw new Error("ไม่พบบัญชีผู้ใช้ หรือกรุณาเข้าสู่ระบบด้วยช่องทางเดิมที่คุณเคยสมัครไว้");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password as string);
        if (!isValid) {
          throw new Error("รหัสผ่านไม่ถูกต้อง");
        }

        return { id: user._id.toString(), name: user.name, email: user.email, image: user.image };
      },
    }),
    
    // 2. SSO: Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // 3. SSO: Facebook
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),

    // 4. SSO: LINE
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID || "",
      clientSecret: process.env.LINE_CLIENT_SECRET || "",
    })
  ],

  callbacks: {
    // Callback ตรวจจับตอนมีคนกดเข้าสู่ระบบ
    async signIn({ user, account, profile }) {
      // ถ้าเป็นการ Login ผ่าน SSO (Google, FB, LINE) ให้ออโต้ Register ลง MongoDB
      if (account?.provider !== "credentials") {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          const newUser = await User.create({
             name: user.name || profile?.name || "SSO User",
             email: user.email,
             image: user.image,
             provider: account?.provider,
          });
          user.id = newUser._id.toString(); 
        } else {
          // มีในระบบแล้ว อัปเดตรูปภาพ
          existingUser.image = user.image;
          await existingUser.save();
          user.id = existingUser._id.toString();
        }
      }
      return true;
    },
    // ฝังข้อมูลลงตั๋ว Token ที่ระบบรับรอง
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    // โยน Token มาให้ Frontend ถอดรหัสอ่านข้อมูลได้
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // เลี้ยวเปลี่ยนหน้าไปยังหน้า Login UI ที่เพิ่งทำ
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-development-only-ds8f3dsf",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
