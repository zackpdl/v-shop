import React, { useRef, useState } from 'react';
import { useLocalStorage } from 'react-use';
// @ts-ignore
import categoryData from '../spending-category.json';

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

const Journal: React.FC = () => {
  const amountRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const newCategoryRef = useRef<HTMLInputElement>(null);
  const newDescriptionRef = useRef<HTMLInputElement>(null);

  const [entries, setEntries] = useLocalStorage<Entry[]>('financeEntries', []);
  const [customCategories, setCustomCategories] = useLocalStorage<Category[]>('categories', []);
  const [selectedCategory, setSelectedCategory] = useState<Category>(categoryData[0]);
  const [description, setDescription] = useState('');
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);

  // Combine default categories with custom categories
  const allCategories = [...categoryData, ...(customCategories || [])];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    if (selectedId === -1) {
      setShowNewCategoryForm(true);
      return;
    }
    const cat = allCategories.find((c: any) => c.spending_id === selectedId);
    if (cat) {
      setSelectedCategory(cat);
      setDescription(cat.description);
    }
  };

  const handleAddCategory = () => {
    const categoryName = newCategoryRef.current?.value;
    const categoryDescription = newDescriptionRef.current?.value;
    
    if (!categoryName || !categoryDescription) {
      alert('Please fill in both category name and description');
      return;
    }

    const newCategory: Category = {
      spending_id: Date.now(),
      category: categoryName,
      description: categoryDescription
    };

    setCustomCategories([...(customCategories || []), newCategory]);
    setSelectedCategory(newCategory);
    setDescription(categoryDescription);
    setShowNewCategoryForm(false);

    // Clear form
    if (newCategoryRef.current) newCategoryRef.current.value = '';
    if (newDescriptionRef.current) newDescriptionRef.current.value = '';
  };

  const handleSubmit = () => {
    const amount = Number(amountRef.current?.value);
    const date = dateRef.current?.value;
    if (!amount || !date || !selectedCategory || !description) return alert('Fill all fields');

    const entry: Entry = {
      id: Date.now(),
      category: selectedCategory.category,
      description: description,
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
    <div>
      <h1>🧾 Spending Journal</h1>

      {/* Input Form */}
      <div className="card">
        <h3>📝 Add New Entry</h3>
        
        <div style={{ display: 'grid', gap: 15 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
              📆 Date:
            </label>
            <input 
              type="date" 
              ref={dateRef}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
              🏷️ Category:
            </label>
            <select 
              ref={categoryRef} 
              onChange={handleCategoryChange}
              value={selectedCategory?.spending_id || ''}
            >
              <option value="-1">+ Add New Category</option>
              {allCategories.map((cat: any) => (
                <option key={cat.spending_id} value={cat.spending_id}>
                  {cat.category}
                </option>
              ))}
            </select>

            {showNewCategoryForm && (
              <div className="new-category-form card mb-4">
                <h3>Create New Category</h3>
                <input
                  ref={newCategoryRef}
                  type="text"
                  placeholder="Category Name"
                  className="mb-2"
                />
                <input
                  ref={newDescriptionRef}
                  type="text"
                  placeholder="Category Description"
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <button onClick={handleAddCategory} className="primary">Add Category</button>
                  <button onClick={() => setShowNewCategoryForm(false)} className="secondary">Cancel</button>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
              📝 Description:
            </label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
              💸 Amount (THB):
            </label>
            <input 
              type="number" 
              ref={amountRef}
              placeholder="Enter amount"
            />
          </div>
          
          <button onClick={handleSubmit}>
            ➕ Add Entry
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="card" style={{ 
        background: '#e8f5e8', 
        textAlign: 'center',
        marginBottom: 30
      }}>
        <h3>💰 Total Spending</h3>
        <h2 style={{ margin: 0, color: '#28a745' }}>THB {total.toLocaleString()}</h2>
      </div>

      {/* Entries Table */}
      <div className="card">
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
                      {entry.category}
                      <div style={{ fontSize: 12, color: '#666' }}>{entry.description}</div>
                    </td>
                    <td style={{ padding: 12, textAlign: 'right', fontWeight: 'bold' }}>
                      THB {entry.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      <button 
                        onClick={() => handleDeleteEntry(entry.id)}
                        style={{ 
                          backgroundColor: '#dc3545',
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