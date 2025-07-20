# Paragraph 📝✨

Welcome to **Paragraph**, a vibrant Persian blogging platform built to empower users to share their stories, engage with communities, and discover inspiring content! 🚀 Whether you're a writer, reader, or admin, Paragraph offers a seamless and modern experience with a robust API-driven backend. 

**🌐 Live Demo**: [https://virgool-nine.vercel.app/](https://virgool-nine.vercel.app/)

## 🎉 Features

Paragraph is packed with features to make blogging fun and interactive:

### 🔐 User Authentication & Management
- **Multi-format Login**: Register and login with email, username, or phone
- **JWT Security**: Secure authentication with JSON Web Tokens
- **Role-based Access**: User and admin roles with different permissions
- **Follow System**: Follow users and topics to personalize your feed
- **Profile Management**: Complete profile customization with avatars and social links

### ✍️ Content Creation & Management
- **Rich Text Editor**: Create beautiful posts with ReactQuill editor
- **Media Support**: Upload cover images and podcast files
- **Topic Organization**: Categorize posts with multiple topics
- **Tag System**: Add custom tags for better discoverability
- **Draft & Publish**: Save drafts and publish when ready
- **Reading Time**: Automatic reading time estimation

### 💬 Interactive Features
- **Comments System**: Nested comments with admin approval
- **Like System**: Like posts and track engagement
- **Bookmarks & Lists**: Save posts to custom lists (public/private)
- **Real-time Notifications**: Get notified about new followers, likes, and comments
- **Stories Section**: Instagram-like stories for trending topics

### 🎨 Modern Frontend Experience
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Infinite Scroll**: Seamless content loading
- **Search Functionality**: Search posts, users, and topics
- **Persian RTL Support**: Full right-to-left language support

### 🛠️ Admin Dashboard
- **User Management**: Ban/unban users, change roles, view statistics
- **Content Moderation**: Approve/reject comments, publish posts
- **Topic Management**: Create and organize topics and categories
- **Analytics**: View engagement metrics and user activity
- **System Monitoring**: Track platform health and performance

### 📱 Mobile-First Design
- **Progressive Web App**: App-like experience on mobile devices
- **Touch-friendly**: Optimized for touch interactions
- **Offline Support**: Basic functionality works offline
- **Fast Loading**: Optimized performance with lazy loading

## 🚀 Tech Stack

### Frontend
- **React 18**: Modern React with hooks and context
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **React Quill**: Rich text editor for content creation
- **Chart.js**: Data visualization for analytics
- **Axios**: HTTP client for API communication
- **React Toastify**: Elegant notifications
- **SweetAlert2**: Beautiful alert dialogs

### Backend
- **Node.js & Express**: Robust server-side framework
- **MongoDB & Mongoose**: NoSQL database with ODM
- **JWT Authentication**: Secure token-based auth
- **Multer**: File upload handling
- **Bcrypt**: Password hashing
- **Nodemailer**: Email notifications
- **Swagger**: API documentation

### DevOps & Deployment
- **Vercel**: Frontend deployment and hosting
- **Render**: Backend API hosting
- **MongoDB Atlas**: Cloud database
- **Git**: Version control
- **ESLint**: Code linting and formatting

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher) 🟢
- MongoDB (local or MongoDB Atlas) 🗄️
- Git 🐙

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/paragraph.git
   cd paragraph
   ```

2. **Backend Setup**:
   ```bash
   cd Backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Seed sample data
   npm run seed
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd Frontend
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`
   - API Documentation: `http://localhost:3000/api-docs`

## 🌐 API Endpoints

### Authentication
- `POST /v1/auth/register` - User registration
- `POST /v1/auth/login` - User login
- `GET /v1/auth/me` - Get current user profile

### Posts
- `GET /v1/posts` - Get paginated posts
- `POST /v1/posts` - Create new post
- `GET /v1/posts/:id` - Get specific post
- `PUT /v1/posts/:id` - Update post
- `DELETE /v1/posts/:id` - Delete post

### Comments
- `POST /v1/comments` - Add comment
- `PUT /v1/comments/:id/approve` - Approve comment (admin)
- `DELETE /v1/comments/:id` - Delete comment

### Users
- `GET /v1/auth/` - Get all users (admin)
- `POST /v1/auth/:userId/follow` - Follow user
- `POST /v1/auth/:userId/unfollow` - Unfollow user
- `PUT /v1/auth/:id/ban` - Ban user (admin)

### Topics
- `GET /v1/topics` - Get all topics
- `POST /v1/topics` - Create topic (admin)
- `PUT /v1/topics/:id` - Update topic (admin)

## 🎨 Design Philosophy

Paragraph follows modern design principles:

- **Clean & Minimal**: Focus on content without distractions
- **Persian Typography**: Beautiful Persian fonts (Dana, Morabba)
- **Consistent Spacing**: 8px grid system throughout
- **Accessible Colors**: High contrast ratios for readability
- **Smooth Animations**: Subtle transitions and micro-interactions
- **Mobile-First**: Designed for mobile, enhanced for desktop

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Bundle Size**: Optimized with code splitting
- **Loading Speed**: < 2s initial load time
- **SEO Optimized**: Meta tags and structured data
- **Accessibility**: WCAG 2.1 AA compliant

## 🔒 Security

- **Input Validation**: Server-side validation with Joi
- **SQL Injection**: Protected with Mongoose ODM
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based protection
- **Rate Limiting**: API rate limiting implemented
- **Secure Headers**: Security headers configured

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables
3. Deploy automatically on push

## 🤝 Contributing

We love contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Persian Community**: For inspiration and feedback
- **Open Source**: Built with amazing open-source tools
- **Contributors**: Thanks to all who helped build this platform

## 📞 Support

- **Email**: support@paragraph.io
- **Documentation**: [API Docs](https://virgool-nine.vercel.app/api-docs)
- **Issues**: [GitHub Issues](https://github.com/your-username/paragraph/issues)

---

**Made with ❤️ for the Persian writing community**

*Paragraph - Where stories come to life* ✨