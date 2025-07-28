💰 Finance Tracker
Contribution 
Puran Paodensakul 
Gulizara Benjapalaporn

A responsive web app for tracking personal expenses with visual analytics and a simple journaling interface.

🚀 Features
Analytics Dashboard: Line & pie charts, daily/weekly/monthly views, total & monthly spend

Journal: Log expenses by date, category, and amount (THB)

Custom Categories: Add your own with icons

Local Storage: Data saved across sessions

Responsive Design: Mobile and desktop friendly

🛠 Tech Stack
React 18 + TypeScript

React Router, Recharts

React-use (localStorage)

Vite (build tool)

📦 Setup
bash
Copy
Edit
git clone <your-repo-url>
cd v-shop
npm install
npm run dev
Visit: http://localhost:5173

📊 Data Models
ts
Copy
Edit
type Entry = { id: number; name: string; icon: string; amount: number; date: string };
type Category = { id: number; name: string; icon: string };
🚀 Deployment
Vercel (recommended): vercel



GitHub Pages: Use gh-pages with dist

# Team members
### Puran Paodensakul
### Gulizara Benjapalaporn

