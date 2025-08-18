import { useState } from 'react';

function GeneratePdfButton({ cadNumber }) {

  const handleClick = async () => {
    try {
      const modifiedString = cadNumber.replace(/:/g, '-');
      const response = await fetch('/api/cadastrPricePDFGenerator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cadNumber }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${modifiedString}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error('Error generating PDF');
      }
    } catch (error) {
      console.error('Error generating PDF', error);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Generate PDF</button>
    </div>
  );
}

export default GeneratePdfButton;
