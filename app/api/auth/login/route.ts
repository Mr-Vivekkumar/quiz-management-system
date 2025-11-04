import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { verifyPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    const user = await User.findOne({ username }).select("+passwordHash")

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "Account is inactive" }, { status: 403 })
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

    // Return user info (no sensitive data)
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
