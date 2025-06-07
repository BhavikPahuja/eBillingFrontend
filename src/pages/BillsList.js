import React, { useEffect, useState } from "react";
import BillPreview from "./BillPreview";
import { toWords } from 'number-to-words';

export default function BillsList() {
  const [selectedBill, setSelectedBill] = useState(null);
  const [bills, setBills] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  function formatDate(dateString) {
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
}
  const fetchBills = async () => {
    setLoading(true);
    try {
      let url = "https://ebillingbackend.onrender.com/api/bills";
      const params = [];
      if (from) params.push(`from=${from}`);
      if (to) params.push(`to=${to}`);
      if (params.length) url += "?" + params.join("&");

      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      setBills(data);
    } catch (err) {
      setBills([]);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchBills();
  }, []);
  const handleFilter = (e) => {
    e.preventDefault();
    fetchBills();
  };
const handleShowBill = async (billId) => {
  window.scrollTo({ top: 0, behavior: "smooth" }); // <-- Scroll to top
  const res = await fetch(`https://ebillingbackend.onrender.com/api/bills/${billId}`);
  const bill = await res.json();
  const total = bill.products.reduce((sum, p) => sum + Number(p.quantity) * Number(p.price), 0);
  setSelectedBill({
    billTo: bill.billerName,
    invoiceNo: bill.serial,
    date: formatDate(bill.date),
    billToAddress: bill.billToAddress,
    billToCity: bill.billToCity,
    products: bill.products,
    totalAmount: total,
    subTotal: total,
    received: bill.received ?? total,
    balance: bill.balance ?? 0,
    currentBalance: bill.currentBalance ?? 0,
    amountInWords: total > 0 ? `${toWords(total)} Rupees only` : "Zero Rupees only",
  });
};

  const handleDownloadExcel = () => {
    window.open("https://ebillingbackend.onrender.com/api/bills/excel", "_blank");
  };

  return (
     <div>
    {selectedBill ? (
      <BillPreview
        billData={selectedBill}
        onBack={() => setSelectedBill(null)}
      />
    ) : (
      <div className="flex flex-col items-center min-h-[80vh] py-10">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">All Bills</h2>
        
        <form className="flex flex-col md:flex-row gap-4 mb-6 justify-center" onSubmit={handleFilter}>
          <div>
            <label className="block text-sm text-gray-600 mb-1">From</label>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">To</label>
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition self-end"
          >
            Filter
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="p-3 text-left rounded-tl-2xl">Serial</th>
                <th className="p-3 text-left">Id</th>
                <th className="p-3 text-left">Biller</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-400">Loading...</td>
                </tr>
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-400">No bills yet.</td>
                </tr>
              ) : (
                bills.map(bill => (
                  <tr key={bill._id} className="hover:bg-blue-50 transition">
                    <td className="p-3 font-semibold">{bill.serial}</td>
                    <td className="p-3 font-semibold">{bill._id}</td>
                    <td className="p-3">{bill.billerName}</td>
                    <td className="p-3">{new Date(bill.date).toLocaleDateString()}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        className="bg-blue-600 text-white px-4 py-1 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                        onClick={() => handleShowBill(bill._id)}
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <button
          className="mt-8 w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-green-700 hover:to-green-800 transition"
          onClick={handleDownloadExcel}
        >
          Download All as Excel
        </button>
      </div>
    </div>
    )}
  </div>
  );
}

