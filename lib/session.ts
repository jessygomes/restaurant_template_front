"use server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function createSession(userId: string) {
  const secret = process.env.JWT_SECRET!;

  const token = jwt.sign({ userId }, secret, { expiresIn: "1d" });

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  cookieStore.set("userId", userId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  console.log("✅ Nouveau JWT session token (jsonwebtoken) :", token);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("userId");
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get("session")?.value;
}
