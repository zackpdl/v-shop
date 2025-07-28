import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLocalStorage } from 'react-use';

type Entry = {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
};

type Category = {
  spending_id: number;
  category: string;
  description: string;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1'];

const AnalyticsDashboard: React.FC = () => {
  const [entries] = useLocalStorage<Entry[]>('financeEntries', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', []);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [chartTimeframe, setChartTimeframe] = useState<'all' | 'month'>('all');
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Calculate totals
  const totalAllTime = (entries || []).reduce((sum, entry) => sum + entry.amount, 0);
  const entriesOfSelectedMonth = (entries || []).filter(entry => entry.date.slice(0, 7) === selectedMonth);
  const totalOfSelectedMonth = entriesOfSelectedMonth.reduce((sum, entry) => sum + entry.amount, 0);

  // Prepare line chart data
  const prepareLineChartData = () => {
    const dataToUse = chartTimeframe === 'all' ? (entries || []) : entriesOfSelectedMonth;
    
    if (viewMode === 'daily') {
      const grouped = dataToUse.reduce((acc, entry) => {
        const date = entry.date;
        acc[date] = (acc[date] || 0) + entry.amount;
        return acc;
      }, {} as Record<string, number>);
      
      return Object.entries(grouped).map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString(),
        amount
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    
    if (viewMode === 'weekly') {
      const grouped = dataToUse.reduce((acc, entry) => {
        const date = new Date(entry.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().slice(0, 10);
        acc[weekKey] = (acc[weekKey] || 0) + entry.amount;
        return acc;
      }, {} as Record<string, number>);
      
      return Object.entries(grouped).map(([week, amount]) => ({
        date: `Week of ${new Date(week).toLocaleDateString()}`,
        amount
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    
    // Monthly view
    const grouped = dataToUse.reduce((acc, entry) => {
      const month = entry.date.slice(0, 7);
      acc[month] = (acc[month] || 0) + entry.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped).map(([month, amount]) => ({
      date: new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      amount
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Prepare pie chart data
  const preparePieChartData = () => {
    const dataToUse = chartTimeframe === 'all' ? (entries || []) : entriesOfSelectedMonth;
    
    const grouped = dataToUse.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + entry.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped).map(([name, amount]) => ({
      name,
      amount
    }));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim() || !newDescription.trim()) return;
    
    const categoryToAdd: Category = {
      spending_id: Date.now(),
      category: newCategory,
      description: newDescription
    };
    
    const updatedCategories = [...(categories || []), categoryToAdd];
     setCategories(updatedCategories);
     setNewCategory('');
     setNewDescription('');
  };

  const lineChartData = prepareLineChartData();
  const pieChartData = preparePieChartData();

  return (
    <div>
      <h1>📊 Analytics Dashboard</h1>
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 30 }}>
        <div className="card" style={{ background: '#e8f5e8', textAlign: 'center' }}>
          <h3>🟢 Total Spending (All Time)</h3>
          <h2>THB {totalAllTime.toLocaleString()}</h2>
        </div>
        <div className="card" style={{ background: '#fff3cd', textAlign: 'center' }}>
          <h3>🟡 Total Spending (Selected Month)</h3>
          <h2>THB {totalOfSelectedMonth.toLocaleString()}</h2>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label>Month: </label>
          <input 
            type="month" 
            value={selectedMonth} 
            onChange={e => setSelectedMonth(e.target.value)}
            style={{ padding: 5, borderRadius: 5, border: '1px solid #ccc' }}
          />
        </div>
        
        <div>
          <label>View Mode: </label>
          <select 
            value={viewMode} 
            onChange={e => setViewMode(e.target.value as 'daily' | 'weekly' | 'monthly')}
            style={{ padding: 5, borderRadius: 5, border: '1px solid #ccc' }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        <div>
          <label>Chart Timeframe: </label>
          <select 
            value={chartTimeframe} 
            onChange={e => setChartTimeframe(e.target.value as 'all' | 'month')}
            style={{ padding: 5, borderRadius: 5, border: '1px solid #ccc' }}
          >
            <option value="all">All Time</option>
            <option value="month">Selected Month</option>
          </select>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 30 }}>
        {/* Line Chart */}
        <div className="card">
          <h3>🔵 Spending Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`THB ${value}`, 'Amount']} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h3>🟣 Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`THB ${value}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add New Category */}
      <div className="card">
        <h3>🆕 Add New Category</h3>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Category name"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            style={{ padding: 8, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Category description"
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
            style={{ padding: 8, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <button 
            onClick={handleAddCategory}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: 5, 
              cursor: 'pointer' 
            }}
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;