# Assignment Solution: Authentication System Design

## 1. Project Overview
An authentication system acts as a digital bouncer. It verifies if a user is who they claim to be, ensuring that only authorized individuals can access specific areas of an application.

**Real-world examples:**
- **Social Media:** Logging into Facebook or Twitter using your email and password.
- **Banking:** Accessing your online bank account securely.
- **E-commerce:** Amazon keeping track of your shopping cart and past orders across multiple devices.

## 2. Features
- **User Registration:** Allows new users to create an account securely.
- **Login:** Allows existing users to authenticate themselves.
- **Logout:** Ends the user's active session.
- **Forgot Password:** Provides a mechanism for users to reset their password if forgotten.
- **Session Handling:** Keeps a user logged in across different pages using JSON Web Tokens (JWT).

## 3. Technologies Used
- **Frontend:** HTML5, Bootstrap 5 (via CDN), JavaScript (Vanilla ES6+).
- **Backend:** Node.js with Express framework.
- **Database:** MySQL (using `mysql2` package, with an in-memory fallback for local POC testing).
- **Security:** `bcryptjs` for password hashing, `jsonwebtoken` for secure API authorization.

## 4. UI Design (Bootstrap Required)
The UI has been built utilizing Bootstrap 5 to ensure a modern, clean, and responsive design.
- **Navigation:** Used `navbar`, `navbar-expand-lg`, `navbar-dark`, and `bg-primary`.
- **Containers & Cards:** Forms are wrapped inside Bootstrap `card` components with `shadow` effects to make them pop out.
- **Forms:** Input fields use `form-control` and `form-label` for consistent styling.
- **Buttons:** Styled with `btn` and `btn-primary`.
- **Alerts:** Dynamic alerts (`alert-success`, `alert-danger`) are used for showing login/registration statuses.

## 5. Database Design
The MySQL database consists of a single `users` table:

```sql
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 6. Backend Code Highlights
- **Registration API (`/api/register`):** Hashes passwords using bcrypt before saving to the database.
- **Login API (`/api/login`):** Compares password hashes and generates a JWT.
- **Logout API (`/api/logout`):** Responds with a success message (client-side handles token deletion).

## 7. Frontend Code
The frontend uses plain HTML with the Bootstrap 5 CDN. JavaScript's `fetch` API is utilized to communicate with the Node.js backend asynchronously. Form default submissions are prevented using `e.preventDefault()`.

## 8. Authentication Flow
**Step-by-Step Flow:**
1. **Registration:** The user enters their name, email, and password. The frontend sends this to `/api/register`. The backend hashes the password and stores the user in MySQL.
2. **Login:** The user enters their credentials. The frontend sends this to `/api/login`. The backend verifies the password against the hash in the database. If correct, the backend generates a signed JSON Web Token (JWT) and sends it back.
3. **Token/Session:** The frontend saves the JWT in `localStorage`. For any protected pages (like `dashboard.html`), the client side checks if the token exists. If not, it redirects back to the login page. When logging out, the token is cleared from `localStorage`.

## 9. Security Implementations
- **Password Hashing:** Passwords are never stored in plain text. `bcrypt` adds a cryptographic salt and hashes the password, making it secure against rainbow table attacks.
- **Input Validation:** Backend ensures no empty fields are submitted.
- **SQL Injection Prevention:** The `mysql2` package utilizes prepared statements (e.g., `SELECT * FROM users WHERE email = ?`) which sanitize inputs automatically, preventing SQL injection.
- **Token-based Authentication:** JWTs are stateless and signed cryptographically.

## 10. Sample Working Code
(The full working code is provided in the repository files: `server.js`, `login.html`, `register.html`, `dashboard.html`, `package.json`.)

### Backend Route Snippet (Login)
```javascript
app.post('/api/login', async (req, res) => {
    // Input validation & DB fetching omitted for brevity...

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    // Generate JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, 'supersecretkey', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, user });
});
```

### Frontend Snippet (Fetch API)
```javascript
const response = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});
const data = await response.json();
if (response.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = 'dashboard.html';
}
```

## 11. Advantages & Improvements
**Advantages:**
- Fast, responsive UI due to Bootstrap.
- Stateless authentication using JWT scales easily.
- Graceful degradation: The backend can fallback to in-memory arrays if the MySQL server is offline.

**Improvements for the Future:**
- Moving secret keys to a `.env` file instead of hardcoding them.
- Adding a real SMTP email service to handle the "Forgot Password" link functionality properly.
- Adding refresh tokens to maintain long-lived sessions securely.

## 12. Conclusion
This project successfully demonstrates a modern, full-stack authentication system. It utilizes robust technologies including Node.js, Express, and MySQL on the backend, paired with a clean, responsive HTML/Bootstrap frontend. The implementation focuses heavily on security best practices such as JWT sessions, prepared SQL statements, and bcrypt hashing.