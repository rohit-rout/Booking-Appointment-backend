# 🩺 Booking Appointment Backend

This is the backend service for the Booking Appointment application, developed using **Node.js**, **Express**, and **FireStore**. It provides RESTful APIs for managing appointments and slots, and is designed to work seamlessly with the [Booking Appointment Frontend](https://github.com/rohit-rout/booking-appointment-frontend).

---

## 🚀 Features

- **User Management**: Registration, login, and authentication using JWT.
- **Appointment Scheduling**: Create, view, and manage appointments.
- **Slot Management**: Define and retrieve available time slots.
- **Timezone Support**: Handle appointments across different timezones using `luxon`.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Date Handling**: Luxon
- **Environment Variables**: dotenv

---

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/rohit-rout/Booking-Appointment-backend.git
   cd Booking-Appointment-backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the server**:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`.

---

## 📁 Folder Structure

```text
Booking-Appointment-backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── utils/
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

## 📋 API Endpoints

### Auth Routes

- `POST /api/auth/register` – Register a new user.
- `POST /api/auth/login` – Authenticate user and return JWT.

### Appointment Routes

- `GET /api/appointments` – Get all appointments for the authenticated user.
- `POST /api/appointments` – Create a new appointment.
- `DELETE /api/appointments/:id` – Delete an appointment.

### Slot Routes

- `GET /api/slots` – Retrieve available slots.
- `POST /api/slots` – Define new available slots.

_Note: All routes under `/api/appointments` and `/api/slots` are protected and require a valid JWT._

---

## 🧪 Testing

To run tests (if implemented):

```bash
npm test
```

_Ensure that your test environment is properly configured._

---

## 🔒 Environment Variables

The application uses the following environment variables:

- `PORT`: The port number on which the server runs.

_These should be defined in a `.env` file in the root directory._

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
