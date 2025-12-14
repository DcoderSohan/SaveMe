# Password Manager App

A full-stack password manager application with document storage capabilities. Users can securely store passwords, upload documents, view images in a modal, and download files.

## Features

- **User Authentication**: Register and login with secure JWT tokens
- **Password Management**: 
  - Add, edit, and delete passwords
  - Store username, password, website, and notes
  - User-specific password storage
- **Document Management**:
  - Upload any file type (images, PDFs, documents, etc.)
  - View images in a modal preview
  - Download documents
  - Delete documents
  - User-specific document storage

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer with Cloudinary for file uploads
- bcryptjs for password hashing
- Cloudinary for cloud storage

### Frontend
- React 19
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration (Optional - Get these from https://cloudinary.com)
# If not provided, files will be stored locally
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Note**: 
- Set up a MongoDB Atlas account and get your connection string
- Cloudinary is optional - if not configured, files will be stored locally
- Get your Cloudinary credentials from the dashboard at https://cloudinary.com

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Manage Passwords**: 
   - Click "Add Password" to save a new password
   - Click "Edit" to modify an existing password
   - Click "Delete" to remove a password
4. **Manage Documents**:
   - Switch to the "Documents" tab
   - Click "Upload Document" to upload files
   - Click "View" on images to see them in a modal
   - Click "Download" to download any document
   - Click "Delete" to remove a document

## Project Structure

```
SaveMe/
├── backend/
│   ├── models/          # MongoDB models (User, Password, Document)
│   ├── routes/          # API routes (auth, passwords, documents)
│   ├── middleware/      # Authentication middleware
│   ├── uploads/         # Uploaded files (created automatically)
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Auth context
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## Security Notes

- Passwords are hashed using bcryptjs before storage
- JWT tokens are used for authentication
- User data is isolated (users can only access their own passwords and documents)
- File uploads are limited to 50MB per file
- Change the JWT_SECRET in production to a strong, random value

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Passwords
- `GET /api/passwords` - Get all passwords (requires auth)
- `GET /api/passwords/:id` - Get single password (requires auth)
- `POST /api/passwords` - Create password (requires auth)
- `PUT /api/passwords/:id` - Update password (requires auth)
- `DELETE /api/passwords/:id` - Delete password (requires auth)

### Documents
- `GET /api/documents` - Get all documents (requires auth)
- `GET /api/documents/:id` - Get single document (requires auth)
- `POST /api/documents/upload` - Upload document (requires auth)
- `GET /api/documents/:id/download` - Download document (requires auth)
- `DELETE /api/documents/:id` - Delete document (requires auth)

## License

ISC

