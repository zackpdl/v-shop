import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '15px 20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: 20
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ 
          margin: 0, 
          color: 'white', 
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          💰 Spending Tracker
        </h1>
        
        <div style={{ display: 'flex', gap: 20 }}>
          <Link 
            to="/" 
            style={{
              color: location.pathname === '/' ? '#ffd700' : 'white',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.2)' : 'transparent',
              fontWeight: location.pathname === '/' ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            📊 Analytics
          </Link>
          <Link 
            to="/journal" 
            style={{
              color: location.pathname === '/journal' ? '#ffd700' : 'white',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              backgroundColor: location.pathname === '/journal' ? 'rgba(255,255,255,0.2)' : 'transparent',
              fontWeight: location.pathname === '/journal' ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            🧾 Journal
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 