#!/usr/bin/env ts-node
import { connectDB } from "../lib/db"
import { User } from "../lib/models/user"
import { hashPassword } from "../lib/auth"

async function createAdminUser() {
  try {
    await connectDB()

    // Check if admin user already exists
    const existingUser = await User.findOne({ username: "admin" })
    if (existingUser) {
      console.log("Admin user already exists")
      return
    }

    // Create new admin user
    const adminUser = new User({
      username: "admin",
      email: "admin@quizmaster.com",
      passwordHash: hashPassword("admin123"),
      role: "admin",
      isActive: true,
    })

    await adminUser.save()
    console.log("Admin user created successfully")
    console.log("Username: admin")
    console.log("Password: admin123")
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    process.exit(0)
  }
}

createAdminUser()
