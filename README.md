# 🏋️‍♂️ GymPulse — Complete Gym Management PWA

A modern, offline-ready Progressive Web App (PWA) designed for gym members, trainers, and staff. Features an interactive 3D-styled human body anatomy map, custom exercise creation, 7-day weekly routine planner, live workout player timer, diet plans, QR attendance, and member administration.

---

## 🚀 Quick Start Commands

To run GymPulse locally:

```bash
# 1. Navigate to the project directory
cd D:\Projects\gym

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the development server (with network access for mobile phones)
npm run dev -- --host
```

Once started, open in your browser:
- **On PC / Laptop**: [http://localhost:5173](http://localhost:5173)
- **On your Phone (same Wi-Fi)**: Check the terminal output for the Network URL, e.g.:
  `http://192.168.0.xxx:5173`

---

## 📱 How to Open and Install on your Phone

Because this is a **Progressive Web App (PWA)**:
1. Make sure your phone and computer are on the **same Wi-Fi network**.
2. Run `npm run dev -- --host` on your computer.
3. On your phone's browser (Safari on iPhone, Chrome on Android), enter the **Network URL** shown in your terminal (e.g. `http://192.168.0.103:5173`).
4. **Install to Home Screen**:
   - **On iPhone (Safari)**: Tap the **Share button** (square with up arrow) ➔ Scroll down and tap **"Add to Home Screen"**.
   - **On Android (Chrome)**: Tap the **three dots menu** (top right) ➔ Tap **"Add to Home screen"** or **"Install app"**.
   - Or click the **Install** button on the in-app banner!
5. Now it opens like a 100% native mobile app with full-screen experience and zero browser address bars!

---

## 🔑 Test Accounts & Demo Logins

Click the **Quick Login chips** on the login page or enter:

| Role | Email | Password | What You Can Access |
|------|-------|----------|---------------------|
| **Gym Member** | `member@gym.com` | `member123` | Member Dashboard, Interactive Body Anatomy Map, 7-Day Weekly Routine, Live Workout Player, Diet Plans, QR Attendance Scanner |
| **PT Member** | `ptmember@gym.com` | `member123` | Exclusive Personal Trainer Workout & Diet plans, Priority Badges |
| **Staff / Admin** | `staff@gym.com` | `staff123` | Staff Dashboard, Member Management (search, filter, deactivate), Rotating Front-Desk QR Kiosk, Announcements |
| **Trainer** | `trainer@gym.com` | `trainer123` | Trainer Anatomy Program Builder, Custom Exercise Creator, Member Routine Assignment |

---

## 🛠️ Other Available Commands

```bash
# Build for production (compiles PWA service worker & bundles)
npm run build

# Preview production build locally
npm run preview
```
