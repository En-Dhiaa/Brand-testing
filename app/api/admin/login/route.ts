import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { AdminLoginInputSchema } from "@/lib/validation/proposal-schema";
import {
  verifyPassword,
  createSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = AdminLoginInputSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "بيانات الدخول غير مكتملة أو غير صالحة" },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!admin) {
      // Generic message to avoid email enumeration
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // Create session token
    const token = await createSessionToken({
      adminId: admin.id,
      email: admin.email,
    });

    // Record audit log
    await prisma.adminAction.create({
      data: {
        adminEmail: admin.email,
        action: "ADMIN_LOGIN",
        details: "تسجيل دخول ناجح إلى لوحة التحكم",
      },
    });

    const res = NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      admin: {
        name: admin.name,
        email: admin.email,
      },
    });

    // Set secure HTTP-Only cookie
    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 3600, // 24 hours
    });

    return res;
  } catch (error) {
    console.error("[POST /api/admin/login] Error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة تسجيل الدخول" },
      { status: 500 }
    );
  }
}
