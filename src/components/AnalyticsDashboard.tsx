import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLocalStorage } from 'react-use';

type Entry = {
  id: number;
  name: string;
  icon: string;
  amount: number;
  date: string;
};

type Category = {
  id: number;
  name: string;
  icon: string;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1'];

const AnalyticsDashboard: React.FC = () => {
  const [entries] = useLocalStorage<Entry[]>('financeEntries', []);
  const [categories] = useLocalStorage<Category[]>('categories', []);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [chartTimeframe, setChartTimeframe] = useState<'all' | 'month'>('all');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📦');

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
      acc[entry.name] = (acc[entry.name] || 0) + entry.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped).map(([name, amount]) => ({
      name,
      amount
    }));
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: Category = {
      id: Date.now(),
      name: newCategoryName,
      icon: newCategoryIcon
    };
    
    const updatedCategories = [...(categories || []), newCategory];
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    setNewCategoryName('');
    setNewCategoryIcon('📦');
  };

  const lineChartData = prepareLineChartData();
  const pieChartData = preparePieChartData();

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <h1>📊 Analytics Dashboard</h1>
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 30 }}>
        <div style={{ background: '#e8f5e8', padding: 20, borderRadius: 10, textAlign: 'center' }}>
          <h3>🟢 Total Spending (All Time)</h3>
          <h2>THB {totalAllTime.toLocaleString()}</h2>
        </div>
        <div style={{ background: '#fff3cd', padding: 20, borderRadius: 10, textAlign: 'center' }}>
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
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
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
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
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
      <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3>🆕 Add New Category</h3>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Category name"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            style={{ padding: 8, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <select
            value={newCategoryIcon}
            onChange={e => setNewCategoryIcon(e.target.value)}
            style={{ padding: 8, borderRadius: 5, border: '1px solid #ccc' }}
          >
            <option value="📦">📦</option>
            <option value="🍔">🍔</option>
            <option value="🚌">🚌</option>
            <option value="💡">💡</option>
            <option value="🎮">🎮</option>
            <option value="🛍️">🛍️</option>
            <option value="💊">💊</option>
            <option value="📚">📚</option>
            <option value="✈️">✈️</option>
            <option value="🛡️">🛡️</option>
            <option value="💰">💰</option>
            <option value="🏠">🏠</option>
            <option value="🚗">🚗</option>
            <option value="🎬">🎬</option>
            <option value="🏋️">🏋️</option>
          </select>
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