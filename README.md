# 💰 Finance Tracker

A modern, responsive web application for tracking personal expenses with beautiful analytics and intuitive journaling features.

## 🚀 Features

### 📊 Analytics Dashboard
- **🟢 Total spending (all time)** - View your complete spending history
- **🟡 Total spending of selected month** - Focus on monthly budgets
- **🔵 Line Chart** - Visualize spending trends over time (Daily/Weekly/Monthly)
- **🟣 Pie Chart** - See spending distribution by category
- **🔘 Multiple view modes** - Daily, Weekly, or Monthly analysis
- **🆕 Custom categories** - Add your own spending categories

### 🧾 Journal Page
- **📆 Date input** - Simple date picker for expense tracking
- **🏷️ Category selection** - Choose from predefined or custom categories
- **💸 Amount entry** - Track expenses in THB (Thai Baht)
- **📝 Local storage** - Data persists between sessions
- **🗑️ Delete entries** - Remove unwanted records

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **Recharts** - Beautiful, responsive charts
- **React-use** - Useful React hooks (localStorage)
- **Vite** - Fast build tool and dev server

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd v-shop
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 Usage

### Adding Expenses
1. Navigate to the **Journal** page
2. Select a date
3. Choose a category (or create a new one)
4. Enter the amount
5. Click "Add Entry"

### Viewing Analytics
1. Go to the **Analytics Dashboard**
2. Use the filters to view different time periods
3. Switch between Daily/Weekly/Monthly views
4. Toggle between "All Time" and "Selected Month" for charts

### Adding Custom Categories
1. On the Analytics Dashboard, scroll to the bottom
2. Enter a category name
3. Select an emoji icon
4. Click "Add Category"

## 📱 Screenshots

### Analytics Dashboard
![Analytics Dashboard](screenshots/analytics.png)

### Journal Page
![Journal Page](screenshots/journal.png)

## 🎨 Design Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Clean, intuitive interface with smooth animations
- **Color-coded Categories** - Easy visual identification
- **Interactive Charts** - Hover for detailed information
- **Gradient Backgrounds** - Beautiful visual appeal

## 🔧 Customization

### Adding New Icons
Edit the icon options in `src/components/AnalyticsDashboard.tsx` and `src/components/Journal.tsx`

### Modifying Categories
Update `src/accessory.json` to change default categories

### Styling
Modify `src/App.css` for custom styling

## 📊 Data Structure

### Entry Object
```typescript
type Entry = {
  id: number;
  name: string;
  icon: string;
  amount: number;
  date: string;
};
```

### Category Object
```typescript
type Category = {
  id: number;
  name: string;
  icon: string;
};
```

## 🚀 Deployment

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Netlify
1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify

### GitHub Pages
1. Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/your-repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Deploy: `npm run deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons from [Emoji](https://emojipedia.org/)
- Charts powered by [Recharts](https://recharts.org/)
- Built with [Vite](https://vitejs.dev/)

---

**Made with ❤️ for better financial management**
