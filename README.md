# Memora Platform 🧠

A full-featured healthcare web application designed to raise awareness about Alzheimer’s disease and simplify appointment booking between patients and doctors, with dedicated dashboards for Doctors and Admins.

---

## 🌐 Project Overview

The project starts with a **Landing Page** that provides:
- A brief introduction about **Alzheimer’s disease**
- A list of specialized doctors displayed as **cards**

Each doctor card includes:
- Doctor image
- Name
- Specialization
- Rating

All data is dynamically fetched from **Supabase**.

---

## 📅 Appointment Booking

- Users can book appointments with any doctor.
- Appointment times **cannot be duplicated**.
- If a selected time is already booked, a **professional dialog** appears informing the user:
  > “This appointment is already booked. Please choose another time.”

---

## 👨‍⚕️ Doctor Dashboard

After logging in as a doctor, the dashboard includes:

- **Total Appointments**
- **Today’s Appointments**
- **Schedule Overview**

### Additional Pages:
#### Patients Page
Displays a list of patients associated with the doctor, including:
- Patient photo
- Address
- Contact phone number

#### Settings Page
- Update personal information
- Change password

---

## 👩‍💼 Admin Dashboard

The Admin has full control over the system:

### Features:
- Manage all appointments  
  - Cancel appointments
  - Delete appointments
- View total numbers:
  - Doctors
  - Appointments
- Manage doctors:
  - View each doctor and their appointments
  - Delete doctors
  - Create new doctors

### Doctor Creation Flow:
1. Admin enters:
   - Email
   - Phone number
   - Specialization
   - Other required details
2. Doctor account is created
3. An **invitation email** is sent to the doctor containing:
   - Email
   - Password
   - Website link

---

## 🛠️ Tech Stack

### Frontend
- **React.js**
- **Tailwind CSS**
- **Context API**
- **useCallback**

### Backend
- **Node.js**
- **Express.js**

### Database & Auth
- **Supabase**

---

## ✨ Key Features

- Role-based dashboards (Admin / Doctor / Patient)
- Real-time appointment validation
- Secure authentication
- Clean and responsive UI
- Scalable architecture

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run frontend
npm run dev

# Run backend
npm start
