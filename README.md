# 🚀 Invite-Redux

<p align="center">
  <img src="./assets/invite-redux-github.png" alt="Login Screen Preview"/>
</p>

**Invite-Redux** is the evolution of the original **Invite** project, built to deepen understanding of full-stack web development. It offers user authentication, a global chat, multilingual support, and deploy-ready structure using modern technologies and international standards.

---

## 📸 Screenshots of Routes

### 1. **Login Page**

![Login Page](./assets/invite-redux-github.png)

**Description:**  
This is the login screen where users can enter their credentials to access their account. The page includes fields for login and password, along with a button to submit the form. If the login is successful, users are redirected to the dashboard.

---

### 2. **Registration Page**

![Registration Page](./assets/registration-page.png)

**Description:**  
On this page, new users can register by filling out their username, login, and password. After submission, they are redirected to the login page. Data is temporarily stored in a JSON file.

---

### 3. **Home Page (Global Chat)**

![Home Page](./assets/home-page.png)

**Description:**  
The **Home** page is the central hub for authenticated users. It features a **Global Chat** where users can send and receive messages in real-time. All logged-in users can see the messages shared in the chat. This page also includes the user's profile and any relevant application updates. The chat provides a simple, user-friendly interface for communication between users.

---

## 🚨 Important Note on Data Persistence

Currently, the backend does not support persistent data storage. The data is temporarily stored in a JSON file, and will be lost upon restart of the hosting services (as the backend is hosted on free-tier platforms).  

For future versions, we plan to integrate a persistent database solution, such as PostgreSQL, to ensure data durability and reliability.

---

## 🔗 Quick Links

- 🌐 Access the project online: [invite-redux.vercel.app](https://invite-redux.vercel.app)
- 💾 GitHub repository: [github.com/YourUsername/INVITE-REDUX](https://github.com/viniciusfelixmatos/invite-redux)

---

## 🧩 Future Improvements

- [ ] Replace JSON with relational DB (PostgreSQL)  
- [ ] Implement JWT-based authentication  
- [ ] Use WebSockets for real-time chat  
- [ ] Responsive mobile-first redesign  
- [ ] Admin panel for message moderation

---

## 🎯 Objective

Build a functional full-stack web application that allows:

- User registration and authentication  
- Persistent data storage with JSON files  
- A global chat for logged-in users  
- Real-time multilingual switching (PT/EN)  
- Hosting on international platforms for production-ready deployment  

---

## 📲 Features

### 🔐 Authentication
- Secure login form with validation  
- Redirection to dashboard on successful login  
- User feedback on invalid credentials  

### 📝 Account Registration
- Signup form with:
  - Username
  - Login
  - Password
- Data is stored in a structured JSON file  
- Automatic redirect to login after registration  

### 💬 Global Chat
- Only accessible to authenticated users  
- All users can send and read messages  
- Simple shared messaging interface  

### 🌍 Multilingual Support
- Full internationalization with `i18next`  
- Toggle between **Portuguese** and **English**  
- Available on every page  

---

## 🌐 Internationalization Strategy

| Feature                     | Description                                   |
|----------------------------|-----------------------------------------------|
| Language Files             | `/src/i18n/en.json`, `/src/i18n/pt.json`      |
| Auto Detection             | Detects browser language preference           |
| Locale Formatting          | Date, time, and messages localized            |
| Add More Languages         | Contribute via PR with new JSON translation   |
| Global Delivery            | Vercel and Render offer CDN-based deployment  |

---

## 🛠️ Technologies Used

| Category   | Stack/Tool       | Description                          |
|------------|------------------|--------------------------------------|
| Frontend   | React + Vite     | Fast SPA with modular architecture   |
| Styling    | HTML, CSS        | Semantics and responsiveness         |
| Logic      | JavaScript (ES6) | Application logic and interactivity  |
| i18n       | i18next          | Internationalization library         |
| Backend    | PHP              | Lightweight server-side scripting    |
| Storage    | JSON             | Simple persistent data solution      |
| Deployment | Vercel + Render  | Global hosting for frontend/backend  |

---

## 🌍 Deployment

| Platform | Purpose      | URL / Status |
|----------|--------------|--------------|
| Vercel   | Frontend     | ✅ Deployed   |
| Render   | Backend API  | ✅ Deployed   |

---

## 📌 Project Status

| Feature               | Status |
|------------------------|--------|
| Registration system    | ✅     |
| Login system           | ✅     |
| JSON database          | ✅     |
| Chat functionality     | ✅     |
| i18n (EN/PT) support   | ✅     |
| Deployed frontend      | ✅     |
| Deployed backend       | ✅     |
| International focus    | 🟢     |

---

## 🧩 Future Improvements

- [ ] Replace JSON with relational DB (PostgreSQL)  
- [ ] Implement JWT-based authentication  
- [ ] Use WebSockets for real-time chat  
- [ ] Responsive mobile-first redesign  
- [ ] Admin panel for message moderation  

---

## 👨‍💻 Developer

**Name:** Vinicius Matos  
**Role:** Frontend Developer  
**Tech Stack:** React, PHP, Vite, JSON  
**Portfolio / GitHub:** [your-link]  
**Contact:** viniciusmatosfelix2022@gmail.com

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
