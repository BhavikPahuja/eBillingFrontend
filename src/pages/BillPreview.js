import React, { useRef } from 'react';

export default function BillPreview({ billData, onBack }) {
  const printRef = useRef();
  const amountInWords = billData.amountInWords || "Rupees " + (billData.totalAmount || 0) + " Only";
  // Only show up to 6 items to ensure it fits on one page
  const items = (billData.items || billData.products || []).slice(0, 6);

  return (
    <div style={{ padding: 20 }}>
      <style>{`
        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .invoice-box, .invoice-box * {
            visibility: visible !important;
          }
          .invoice-box {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            min-height: 100vh;
            max-width: none;
            box-sizing: border-box;
            max-height: 270mm;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
          }
          body * { visibility: hidden !important; }
          button, .no-print { display: none !important; }
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 14px;
        }
        .invoice-box {
          width: 100vw;
          min-height: 100vh;
          margin: 0;
          padding: 20mm 10mm;
          border: 1px solid #000;
          background: #fff;
          box-sizing: border-box;
          max-height: 270mm;
          overflow: hidden;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        /* Products table: vertical borders only for body, full border for header */
        .products-table {
          border: 1.5px solid #000;
          border-collapse: collapse;
          border-spacing: 0;
        }
        .products-table th {
          border: 1px solid #000;
          font-size: 1.1em;
          padding: 12px 8px;
          text-align: left;
          background: #f6f6f6;
        }
        .products-table td {
          border-left: 1px solid #000;
          border-right: 1px solid #000;
          border-top: none;
          border-bottom: none;
          padding: 12px 8px;
          text-align: left;
        }
        .products-table tr td:first-child,
        .products-table tr th:first-child {
          border-left: none;
        }
        .products-table tr td:last-child,
        .products-table tr th:last-child {
          border-right: none;
        }
        .no-border {
          border: none;
        }
        .center {
          text-align: center;
        }
        .right {
          text-align: right;
        }
        .border {
          border: 1px solid #000;
        }
      `}</style>
      <button
        onClick={onBack}
        style={{ marginBottom: 10 }}
        className="text-red-600 hover:text-red-800 font-semibold px-4 py-2 border border-red-600 rounded-xl transition no-print"
      >
        Back to Form
      </button>
      <button
        onClick={() => window.print()}
        style={{ marginLeft: 10, marginBottom: 10 }}
        className="text-red-600 hover:text-red-800 font-semibold px-4 py-2 border border-red-600 rounded-xl transition no-print"
      >
        Print Bill
      </button>
      <div className="invoice-box" ref={printRef}>
        <table>
          <tbody className='border'>
            <tr className='border'>
              <td colSpan={3} className=" center">
                <strong>INVOICE</strong><br />
                <strong>RAJASTHAN MOBILE SHOP</strong><br />
                MAIN MARKET, MIRZEWALA<br />
                SRI GANGANAGAR, 335038
              </td>
            </tr>
            <tr>
              <td className='border'>
                <strong>Invoice No.:</strong><br />
                {billData.invoiceNo}
              </td>
              <td className='border'>
                <strong>Date:</strong><br />
                {billData.date}
              </td>
            </tr>
            <tr>
              <td className='border'>
                <strong>Billed to</strong><br />
                {billData.billTo}<br />
                {billData.billToAddress}<br />
                {billData.billToCity}
              </td>
              <td>
                <strong>Shipped to</strong><br />
                {billData.shipTo || billData.billTo}<br />
                {billData.shipToAddress || billData.billToAddress}<br />
                {billData.shipToCity || billData.billToCity}
              </td>
            </tr>
          </tbody>
        </table>

        <br />

        <table className="products-table" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ width: "8%" }}>Sl. No.</th>
              <th style={{ width: "48%" }}>Description of Goods</th>
              <th style={{ width: "14%" }}>Qty.</th>
              <th style={{ width: "15%" }}>Price</th>
              <th style={{ width: "15%" }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity} {item.unit || "Pcs."}</td>
                <td>{Number(item.price).toFixed(2)}</td>
                <td>{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
            {Array.from({ length: Math.max(8 - items.length, 0) }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td>&nbsp;</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>

        <br />

        <table className='border'>
          <tbody>
            <tr>
              <td colSpan={4} className="right border"><strong>{`Grand Total :`}</strong></td>
              <td><strong>₹ {billData.totalAmount?.toFixed(2) || "0.00"}</strong></td>
            </tr>
          </tbody>
        </table>

        <br />

        <p><strong>{amountInWords.charAt(0).toUpperCase() + amountInWords.slice(1)}</strong></p>

        <br />

        <table className='border'>
          <tbody>
            <tr>
              <td className='border'>
                <strong>Terms & Conditions</strong><br />
                1. Goods once sold will not be taken back.
              </td>
              <td className="center border">
                <br /><br /><br />
                Receiver's Signature
              </td>
              <td className="center">
                <br /> <br /><br />
                Authorised Signatory
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}