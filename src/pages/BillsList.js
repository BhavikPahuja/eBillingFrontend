import React, { useEffect, useState } from "react";
import BillPreview from "./BillPreview";

async function generateBillPdfById(billId) {
  // 1. Fetch bill data from backend
  const res = await fetch(`http://localhost:5000/api/bills/${billId}`);
  const bill = await res.json();

  // 2. Transform data to match BillPreview's expected props
  const total = bill.products.reduce((sum, p) => sum + Number(p.quantity) * Number(p.price), 0);
  const billData = {
    address: "Main Market, Mirzewala, Sri Ganganagar",
    invoiceNo: bill.serial || bill._id,
    date: bill.date ? new Date(bill.date).toISOString() : "",
    companyName: bill.billerName,
    contactNo: bill.billerNumber || 7979797979,
    items: bill.products,
    totalAmount: bill.totalAmount,
    subTotal: bill.totalAmount,
    received: bill.totalAmount,
    balance: 0,
    currentBalance: bill.currentBalance || 0,
    amountInWords: total > 0 ? `${total} Rupees only` : "Zero Rupees only",
  };

  // 2. Create a hidden container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  // 3. Render BillPreview into the container
  const ReactDOM = await import('react-dom/client');
  ReactDOM.createRoot(container).render(<BillPreview billData={billData} onBack={() => {}} />)

  // 4. Wait for rendering
  await new Promise(r => setTimeout(r, 700));

  // 5. Generate and save PDF (no prompt)
  const element = container.firstChild;
  const opt = {
    margin: 0,
    filename: `bill_${billData.invoiceNo || billId}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  await window.html2pdf().set(opt).from(element).save();

  // 6. Clean up
  document.body.removeChild(container);
}

export default function BillsList() {
  const [selectedBill, setSelectedBill] = useState(null);
  const [bills, setBills] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch bills from backend with optional date filter
  const fetchBills = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:5000/api/bills";
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
    // eslint-disable-next-line
  }, []);

  // Handle filter submit
  const handleFilter = (e) => {
    e.preventDefault();
    fetchBills();
  };

  const handleDownloadPdf = async (billId) => {
  //  generateBillPdfById(billId);
  };

const handleShowBill = async (billId) => {
  window.scrollTo({ top: 0, behavior: "smooth" }); // <-- Scroll to top
  const res = await fetch(`http://localhost:5000/api/bills/${billId}`);
  const bill = await res.json();
  const total = bill.products.reduce((sum, p) => sum + Number(p.quantity) * Number(p.price), 0);
  setSelectedBill({
    companyName: bill.billerName,
    billTo: bill.billTo || bill.billerName,
    contactNo: bill.billerNumber || 7979797979,
    invoiceNo: bill.serial || bill._id,
    date: bill.date ? new Date(bill.date).toLocaleDateString() : "",
    address: bill.address || "Main Market, Mirzewala, Sri Ganganagar",
    products: bill.products || [],
    totalAmount: total,
    subTotal: total,
    received: bill.received ?? total,
    balance: bill.balance ?? 0,
    currentBalance: bill.currentBalance ?? 0,
    amountInWords: total > 0 ? `${total} Rupees only` : "Zero Rupees only",
  });
};

  const handleDownloadExcel = () => {
    window.open("http://localhost:5000/api/bills/excel", "_blank");
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
        
        {/* Date Filter */}
        <form className="flex gap-4 mb-6 justify-center" onSubmit={handleFilter}>
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

