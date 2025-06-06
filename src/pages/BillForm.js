import React, { useState, useRef } from "react";
import BillPreview from "./BillPreview";
import { toWords } from 'number-to-words';

export default function BillForm() {
  const [billerName, setBillerName] = useState("");
  const [billToAddress, setBillToAddress] = useState("");
  const [billToCity, setBillToCity] = useState("");
  const [products, setProducts] = useState([{ name: "", quantity: "", price: "" }]);
  const [showPrint, setShowPrint] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [billDate, setBillDate] = useState("");
  const inputRef = useRef(null);

  const handleAddProduct = () => {
    setProducts([...products, { name: "", quantity: "", price: "" }]);
  };

  const handleRemoveProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!billerName.trim()) return alert("Please enter the biller name");
    if (!billToAddress.trim()) return alert("Please enter the biller address");
    if (!billToCity.trim()) return alert("Please enter the biller city");
    if (products.length === 0) return alert("Please add at least one product");

    for (const prod of products) {
      if (!prod.name.trim()) return alert("Please enter all product names");
      if (!prod.quantity || isNaN(prod.quantity) || Number(prod.quantity) <= 0)
        return alert("Please enter valid quantities for all products");
      if (!prod.price || isNaN(prod.price) || Number(prod.price) <= 0)
        return alert("Please enter valid prices for all products");
    }

    setLoading(true);

    const billDataToSend = {
      billerName,
      billToAddress,
      billToCity,
      date: new Date().toISOString(),
      products: products.map((p) => ({
        name: p.name,
        quantity: Number(p.quantity),
        price: Number(p.price),
      })),
      totalAmount: products.reduce((sum, p) => sum + Number(p.quantity) * Number(p.price), 0),
    };

    try {
      console.log("Sending data:", billDataToSend);

      const response = await fetch("https://ebillingbackend.onrender.com/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billDataToSend),
      });

      if (!response.ok) throw new Error("Failed to save bill");
      console.log("Response received");

      const data = await response.json();
      console.log("Parsed response:", data);

      setInvoiceNo(data.invoiceNo);
      setShowPrint(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  function formatDate(dateString) {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  }

  const totalAmount = products.reduce(
    (sum, p) => sum + Number(p.quantity) * Number(p.price),
    0
  );

  return (
    <>
      {!showPrint ? (
        loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
              Bill Creator
            </h2>

            <div className="mb-6">
              <label className="block font-semibold mb-2 text-blue-900">
                Biller Name:
              </label>
              <input
                ref={inputRef}
                type="text"
                value={billerName}
                onChange={(e) => setBillerName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter biller name"
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2 text-blue-900">
                Biller Address:
              </label>
              <input
                type="text"
                value={billToAddress}
                onChange={(e) => setBillToAddress(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter biller address"
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2 text-blue-900">
                Biller City:
              </label>
              <input
                type="text"
                value={billToCity}
                onChange={(e) => setBillToCity(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter biller city"
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2 text-blue-900">
                Bill Date:
              </label>
              <input
                type="date"
                value={billDate}
                onChange={e => setBillDate(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Select bill date"
              />
            </div>

            <h3 className="text-2xl font-semibold mb-6 text-blue-800">Products</h3>

            {products.map((prod, index) => (
              <div key={index} className="flex flex-wrap items-center gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={prod.name}
                  onChange={(e) => handleProductChange(index, "name", e.target.value)}
                  required
                  className="flex-grow min-w-[180px] border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  min="1"
                  value={prod.quantity}
                  onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                  required
                  className="w-28 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="number"
                  placeholder="Price"
                  min="0.01"
                  step="0.01"
                  value={prod.price}
                  onChange={(e) => handleProductChange(index, "price", e.target.value)}
                  required
                  className="w-36 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(index)}
                    className="text-red-600 hover:text-red-800 font-semibold px-4 py-2 border border-red-600 rounded-xl transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddProduct}
              className="mb-8 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-3xl font-bold shadow-lg hover:from-green-700 hover:to-green-800 transition"
            >
              Add Product
            </button>

            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-700 to-blue-800 text-white font-bold rounded-3xl shadow-lg hover:from-blue-800 hover:to-blue-900 transition"
            >
              Generate Bill Preview
            </button>
          </form>
        )
      ) : (
        <div className="mt-12 max-w-4xl mx-auto">
          <BillPreview
            billData={{
              billTo: billerName,
              invoiceNo: invoiceNo,
              date:  formatDate(billDate) ? new Date(billDate).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB"),
              billToAddress,
              billToCity,
              products: products,
              totalAmount,
              subTotal: totalAmount,
              received: 0,
              balance: totalAmount,
              amountInWords: totalAmount > 0 ? `${toWords(totalAmount)} Rupees only` : "Zero Rupees only",
            }}
            onBack={() => setShowPrint(false)}
          />
        </div>
      )}
    </>
  );
}