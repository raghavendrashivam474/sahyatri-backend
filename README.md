# SAHYatri Backend ⚙️

Backend API for the SAHYatri Tourist Safety Platform.

## 🚀 Features

* JWT Authentication
* Role-based access (Admin/User)
* Real-time alerts (Socket.IO)
* Location tracking API
* SOS alert system

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* Socket.IO
* JWT (Authentication)
  
📁 Folder Structure
sahyatri-backend/
├── models/
├── routes/
├── middleware/
├── config/
├── .gitignore
├── README.md
├── .env.example
├── server.js
├── package.json


## 📦 Setup

```bash
npm install
npm run dev
```

## 🔐 Environment Variables

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

## 📡 API Endpoints

* POST `/api/auth/login`
* POST `/api/auth/register`
* POST `/api/location`
* GET `/api/location/all`
* POST `/api/alert`
* GET `/api/alert/all`

## 🌐 Deployment

Recommended: Render / Railway

## 📌 Note

Frontend should connect via API URL
