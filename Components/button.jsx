import { useEffect, useState } from 'react';

export default function NewFeatureButton({ onClick }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 7000); // через 3 секунды
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Значок "NEW" */}
      <span
        style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          background: 'red',
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold',
          padding: '2px 6px',
          borderRadius: '999px',
          boxShadow: '0 0 4px rgba(0,0,0,0.3)',
          zIndex: 2
        }}
      >
        !
      </span>

      {/* Кнопка */}
      <button
        onClick={onClick}
        style={{
          background: '#fff',
          color: '#000',
          border: 'none',
          padding: '10px 8px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          animation: animate ? 'pulseGlow 1.5s ease-in-out infinite' : 'none',
        }}
      >
        Схема участка
      </button>
    </div>
  );
}
