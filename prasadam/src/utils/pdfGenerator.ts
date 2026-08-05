import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../types/ecommerce';

// Helper to format date
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export const generateOrderPDF = (order: Order) => {
  const doc = new jsPDF();
  
  // Brand Header
  doc.setFillColor(28, 8, 12); // #1C080C (Dark brand color)
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 248, 240);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PRASADAM', 14, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Order Invoice', 170, 25);

  // Order Details
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Order #${order.id.slice(-6).toUpperCase()}`, 14, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDate(order.createdAt)}`, 14, 62);
  doc.text(`Payment Status: ${order.paymentStatus}`, 14, 68);
  doc.text(`Fulfillment Status: ${order.orderStatus}`, 14, 74);

  // Addresses
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed To:', 14, 90);
  doc.text('Shipped To:', 110, 90);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Billing
  const bill = order.billingAddress || order.address;
  if (bill) {
    doc.text(bill.fullName || 'N/A', 14, 97);
    doc.text(bill.email || 'N/A', 14, 103);
    doc.text(bill.phone || 'N/A', 14, 109);
    doc.text(bill.addressLine || '', 14, 115);
    doc.text(`${bill.city || ''}, ${bill.state || ''} ${bill.pincode || ''}`, 14, 121);
  }

  // Shipping
  const ship = order.address;
  if (ship) {
    doc.text(ship.fullName || 'N/A', 110, 97);
    doc.text(ship.phone || 'N/A', 110, 103);
    doc.text(ship.addressLine || '', 110, 109);
    doc.text(`${ship.city || ''}, ${ship.state || ''} ${ship.pincode || ''}`, 110, 115);
    doc.text('India', 110, 121);
  }

  // Items Table
  const tableData = (order.items || []).map(item => [
    item.product?.name || 'Unknown Item',
    item.quantity?.toString() || '1',
    `Rs. ${item.product?.price?.toLocaleString() || 0}`,
    `Rs. ${((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 135,
    head: [['Item', 'Quantity', 'Price', 'Total']],
    body: tableData,
    headStyles: { fillColor: [28, 8, 12], textColor: [255, 248, 240] },
    theme: 'grid'
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Subtotal:', 140, finalY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Rs. ${order.subtotal?.toLocaleString() || order.totalAmount?.toLocaleString()}`, 170, finalY);

  doc.setFont('helvetica', 'bold');
  doc.text('Shipping:', 140, finalY + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Rs. ${order.shipping || 0}`, 170, finalY + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', 140, finalY + 18);
  doc.text(`Rs. ${order.totalAmount?.toLocaleString()}`, 170, finalY + 18);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for choosing Prasadam.', 105, 280, { align: 'center' });

  doc.save(`Order_${order.id.slice(-6).toUpperCase()}.pdf`);
};

export const generatePackingSlipPDF = (order: Order) => {
  // 4x6 inches Thermal Label size (101.6mm x 152.4mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [101.6, 152.4]
  });

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PACKING SLIP', 50.8, 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order: #${order.id.slice(-6).toUpperCase()}`, 10, 25);
  doc.text(`Date: ${formatDate(order.createdAt)}`, 10, 31);

  doc.setLineWidth(0.5);
  doc.line(10, 35, 91.6, 35);

  // Ship To
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SHIP TO:', 10, 43);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const ship = order.address;
  if (ship) {
    doc.text(ship.fullName || 'N/A', 10, 50);
    doc.text(ship.phone || 'N/A', 10, 56);
    doc.text(ship.addressLine || '', 10, 62);
    doc.text(`${ship.city || ''}, ${ship.state || ''} ${ship.pincode || ''}`, 10, 68);
  }

  doc.line(10, 74, 91.6, 74);

  // Items
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ITEMS TO PACK', 10, 82);

  const tableData = (order.items || []).map(item => [
    item.quantity?.toString() || '1',
    item.product?.name || 'Unknown Item'
  ]);

  autoTable(doc, {
    startY: 86,
    head: [['Qty', 'Item Name']],
    body: tableData,
    theme: 'plain',
    headStyles: { fillColor: false, textColor: 0, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: { 0: { cellWidth: 15 } }
  });

  doc.save(`PackingSlip_${order.id.slice(-6).toUpperCase()}.pdf`);
};
