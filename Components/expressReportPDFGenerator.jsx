import { useState } from 'react';

export default function ExpressReportPDFGenerator({ cadNumber }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      // Отправляем запрос на генерацию PDF
      const response = await fetch(`/api/expressReportPDFGenerator?cadNumber=${encodeURIComponent(cadNumber)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Ошибка при генерации PDF');
      }

      // Получаем файл и скачиваем его
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${cadNumber}.pdf`); // Имя файла
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Ошибка при скачивании PDF:', error);
    }
  };

  return (
    <div>
      <button onClick={handleDownload}>GenerateExpress
      </button>
    </div>
  );
}
