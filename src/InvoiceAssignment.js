import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import InvoiceTable from './InvoiceTable';
import './InvoiceAssignment.css'

const InvoiceSelection = () => {
  const [invoices, setInvoices] = useState([]);
  const [recievedInvoices, setRecievedInvoices] = useState([]);
  const [creditNotes, setCreditNotes] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedCreditNotes, setSelectedCreditNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignmentSummary, setAssignmentSummary] = useState(null);


  const fetchInvoices = async () => {
    try {
      const response = await axios.get(
        'https://recruiting.api.bemmbo.com/invoices/pending'
      );
      const receivedInvoices = response.data.filter(
        (invoice) => invoice.type === 'received'
      );
      setInvoices(response.data);
      setRecievedInvoices(receivedInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const HandleSummary = () => {
    const selectedCreditNotesInfo = creditNotes.filter((creditNote) =>
      selectedCreditNotes.includes(creditNote.id)
    );
    const selectedInvoiceInfo = invoices.find((invoice) => 
      invoice.id === selectedInvoice
    );
    const newAmountToPay = selectedCreditNotesInfo.reduce((total, creditNote) =>
      total - creditNote.amount,
      selectedInvoiceInfo.amount
    );
    setAssignmentSummary({
      creditNotes: selectedCreditNotesInfo,
      invoiceId: selectedInvoiceInfo.id,
      invoiceAmount: selectedInvoiceInfo.amount,
      newAmountToPay: newAmountToPay,
    });
  }

  const handleInvoiceClick = (invoiceId, type) => {
    if (type === 'recieved') {
      setSelectedInvoice(invoiceId);
      const creditNotes = invoices.filter( (invoice) =>
        invoice.type === 'credit_note' &&
        invoice.reference === invoiceId
      );
      setCreditNotes(creditNotes);
    }
    else {
      setSelectedCreditNotes((prevSelected) => {
        if (prevSelected.includes(invoiceId)) {
          return prevSelected.filter((id) => id !== invoiceId);
        } else {
          return [...prevSelected, invoiceId];
        }
      });
    } 
  };

  const handleAssignButtonClick = () => {
    HandleSummary();  
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
    setSelectedCreditNotes([]);
    setIsModalOpen(false);
    setAssignmentSummary(null); 
  };

  return (
    <div className="invoice-selection-container">
      <h1>Selecciona una factura</h1>
      <InvoiceTable 
        invoices={recievedInvoices}
        handleInvoiceClick={handleInvoiceClick}
        type = 'recieved' 
      />
      {selectedInvoice && (
        <>
          <h1>Selecciona una nota de crédito</h1>
          <InvoiceTable 
            invoices={creditNotes}
            handleInvoiceClick={handleInvoiceClick}
            type = 'credit_note' 
          />
        </>  
      )}
      {selectedCreditNotes.length > 0 && (
        <div>
          <button onClick={handleAssignButtonClick}>Asignar</button>
        </div>
      )}
      
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Asignación Exitosa"
      >
        <div>
          <p>Asignación exitosa</p>
          {assignmentSummary && (
            <div>
              <h1>Resumen de asignación</h1>
              <p>ID Factura Asignada: {assignmentSummary.invoiceId}</p>
              <p>Monto Factura Asignada: {assignmentSummary.invoiceAmount}</p>
              <p>Notas de Crédito Asignadas:</p>
              <ul>
                {assignmentSummary.creditNotes.map((creditNote) => (
                  <li key={creditNote.id}>
                    ID Nota de Crédito: {creditNote.id}, Monto: {creditNote.amount}
                  </li>
                ))}
              </ul>
              <p>Nuevo Monto a Pagar: {assignmentSummary.newAmountToPay}</p>
            </div>
          )}
          <button onClick={closeModal}>Cerrar</button>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceSelection;
