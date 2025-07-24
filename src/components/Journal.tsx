import React, { useRef, useState } from 'react';
import { useLocalStorage } from 'react-use';
// @ts-ignore
import categoryData from '../accessory.json';

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

const Journal: React.FC = () => {
  const amountRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);

  const [entries, setEntries] = useLocalStorage<Entry[]>('financeEntries', []);
  const [customCategories] = useLocalStorage<Category[]>('categories', []);
  const [selectedCategory, setSelectedCategory] = useState(categoryData[0]);

  // Combine default categories with custom categories
  const allCategories = [...categoryData, ...(customCategories || [])];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const cat = allCategories.find((c: any) => c.id === selectedId);
    if (cat) setSelectedCategory(cat);
  };

  const handleSubmit = () => {
    const amount = Number(amountRef.current?.value);
    const date = dateRef.current?.value;
    if (!amount || !date || !selectedCategory) return alert('Fill all fields');

    const entry: Entry = {
      id: Date.now(),
      name: selectedCategory.name,
      icon: selectedCategory.icon,
      amount,
      date,
    };

    setEntries([...(entries || []), entry]);
    
    // Clear form
    if (amountRef.current) amountRef.current.value = '';
    if (dateRef.current) dateRef.current.value = '';
  };

  const handleDeleteEntry = (id: number) => {
    setEntries((entries || []).filter(entry => entry.id !== id));
  };

  const total = (entries || []).reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1>🧾 Spending Journal</h1>

      {/* Input Form */}
      <div style={{ 
        background: 'white', 
        padding: 20, 
        borderRadius: 10, 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: 30 
      }}>
        <h3>📝 Add New Entry</h3>
        
        <div style={{ display: 'grid', gap: 15 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
              📆 Date:
            </label>
            <input 
              type="date" 
              ref={dateRef}
              style={{ 
                width: '100%', 
                padding: 10, 
                borderRadius: 5, 
                border: '1px solid #ccc',
                fontSize: 16
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
              🏷️ Category:
            </label>
            <select 
              ref={categoryRef} 
              onChange={handleCategoryChange}
              style={{ 
                width: '100%', 
                padding: 10, 
                borderRadius: 5, 
                border: '1px solid #ccc',
                fontSize: 16
              }}
            >
              {allCategories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
              💸 Amount (THB):
            </label>
            <input 
              type="number" 
              ref={amountRef}
              placeholder="Enter amount"
              style={{ 
                width: '100%', 
                padding: 10, 
                borderRadius: 5, 
                border: '1px solid #ccc',
                fontSize: 16
              }}
            />
          </div>
          
          <button 
            onClick={handleSubmit}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: 5, 
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 'bold'
            }}
          >
            ➕ Add Entry
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ 
        background: '#e8f5e8', 
        padding: 20, 
        borderRadius: 10, 
        textAlign: 'center',
        marginBottom: 30
      }}>
        <h3>💰 Total Spending</h3>
        <h2 style={{ margin: 0, color: '#28a745' }}>THB {total.toLocaleString()}</h2>
      </div>

      {/* Entries Table */}
      <div style={{ 
        background: 'white', 
        padding: 20, 
        borderRadius: 10, 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
      }}>
        <h3>📋 Spending Records</h3>
        
        {(entries || []).length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
            No spending records yet. Add your first entry above!
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: 14
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: '#f8f9fa', 
                  borderBottom: '2px solid #dee2e6' 
                }}>
                  <th style={{ padding: 12, textAlign: 'left' }}>Date</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Category</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: 12, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(entries || []).map((entry) => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: 12 }}>
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: 12 }}>
                      <span style={{ marginRight: 8 }}>{entry.icon}</span>
                      {entry.name}
                    </td>
                    <td style={{ padding: 12, textAlign: 'right', fontWeight: 'bold' }}>
                      THB {entry.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      <button 
                        onClick={() => handleDeleteEntry(entry.id)}
                        style={{ 
                          padding: '4px 8px', 
                          backgroundColor: '#dc3545', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: 3, 
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal; 