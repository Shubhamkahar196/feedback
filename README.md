# True Feedback - Anonymous Feedback Application

True Feedback is a Next.js application that allows users to receive anonymous feedback messages. Users can create an account, generate a unique profile link, and receive messages without revealing their identity.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6)

## 🚀 Features

- **Anonymous Messaging**: Send anonymous messages to any user without revealing your identity
- **User Authentication**: Secure sign-up and sign-in with JWT tokens
- **Unique Profile Links**: Each user gets a unique URL to share (`/u/username`)
- **Message Management**: View, delete, and manage received messages
- **Toggle Messages**: Enable/disable message receiving at any time
- **AI Message Suggestions**: Get AI-powered suggestions for sending messages
- **Responsive Design**: Beautiful UI that works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **UI Components**: Radix UI, shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **AI Integration**: Google AI SDK (@ai-sdk/google)
- **HTTP Client**: Axios

## 📁 Project Structure

```
my-app/
├── app/
│   ├── (app)/              # Protected routes
│   │   └── dashboard/      # User dashboard
│   ├── (auth)/             # Authentication routes
│   │   ├── sign-in/        # Sign in page
│   │   └── sign-up/        # Sign up page
│   ├── api/                # API routes
│   │   ├── accept-message/ # Toggle message acceptance
│   │   ├── delete-message/# Delete messages
│   │   ├── get-message/   # Fetch user messages
│   │   ├── send-message/  # Send anonymous messages
│   │   ├── sign-in/       # User login
│   │   ├── sign-up/       # User registration
│   │   ├── suggest-message/# AI message suggestions
│   │   └── u/[username]/  # User profile data
│   ├── context/            # React context providers
│   ├── lib/                # Utility functions
│   │   ├── auth.ts        # Authentication utilities
│   │   ├── db.ts          # Database connection
│   │   └── proxy.ts       # Proxy utilities
│   ├── model/              # Mongoose models
│   │   └── User.ts        # User model with messages
│   ├── schema/             # Zod validation schemas
│   │   ├── acceptMessageSchema.ts
│   │   ├── messageSchema.ts
│   │   ├── signInSchema.ts
│   │   └── signUpSchema.ts
│   ├── types/              # TypeScript types
│   │   └── ApiResponse.ts
│   └── u/[username]/       # Public user profile page
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── MessageCard.tsx     # Message display component
│   └── Navbar.tsx          # Navigation component
└── lib/                    # Utility functions
    └── utils.ts            # General utilities
```

## ⚙️ Installation

1. **Clone the repository**

```
bash
git clone <repository-url>
cd my-app
```

2. **Install dependencies**

```
bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```
env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Secret (generate a strong random string)
JWT_SECRET=your_jwt_secret_key

# Google AI API Key (for message suggestions)
GOOGLE_API_KEY=your_google_api_key

# NextAuth (optional, for advanced auth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

4. **Run the development server**

```
bash
npm run dev
```

5. **Open in browser**

Navigate to https://feedback-five-rho.vercel.app/

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sign-up` | Register a new user |
| POST | `/api/sign-in` | Authenticate user |
| POST | `/api/send-message` | Send anonymous message |
| GET | `/api/get-message` | Get user's messages |
| DELETE | `/api/delete-message/[messageid]` | Delete a message |
| POST | `/api/accept-message` | Toggle message acceptance |
| GET | `/api/suggest-message` | Get AI message suggestions |
| GET | `/api/u/[username]` | Get user public profile |

## 📝 Usage

### 1. Create an Account
- Navigate to `/sign-up`
- Enter username, email, and password
- Submit to create your account

### 2. Share Your Profile
- After login, go to dashboard
- Copy your unique profile link (`/u/yourusername`)
- Share it with others to receive anonymous messages

### 3. Receive Messages
- Others can send you messages via your profile link
- Messages appear in your dashboard
- Toggle "Accept Messages" on/off as needed

### 4. Manage Messages
- View all received messages in dashboard
- Delete unwanted messages
- Use AI suggestions to craft your own anonymous messages

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Input validation with Zod schemas
- Server-side database operations
- Protected API routes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [MongoDB](https://www.mongodb.com/) - Database
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Google AI](https://ai.google/) - AI Integration
