import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';

function UserPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language === 'uk' ? uk : enUS;
  const today = format(new Date(), 'PPP', { locale });

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>{t('welcome')}</h1>
      <p>{t('date', { date: today })}</p>
      <button onClick={() => navigate('/login')}>
        {t('continue')}
      </button>
    </div>
  );
}

export default UserPage;