# RizeUp

RizeUp is a full-stack financial management application that helps users track expenses, manage budgets, earn cashback insights, and receive AI-powered financial advice. Built with a modern React + Vite frontend and an Express.js backend, it offers a seamless and secure user experience.

---

## Features

- **User Authentication** – Secure signup/login with JWT tokens.
- **Dashboard** – Overview of balance, savings goals, and recent transactions.
- **Transaction Management** – Add, edit, and categorize income/expenses.
- **Budget Planning** – Set monthly budgets and track progress.
- **Cashback Insights** – Get personalized cashback recommendations based on spending.
- **AI Financial Assistant** – Locally hosted AI provides budgeting tips and answers financial questions.
- **Responsive Design** – Mobile-friendly UI with Tailwind CSS.

---

## Tech Stack

### Frontend
- [React](https://reactjs.org/) (Vite)
- [React Router DOM](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/) for API calls
- JWT authentication

### Backend
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with Mongoose ODM
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for password hashing
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for authentication
- Locally hosted AI model (via custom route)

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the repositories
```bash
# Backend
git clone https://github.com/kaylaknight385/fin-backend.git
cd fin-backend

# Frontend (in a separate terminal)
git clone https://github.com/kaylaknight385/fin-frontend.git
cd fin-frontend
```

### 2. Backend Setup
```bash
cd fin-backend
npm install
```

Create a `.env` file in the root of `fin-backend`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Start the backend server:
```bash
npm start
# or with nodemon: npm run dev
```
You should see: `Server running on port 5000` and `Connected to MongoDB`.

### 3. Frontend Setup
```bash
cd fin-frontend
npm install
```

Create a `.env` file in the root of `fin-frontend`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## Environment Variables

### Backend (.env)
| Variable    | Description                          |
|-------------|--------------------------------------|
| `PORT`      | Port for backend server (default 5000) |
| `MONGO_URI` | MongoDB connection string            |
| `JWT_SECRET`| Secret key for signing JWT tokens    |

### Frontend (.env)
| Variable        | Description                          |
|-----------------|--------------------------------------|
| `VITE_API_URL`  | Base URL for backend API (e.g., `http://localhost:5000/api`) |

---

## Usage

1. Register a new account or log in with existing credentials.
2. Navigate to the dashboard to view your financial summary.
3. Add transactions and set budgets.
4. Explore cashback insights and chat with the AI assistant for personalized advice.

---

## Project Structure (Highlights)

### Backend
```
fin-backend/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── transactionController.js
│   └── aiController.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Transaction.js
│   └── Budget.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── transactions.js
│   ├── budgets.js
│   ├── cashback.js
│   └── ai.js
├── .env
└── server.js
```

### Frontend
```
fin-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Dashboard.jsx
│   ├── services/
│   │   └── authService.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── index.html
└── package.json
```

---

## API Overview (Selected Endpoints)

| Method | Endpoint                 | Description                | Auth Required |
|--------|--------------------------|----------------------------|---------------|
| POST   | `/api/auth/signup`       | Register new user          | No            |
| POST   | `/api/auth/login`        | Log in user                | No            |
| GET    | `/api/users/:id`         | Get user profile           | Yes           |
| PUT    | `/api/users/:id`         | Update user profile        | Yes           |
| GET    | `/api/transactions`      | Get user transactions      | Yes           |
| POST   | `/api/transactions`      | Add transaction            | Yes           |
| GET    | `/api/budgets`           | Get user budgets           | Yes           |
| POST   | `/api/budgets`           | Create budget              | Yes           |
| GET    | `/api/cashback`          | Get cashback insights      | Yes           |
| POST   | `/api/ai/advice`         | Get AI financial advice    | Yes           |

Full API documentation can be found in the backend repository (or generated via Postman/Swagger).

---

## Local AI Integration

The app includes a locally hosted AI model (via a custom route `/api/ai`) that provides financial guidance. The model runs on the same server, ensuring privacy and low latency. For development, a placeholder response is returned; in production, you can replace it with a more sophisticated model (e.g., TensorFlow.js, Ollama, or a fine-tuned GPT).

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

---

## Contact

Project Link: [https://github.com/kaylaknight385/fin-frontend](https://github.com/kaylaknight385/fin-frontend)  
Backend Repo: [https://github.com/kaylaknight385/fin-backend](https://github.com/kaylaknight385/fin-backend)

## Author

Kayla Knight <3

---

**Happy RizeUp!**
