import React, { useRef } from 'react';

export default function BillPreview({ billData, onBack }) {
  const printRef = useRef();
  if (!billData) return <div>No bill data</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Print CSS: only show .print-area when printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .print-area, .print-area * {
            visibility: visible !important;
          }
          .print-area {
            position: absolute;
            left: 0; top: 0; width: 100vw;
          }
          button, .no-print {
            display: none !important;
          }
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
        onClick={handlePrint}
        style={{ marginLeft: 10, marginBottom: 10 }}
        className="text-red-600 hover:text-red-800 font-semibold px-4 py-2 border border-red-600 rounded-xl transition no-print"
      >
        Print Bill
      </button>

      <div
        ref={printRef}
        className="print-area"
        style={{
          width: '210mm',
          minHeight: '297mm',
          margin: 'auto',
          backgroundColor: 'white',
          padding: 40,
          boxSizing: 'border-box',
          fontFamily: `'Segoe UI', Arial, sans-serif`,
          border: '1.5px solid #e0e0e0',
          borderRadius: 12,
          boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '2px solid #1976d2',
          paddingBottom: 18,
          marginBottom: 24
        }}>
          <div>
            <h1 style={{
              color: '#1976d2',
              fontSize: '2.5rem',
              margin: 0,
              letterSpacing: 2
            }}>
              Mobile Shop Mirzewala
            </h1>
            Main Market, Mirzewala, Sri Ganganagar
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 32,
          marginBottom: 12,
          fontSize: '1rem'
        }}>
          <div>
            <strong>Bill To:</strong> {billData.billTo || billData.companyName}<br />
            <strong>Contact No.:</strong> {billData.contactNo}
          </div>
          <div>
            <strong>Invoice No:</strong> {billData.invoiceNo} <br />
            <strong>Date:</strong> {billData.date}
          </div>
        </div>

        <h2 style={{ color: '#333', margin: '18px 0 8px 0' }}>Invoice Details</h2>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: 18,
          marginBottom: 18,
          background: '#fafbfc'
        }}>
          <thead>
            <tr style={{
              background: '#e3eafc',
              color: '#1976d2',
              fontWeight: 600,
              fontSize: '1rem'
            }}>
              <th style={{ border: '1.5px solid #b0bec5', padding: '10px 8px', textAlign: 'left' }}>#</th>
              <th style={{ border: '1.5px solid #b0bec5', padding: '10px 8px', textAlign: 'left' }}>Item Name</th>
              <th style={{ border: '1.5px solid #b0bec5', padding: '10px 8px', textAlign: 'left' }}>Quantity</th>
              <th style={{ border: '1.5px solid #b0bec5', padding: '10px 8px', textAlign: 'left' }}>Price / Unit</th>
              <th style={{ border: '1.5px solid #b0bec5', padding: '10px 8px', textAlign: 'left' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {(billData.items || billData.products || []).map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1.5px solid #b0bec5', padding: '10px 8px' }}>{index + 1}</td>
                <td style={{ border: '1.5px solid #b0bec5', padding: '10px 8px' }}>{item.name}</td>
                <td style={{ border: '1.5px solid #b0bec5', padding: '10px 8px' }}>{item.quantity}</td>
                <td style={{ border: '1.5px solid #b0bec5', padding: '10px 8px' }}>₹ {Number(item.price).toFixed(2)}</td>
                <td style={{ border: '1.5px solid #b0bec5', padding: '10px 8px' }}>₹ {(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: 'bold', color: '#1976d2', background: '#f0f4ff' }}>
              <td colSpan="4" style={{ textAlign: 'right', border: '1.5px solid #b0bec5', padding: '10px 8px' }}>Total</td>
              <td style={{ border: '1.5px solid #b0bec5', padding: '10px 8px' }}>₹ {billData.totalAmount?.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div style={{ margin: '10px 0 18px 0', fontStyle: 'italic', color: '#444' }}>
          <strong>Invoice Amount in Words:</strong> {billData.amountInWords}
        </div>

        <table style={{ width: '50%', float: 'right', marginTop: 10, marginBottom: 24 }}>
          <tbody>
            <tr><td>Sub Total:</td><td>₹ {billData.subTotal?.toFixed(2)}</td></tr>
            <tr><td>Total:</td><td>₹ {billData.totalAmount?.toFixed(2)}</td></tr>
            <tr><td>Received:</td><td>₹ {billData.received?.toFixed(2)}</td></tr>
            <tr><td>Balance:</td><td>₹ {billData.balance?.toFixed(2)}</td></tr>
            <tr><td>Current Balance:</td><td>₹ {billData.currentBalance?.toLocaleString('en-IN')}</td></tr>
          </tbody>
        </table>

        <div style={{ clear: 'both' }}></div>

        <div style={{
          marginTop: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end'
        }}>
          <div style={{
            fontSize: '1.1rem',
            color: '#1976d2',
            fontStyle: 'italic'
          }}>
            Thank you for doing business with us.
          </div>
        </div>
      </div>
    </div>
  );
}