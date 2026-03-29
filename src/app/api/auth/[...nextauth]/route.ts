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
        // ดึง user ใหม่สดๆ จาก DB เพื่อข้าม Cache
        const user = await User.findOne({ email: credentials.email }).select("+password").lean();

        if (!user || user.provider !== "credentials") {
          throw new Error("ไม่พบบัญชีผู้ใช้ หรือกรุณาเข้าสู่ระบบด้วยช่องทางเดิมที่คุณเคยสมัครไว้");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password as string);
        if (!isValid) {
          throw new Error("รหัสผ่านไม่ถูกต้อง");
        }

        if (!user.isVerified) {
          console.error(`Auth Blocked: User ${user.email} exists but isVerified is false in DB`);
          throw new Error("ACCOUNT_NOT_VERIFIED");
        }

        return { id: user._id.toString(), name: user.name, email: user.email, image: user.image, isVerified: user.isVerified };
      },
    }),
    
    // 2. SSO: Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // 3. SSO: Facebook
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),

    // 4. SSO: LINE
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID as string,
      clientSecret: process.env.LINE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid profile email",
          prompt: "consent",
        },
      },
    })
  ],

  callbacks: {
    // Callback ตรวจจับตอนมีคนกดเข้าสู่ระบบ
    async signIn({ user, account, profile }: any) {
      if (account?.provider !== "credentials") {
        await dbConnect();
        
        // 1. ดึงข้อมูลพื้นฐาน (พยายามหาอีเมลจากทุกช่องทาง)
        let email = user.email || profile?.email;
        const name = user.name || profile?.name || profile?.displayName || "SSO User";
        const image = user.image || profile?.pictureUrl || profile?.picture;
        const providerId = account?.provider; // google, facebook, line

        // 2. [แผนสำรอง] ถ้าไม่มีอีเมลจริงๆ (เช่น LINE ยังไม่กดยืนยัน หรือไม่ได้เปิดสิทธิ์)
        // เราจะสร้าง Fake Email จาก Provider ID เพื่อให้ระบบ DB รับรองได้ (MongoDB Schema ของเราบังคับมี Email)
        if (!email) {
          const ssoId = user.id || profile?.sub || account?.providerAccountId;
          email = `${providerId}_${ssoId}@sso.com`;
          console.log(`Fallback: Created fake email for ${providerId} user: ${email}`);
        }

        const existingUser = await User.findOne({ email });
        
        if (!existingUser) {
          const newUser = await User.create({
             name: name,
             email: email,
             image: image,
             provider: providerId,
             isVerified: true,
             verificationStatus: "verified"
          });
          user.id = newUser._id.toString(); 
          (user as any).isVerified = true;
        } else {
          // มีในระบบแล้ว อัปเดตรูปภาพ (ถ้ามีรูปใหม่มา)
          if (image) {
            existingUser.image = image;
            await existingUser.save();
          }
          user.id = existingUser._id.toString();
          (user as any).isVerified = existingUser.isVerified;
        }
      }
      return true;
    },
    // ฝังข้อมูลลงตั๋ว Token ที่ระบบรับรอง
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.provider = account?.provider;
        token.isVerified = (user as any).isVerified;
      }
      return token;
    },
    // โยน Token มาให้ Frontend ถอดรหัสอ่านข้อมูลได้
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
        session.user.isVerified = token.isVerified as boolean;
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
