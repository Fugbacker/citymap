import { NalogApi } from "lknpd-nalog-api";
import pdf from "html-pdf";

export default async function handler(req, res) {
  const income = {
    name: "Тест",
    amount: 5,
    quantity: 1,
  };

  const nalogApi = new NalogApi({
    inn: 634003496894,
    password: "stfuJKHFG*D1983", // лучше в .env
  });

  try {
    const receiptId = await nalogApi.addIncome(income);
    const blob = await nalogApi.getApprovedIncome(receiptId, "print");

    const buffer = Buffer.from(await blob.arrayBuffer());

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", "inline; filename=receipt.png");
    res.send(buffer);
  } catch (error) {
    console.error("Ошибка:", error);
    res.status(500).json({ error: "Ошибка при получении чека" });
  }
}
