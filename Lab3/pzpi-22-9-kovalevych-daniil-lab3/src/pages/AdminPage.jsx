import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function AdminPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3001/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Access denied');
        }
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(err => {
        console.error(err);
        setUsers([]);
        alert(err.message);
      });
  }, []);

  const saveBackup = () => {
    const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'backup.json';
    link.click();
  };

  const importUsers = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          setUsers(imported);
          alert('Імпортовано успішно');
        } else {
          alert('Невірний формат JSON');
        }
      } catch {
        alert('Помилка при зчитуванні файлу');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{
      maxWidth: '700px', margin: '40px auto',
      background: 'white', padding: '30px', borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#4A3AFF' }}>{t('adminTitle') || 'Список користувачів'}</h2>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px 0' }}>
        <button onClick={saveBackup} style={btnStyle}>{t('backup') || 'Зберегти резервну копію'}</button>
        <label style={{ ...btnStyle, cursor: 'pointer' }}>
          📥 {t('import') || 'Імпортувати JSON'}
          <input type="file" accept=".json" onChange={importUsers} style={{ display: 'none' }} />
        </label>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map(user => (
          <li key={user.id} style={{
            borderBottom: '1px solid #eee', padding: '10px 0'
          }}>
            <strong>{user.username}</strong> — {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

const btnStyle = {
  background: '#7A5AF8',
  color: 'white',
  border: 'none',
  padding: '10px 14px',
  borderRadius: '6px',
  fontWeight: 'bold'
};

export default AdminPage;