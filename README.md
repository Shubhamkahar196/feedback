# True Feedback


A modern, anonymous messaging platform built with Next.js where users can share and receive feedback without revealing their identities. Features AI-powered message suggestions, real-time messaging, and a clean, intuitive interface.

## 🚀 Features

- **Anonymous Messaging**: Send and receive messages without revealing your identity
- **User Dashboard**: Manage your messages, toggle message acceptance, and generate your unique profile link
- **AI-Powered Suggestions**: Get intelligent message suggestions using Google Generative AI
- **Real-time Updates**: Automatic message polling for instant notifications
- **Secure Authentication**: JWT-based authentication with password hashing
- **Responsive Design**: Fully responsive UI built with Tailwind CSS and Radix UI components
- **Type Safety**: Full TypeScript support with Zod validation schemas

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken), bcryptjs for password hashing
- **AI Integration**: Google Generative AI (@ai-sdk/google)
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: Nanostores
- **Notifications**: Sonner for toast notifications

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (version 18 or higher)
- MongoDB Atlas account or local MongoDB instance
- Google Generative AI API key

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shubhamkahar196/feedback.git
   cd feedback
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**

   Navigate to [http://localhost:3000]
   Live link - feedback-five-rho.vercel.app
    to see the application.

## 📖 Usage

### For Message Recipients:

1. **Sign Up**: Create an account with a unique username
2. **Get Your Link**: Copy your unique profile URL from the dashboard
3. **Share Your Link**: Share this link with others to receive anonymous feedback
4. **Manage Messages**: View, delete, and toggle message acceptance in your dashboard

### For Message Senders:

1. **Visit Profile**: Use the recipient's unique profile link
2. **Send Messages**: Write your anonymous message or use AI suggestions
3. **Optional AI Help**: Click "Suggest Messages" to get AI-generated message ideas

## 🏗️ Project Structure

```
├── app/
│   ├── (app)/
│   │   └── dashboard/          # User dashboard page
│   ├── (auth)/
│   │   ├── sign-in/            # Authentication pages
│   │   └── sign-up/
│   ├── api/                    # API routes
│   │   ├── accept-message/     # Toggle message acceptance
│   │   ├── delete-message/     # Delete messages
│   │   ├── get-message/        # Fetch user messages
│   │   ├── send-message/       # Send anonymous messages
│   │   ├── sign-in/            # User authentication
│   │   ├── sign-up/            # User registration
│   │   ├── suggest-message/    # AI message suggestions
│   │   └── u/[username]/       # Check user existence
│   ├── u/[username]/           # Public profile page
│   ├── context/                # React context providers
│   ├── lib/                    # Utility functions and config
│   ├── model/                  # Database models
│   ├── schema/                 # Zod validation schemas
│   └── types/                  # TypeScript type definitions
├── components/
│   ├── ui/                     # Reusable UI components
│   └── MessageCard.tsx         # Message display component
├── lib/
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
```

## 🔐 API Endpoints

### Authentication
- `POST /api/sign-up` - User registration
- `POST /api/sign-in` - User login

### Messages
- `GET /api/get-message` - Fetch user messages
- `POST /api/send-message` - Send anonymous message
- `DELETE /api/delete-message/[messageid]` - Delete specific message
- `GET /api/accept-message` - Check message acceptance status
- `POST /api/accept-message` - Toggle message acceptance

### AI Features
- `POST /api/suggest-message` - Generate message suggestions

### User Management
- `GET /api/u/[username]` - Check if user exists

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables** in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GOOGLE_GENERATIVE_AI_API_KEY`
3. **Deploy**

### Other Platforms

The app can be deployed to any platform that supports Next.js:

```bash
npm run build
npm start
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- AI integration with [Google Generative AI](https://ai.google.dev/)
- Icons from [Lucide React](https://lucide.dev/)

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ by [Shubham Kahar](https://github.com/Shubhamkahar196)**
