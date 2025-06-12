# Campus Job Portal

A comprehensive job portal application that connects colleges with students for internships and job opportunities. College admins can post jobs while students can browse and apply to opportunities from their own college.

## 🚀 Features

### For College Admins
- Register and create new colleges
- Post job opportunities with detailed information
- View all posted jobs from their college
- Manage student applications (accept/reject)
- View detailed application management dashboard

### For Students
- Register and associate with existing colleges
- Browse jobs only from their own college
- Apply to jobs with one-click application
- Track application history and status
- View application status updates


## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless backend functions
- **MySQL** - Relational database
- **mysql2** - MySQL client for Node.js

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **Role-based access control** - Admin/Student permissions


## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm**
- **MySQL** (v8.0 or higher)
- **Git**

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/qaidjoharj53/job-portal.git
cd job-portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Create MySQL Database

```sql
CREATE DATABASE job_portal;
```

#### Run Database Scripts

Execute the SQL scripts in order:

1. **Create Tables:**
   ```bash
   mysql -u your_username -p job_portal < scripts/01-create-tables.sql
   ```

2. **Seed Sample Data:**
   ```bash
   mysql -u your_username -p job_portal < scripts/02-seed-data.sql
   ```

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=job_portal

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Sample Login Credentials

### Admin Accounts
- **Email:** qj@technonjr.org
- **Password:** a
- **College:** Techno India NJR

### Student Accounts
- **Email:** jayesh@gmail.com
- **Password:** a


## 🎯 Approach & Design Decisions

### Architecture
- **Full-Stack Next.js**: Leveraged Next.js API routes for a unified codebase
- **Server-Side Rendering**: Improved performance and SEO
- **Component-Based Architecture**: Modular, reusable React components

### Database Design
- **Normalized Schema**: Proper relationships between colleges, users, jobs, and applications
- **Role-Based Access**: Single users table with role differentiation
- **Data Integrity**: Foreign key constraints and proper indexing

### Authentication Strategy
- **JWT Tokens**: Stateless authentication for scalability
- **Role-Based Access Control**: Separate admin and student workflows
- **Secure Password Storage**: bcrypt hashing with salt rounds

### User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Intuitive Navigation**: Role-based navigation and clear user flows
- **Real-Time Updates**: Immediate feedback for user actions

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **SQL Injection Prevention**: Parameterized queries
- **Role-Based Authorization**: Endpoint-level access control
- **Input Validation**: Client and server-side validation

## 📝 Key Assumptions

1. **College Association**: Students must be associated with a college to view jobs
2. **Single College Jobs**: Students can only view jobs from their own college
3. **Admin College Management**: Each admin manages one college
4. **Application Uniqueness**: Students can only apply once per job
5. **Simple User Profiles**: Basic user information without resume uploads
6. **Email-Based Authentication**: Email serves as the primary identifier

## 🚀 Deployment

### Environment Variables for Production
```env
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_NAME=your-production-db-name
JWT_SECRET=your-super-secure-production-jwt-secret
```

### Recommended Deployment Platforms
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues & Future Enhancements

### Current Limitations
- No file upload functionality for resumes
- Basic email notifications not implemented
- No email verification
- Limited user profile information

### Planned Features
- Resume upload and management
- Email notification system
- Advanced job search and filtering
- Application analytics dashboard
- Bulk application management
- User profile enhancements

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/qaidjoharj53/job-portal/issues) page
2. Create a new issue with detailed information
3. Contact the development team - https://qaidjoharj.me
