const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://vrszonnett:vrszonnett@cluster0.azpcg.mongodb.net/quiz-db";

if (!MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  isActive: { type: Boolean, default: true },
});

const User = mongoose.model('User', userSchema);

// Function to hash password
function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingUser = await User.findOne({ username: "admin" });
    if (existingUser) {
      console.log("Admin user already exists");
      return;
    }

    // Create new admin user
    const adminUser = new User({
      username: "admin",
      email: "admin@quizmaster.com",
      passwordHash: hashPassword("admin123"),
      role: "admin",
      isActive: true,
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    console.log("Username: admin");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    mongoose.connection.close();
  }
}

createAdminUser();