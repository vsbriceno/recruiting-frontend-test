import React from 'react';

const InvoiceTable= (props) => {
    const {invoices, type, handleInvoiceClick } = props;
  
    return (
        <table>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                onClick={() => handleInvoiceClick(invoice.id, type)}
              >
                <td>{invoice.id}</td>
                <td>{invoice.amount}</td>
                <td>{invoice.type}</td>
              </tr>
            ))}
        </tbody>
      </table>
    );
};

export default InvoiceTable;