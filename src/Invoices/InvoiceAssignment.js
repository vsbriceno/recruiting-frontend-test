import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import InvoiceTable from './InvoiceTable';
import InvoiceSummary from './InvoiceSummary';
import './InvoiceAssignment.css';

const InvoiceSelection = () => {
  const [invoices, setInvoices] = useState([]);
  const [recievedInvoices, setRecievedInvoices] = useState([]);
  const [creditNotes, setCreditNotes] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedCreditNotes, setSelectedCreditNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleInvoiceClick = (invoiceId, type) => {
    if (type === 'recieved') {
      const creditNotes = invoices.filter(
        (invoice) =>
          invoice.type === 'credit_note' && invoice.reference === invoiceId
      );
      setSelectedInvoice(invoiceId);
      setCreditNotes(creditNotes);
      setSelectedCreditNotes([]);
    } else {
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
    setSelectedCreditNotes([]);
    setIsModalOpen(false);
  };

  const getSelectedInvoiceInfo = () => {
    if (selectedInvoice) {
      const selectedInvoiceInfo = invoices.find(
        (invoice) => invoice.id === selectedInvoice
      );
      return selectedInvoiceInfo;
    }
    return null;
  };

  const getSelectedCreditNotesInfo = () => {
    if (selectedCreditNotes.length > 0) {
      const selectedCreditNotesInfo = creditNotes.filter((note) =>
        selectedCreditNotes.includes(note.id)
      );
      return selectedCreditNotesInfo;
    }
    return [];
  };

  const renderSummary = () => {
    const selectedInvoiceInfo = getSelectedInvoiceInfo();
    const selectedCreditNotesInfo = getSelectedCreditNotesInfo();
    return (
      < InvoiceSummary
        selectedInvoiceInfo={selectedInvoiceInfo}
        selectedCreditNotesInfo={selectedCreditNotesInfo}
      />
    );
  };

  return (
    <div className="invoice-selection-container">
      <h1>Selecciona una factura</h1>
      <InvoiceTable 
        invoices={recievedInvoices}
        handleInvoiceClick={handleInvoiceClick}
        type='recieved' 
      />
      {selectedInvoice && (
        <>
          <h1>Selecciona una nota de crédito</h1>
          <InvoiceTable 
            invoices={creditNotes}
            handleInvoiceClick={handleInvoiceClick}
            type='credit_note' 
          />
        </>  
      )}
      {selectedCreditNotes.length > 0 && (
        <div>
          {renderSummary()}
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
          {renderSummary()}
          <button onClick={closeModal}>Cerrar</button>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceSelection;
