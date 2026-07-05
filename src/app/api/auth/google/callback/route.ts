import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { setAuthCookie } from "@/lib/cookie";
import { createUser, findUserByEmail, findUserByGoogleId } from "@/server/dao/auth.dao";
import { config } from "@/lib/config";
import erroResponse from "@/server/utils/api-response";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=NoCodeProvided", req.url));
    }

    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.GOOGLE_CLIENT_ID,
        client_secret: config.GOOGLE_CLIENT_SECRET,
        redirect_uri: `http://localhost:3000/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || "Failed to fetch access token");
    }

    // 2. Fetch user profile info from Google
    const profileResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`
    );
    const profile = await profileResponse.json();

    await connectToDB();

    // 3. Find or Create User
    let user = await findUserByGoogleId(profile.id);

    if (!user) {
      // Check if user already exists with the same email
      user = await findUserByEmail(profile.email);

      if (user) {
        // Link Google ID to existing account
        user.googleId = profile.id;
        user.role = "google";
        await user.save();
      } else {
        // Create new user (note: your schema requires a password field, so generate a secure random one)
        const randomPassword = crypto.randomBytes(16).toString("hex");
        
        // user = await userModel.create({
        //   name: profile.name,
        //   email: profile.email,
        //   password: randomPassword,
        //   role: "google",
        //   googleId: profile.id,
        // });

        user = await createUser({
         name: profile.name,
          email: profile.email,
          password: randomPassword,
          role: "google",
          googleId: profile.id,
        })
      }
    }

    // 4. Generate token and set auth cookie
    const token = generateToken({ id: user._id.toString() });
    await setAuthCookie(token);

    // 5. Redirect user to dashboard/home page
    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error) {
    return erroResponse(error);
  }
}