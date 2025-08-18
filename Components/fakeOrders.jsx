import React, { useEffect } from "react";
import { toast } from 'react-toastify';

export const FakeOrders = () => {


  const customId = "Скопировано";

  const notify = () => {
    toast(<div className="messageContainer">
      <div className="dataRisk">Объект: {hideLastPart(generateRandomCadastreNumber())}</div>
      <div className="dataText">Заказ: {getRandomReportType()}</div>
      <div className="dataText">Статус: {getRandomStatus()}</div>
    </div>, {
      toastId: customId,
      autoClose: 6000,
      hideProgressBar: true,
      closeOnClick: false,
      draggable: false,
    });
  }

  function generateRandomCadastreNumber() {
    const chunks = [];
    for (let i = 0; i < 2; i++) {
      const chunk = Math.floor(Math.random() * 100).toString().padStart(2, "0");
      chunks.push(chunk);
    }
    const randomLength = Math.floor(Math.random() * 5) + 2;
    const randomPart = Array.from(
      { length: randomLength },
      () => Math.floor(Math.random() * 10)
    ).join("");
    chunks.push(randomPart);

    const randomLengthAfterColon = Math.floor(Math.random() * 9) + 1;
    const randomPartAfterColon = Array.from(
      { length: randomLengthAfterColon },
      () => Math.floor(Math.random() * 10)
    ).join("");
    chunks.push(randomPartAfterColon);

    return chunks.join(":");
  }

  function hideLastPart(cadastreNumber) {
    const parts = cadastreNumber.split(":");
    const hiddenPart = parts[3].replace(/\d/g, "*");
    parts[3] = hiddenPart;
    return parts.join(":");
  }

  function getRandomReportType() {
    const reportTypes = [
      "Отчет о переходе прав",
      "Отчет об основных характеристиках",
      "Отчет о кадастровой стоимости",
      "Отчет о собственниках",
      "Расширенный отчет",
    ];
    return reportTypes[Math.floor(Math.random() * reportTypes.length)];
  }

  function getRandomStatus() {
    const statuses = ["Отправлен клиенту", "Оплачен клиентом"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  return (
    <>
    {notify()}
    </>
  )
};
