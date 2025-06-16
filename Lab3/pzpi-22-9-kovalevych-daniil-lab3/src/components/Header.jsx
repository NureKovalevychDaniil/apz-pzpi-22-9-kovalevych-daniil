import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '10px 20px',
      background: '#eee', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      <div>
        <button onClick={() => i18n.changeLanguage('uk')}>UA</button>
        <button onClick={() => i18n.changeLanguage('en')}>EN</button>
      </div>
      <button onClick={logout} style={{ background: '#a084dc', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px' }}>
        Вийти
      </button>
    </div>
  );
}

export default Header;