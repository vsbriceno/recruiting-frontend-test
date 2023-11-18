import React from 'react';

const InvoiceSummary = ({ selectedInvoiceInfo, selectedCreditNotesInfo }) => {
  return (
    <div className="summary-container">
      <h1>Resumen de Selección</h1>
      {selectedInvoiceInfo && (
        <>
          <p>
            Factura Seleccionada:
          </p>
          <ul>
            <li>
              ID {selectedInvoiceInfo.id}, Monto {selectedInvoiceInfo.amount} {selectedInvoiceInfo.currency}
            </li>
          </ul>
      </> 
      )}
      {selectedCreditNotesInfo.length > 0 && (
        <div>
          <p>Notas de Crédito Seleccionadas:</p>
          <ul>
            {selectedCreditNotesInfo.map((note) => (
              <li key={note.id}>
                ID {note.id}, Monto {note.amount} {note.currency}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InvoiceSummary;
