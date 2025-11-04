# Quiz Management System

A full-stack quiz management system built with Next.js, MongoDB, and TypeScript. Features an admin dashboard for quiz creation and a public interface for users to take quizzes and view results.

## Features

### Admin Dashboard
- Create, edit, and delete quizzes
- Add multiple choice questions with explanations
- Publish/unpublish quizzes
- View detailed results and user statistics
- Secure login authentication

### Public Quiz Interface
- Browse available published quizzes
- Take quizzes with intuitive UI
- Progress tracking with visual indicators
- Immediate score display after submission
- User information collection for results tracking

### Results & Analytics
- Comprehensive results page showing all quiz submissions
- Score breakdown and percentages
- Automatic scoring with correct answer validation
- User performance tracking by email and name

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Custom JWT-based admin auth

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database (local or Atlas)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd quiz-management-system
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment variables:
\`\`\`bash
MONGODB_URI=your_mongodb_connection_string
\`\`\`

4. Create admin user:
\`\`\`bash
npx ts-node scripts/create-admin-user.ts
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Visit \`http://localhost:3000\` to access the application.

## Usage

### Admin Access
1. Navigate to \`/admin/login\`
2. Use credentials:
   - Username: \`admin\`
   - Password: \`admin123\`
3. Create and manage quizzes from the dashboard

### Public Access
1. Visit \`/quiz\` to see all published quizzes
2. Select a quiz to take
3. Enter your name and email
4. Answer all questions
5. Submit to see your score

## Project Structure

\`\`\`
├── app/
│   ├── admin/              # Admin dashboard routes
│   │   ├── login/         # Admin login page
│   │   ├── quizzes/       # Quiz management
│   │   └── results/       # Results analytics
│   ├── quiz/              # Public quiz routes
│   ├── api/               # Next.js API routes
│   │   ├── admin/         # Admin API endpoints
│   │   ├── quizzes/       # Public quiz API
│   │   └── auth/          # Authentication endpoints
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── admin-nav.tsx      # Admin navigation
│   └── quiz-nav.tsx       # Quiz navigation
├── lib/
│   ├── models/            # Mongoose schemas
│   ├── db.ts              # Database connection
│   └── auth.ts            # Auth utilities
├── scripts/
│   └── create-admin-user.ts  # Admin user setup
└── public/                # Static assets
\`\`\`

## API Endpoints

### Authentication
- \`POST /api/auth/login\` - Admin login
- \`POST /api/auth/logout\` - Admin logout

### Public Quiz API
- \`GET /api/quizzes\` - Get all published quizzes
- \`GET /api/quizzes/[id]\` - Get specific quiz
- \`POST /api/quizzes/submit\` - Submit quiz answers

### Admin Quiz API
- \`GET /api/admin/quizzes\` - Get all quizzes (admin only)
- \`POST /api/admin/quizzes\` - Create new quiz
- \`GET /api/admin/quizzes/[id]\` - Get quiz details
- \`PATCH /api/admin/quizzes/[id]\` - Update quiz
- \`DELETE /api/admin/quizzes/[id]\` - Delete quiz
- \`PATCH /api/admin/quizzes/[id]/publish\` - Publish/unpublish quiz

### Results API
- \`GET /api/admin/results\` - Get all quiz results

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" and import your GitHub repository
4. Add environment variables:
   - \`MONGODB_URI\` - Your MongoDB connection string
5. Click "Deploy"

### Environment Variables

Required for production:
- \`MONGODB_URI\` - MongoDB connection string

## Development

### Create a new quiz programmatically
\`\`\`typescript
const response = await fetch('/api/admin/quizzes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Quiz',
    description: 'Quiz description',
    questions: [
      {
        id: '1',
        question: 'What is 2+2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        explanation: 'Basic arithmetic'
      }
    ]
  })
})
\`\`\`

## Default Credentials

**Demo Admin Account:**
- Username: \`admin\`
- Password: \`admin123\`

⚠️ Change these credentials in production!

## Future Enhancements

- [ ] Quiz categories and tags
- [ ] Time-limited quizzes
- [ ] Question shuffling options
- [ ] Partial scoring
- [ ] User accounts and progress tracking
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Quiz templates and bulk creation
- [ ] Multi-language support
- [ ] Mobile app

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
