# Frontend Authentication System Design

## Project Overview

An authentication system is a security framework that verifies the identity of users attempting to access a system or application. It ensures that only authorized individuals can gain access, protecting sensitive data and resources.

### Explanation in Simple Words

Imagine a club where only members with a valid membership card can enter. The authentication system acts like the bouncer who checks the card (credentials) to allow entry. It handles signing up new members (registration), checking cards on arrival (login), and helping if someone forgets their card (forgot password).

### Real-World Examples

- **Banking Apps**: Login with username/password, biometric authentication.
- **Email Services**: Gmail login with email and password.
- **Social Media**: Facebook login with email or phone.

## Features

- User Registration
- Login
- Logout
- Forgot Password
- Session Handling (localStorage)

## Technologies Used

- **Frontend**: HTML, Bootstrap, JavaScript (localStorage for data storage)

## UI Design (Bootstrap Required)

All UI uses Bootstrap for modern and clean design.

- **Navbar**: Consistent navigation across pages.
- **Cards**: For form containers.
- **Forms**: Responsive Bootstrap forms.
- **Buttons**: Styled buttons.
- **Alerts**: For success/error messages.

Pages:

- [`register.html`](register.html): Registration form
- [`login.html`](login.html): Login form
- [`dashboard.html`](dashboard.html): User dashboard after login
- [`forgot-password.html`](forgot-password.html): Forgot password form
- [`reset-password.html`](reset-password.html): Reset password form

## Authentication Flow

### Registration Flow

1. User fills registration form.
2. JavaScript validates and stores user data in localStorage.
3. Redirects to login.

### Login Flow

1. User fills login form.
2. JavaScript checks credentials against localStorage.
3. If valid, sets loggedIn flag and redirects to dashboard.

### Session Flow

- Session maintained via localStorage 'loggedIn' flag.
- Logout removes the flag.
- Data persists in browser storage.

## Security

- **Input Validation**: Client-side checks for required fields, password match.
- Note: This is a frontend-only POC; in production, use server-side validation, hashing, and secure storage.

## Sample Working Code

### Registration (register.html snippet)

```javascript
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  if (password !== confirmPassword) {
    showAlert("Passwords do not match", "danger");
    return;
  }
  const user = { name, email, password };
  localStorage.setItem("user", JSON.stringify(user));
  showAlert("Registration successful", "success");
  setTimeout(() => (window.location.href = "login.html"), 2000);
});
```

### Login (login.html snippet)

```javascript
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.email === email && user.password === password) {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    showAlert("Invalid email or password", "danger");
  }
});
```

Full code in respective HTML files.

## Advantages & Improvements

### Advantages

- Simple and lightweight, no server required.
- Demonstrates UI/UX for authentication flows.
- Responsive design with Bootstrap.

### Improvements

- Add real backend with database for persistence and security.
- Implement password hashing and JWT for secure sessions.
- Add email verification for forgot password.
- Use secure storage instead of localStorage.

## Conclusion

This frontend-only authentication POC provides a clean, modern UI for user registration, login, and password recovery flows. It uses localStorage to simulate data storage and session management, making it ideal for demonstrating design and client-side logic without backend complexity.

## Setup Instructions

Open [`register.html`](register.html) in a web browser to start the authentication flow. No server setup required.
