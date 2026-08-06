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

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

export const generateOrderPDF = async (order: Order) => {
  const doc = new jsPDF();
  
  try {
    const logoUrl = localStorage.getItem('babadham_logo_image') || '/assets/logo.png';
    const logoImg = await loadImage(logoUrl);
    doc.addImage(logoImg, 'PNG', 14, 15, 20, 20); // x, y, w, h
  } catch (e) {
    console.error("Logo not found", e);
  }
  
  // Brand Header
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('BABA BAIDYANATH PRASADAM', 38, 22);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('AASTHA, SEVA AND SAMARPAN', 38, 27);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Baba Baidyanath Dham, Shivganga Path', 38, 33);
  doc.text('Deoghar, Jharkhand 814112, India', 38, 38);
  
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 174, 25);

  doc.setLineWidth(0.2);
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 45, 196, 45);

  // Order Details
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Order #${order.id.slice(-6).toUpperCase()}`, 14, 55);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDate(order.createdAt)}`, 14, 61);
  doc.text(`Payment: ${order.paymentStatus}`, 14, 67);
  doc.text(`Fulfillment: ${order.orderStatus.replace('_', ' ')}`, 14, 73);

  // Addresses
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed To:', 14, 85);
  doc.text('Shipped To:', 110, 85);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  // Billing
  const bill = order.billingAddress || order.address;
  if (bill) {
    doc.text(bill.fullName || 'N/A', 14, 91);
    doc.text(bill.email || 'N/A', 14, 96);
    doc.text(bill.phone || 'N/A', 14, 101);
    doc.text(bill.addressLine || '', 14, 106);
    doc.text(`${bill.city || ''}, ${bill.state || ''} ${bill.pincode || ''}`, 14, 111);
  }

  // Shipping
  const ship = order.address;
  if (ship) {
    doc.text(ship.fullName || 'N/A', 110, 91);
    doc.text(ship.phone || 'N/A', 110, 96);
    doc.text(ship.addressLine || '', 110, 101);
    doc.text(`${ship.city || ''}, ${ship.state || ''} ${ship.pincode || ''}`, 110, 106);
    doc.text('India', 110, 111);
  }

  // Items Table
  const tableData = (order.items || []).map(item => [
    item.product?.name || 'Unknown Item',
    item.quantity?.toString() || '1',
    `Rs. ${item.product?.price?.toLocaleString() || 0}`,
    `Rs. ${((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 125,
    head: [['Item', 'Quantity', 'Price', 'Total']],
    body: tableData,
    headStyles: { fillColor: [28, 8, 12], textColor: [255, 248, 240] },
    theme: 'grid',
    styles: { fontSize: 9 }
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Subtotal:', 140, finalY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Rs. ${order.subtotal?.toLocaleString() || order.totalAmount?.toLocaleString()}`, 170, finalY);

  doc.setFont('helvetica', 'bold');
  doc.text('Shipping:', 140, finalY + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Rs. ${order.shipping || 0}`, 170, finalY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Total:', 140, finalY + 16);
  doc.text(`Rs. ${order.totalAmount?.toLocaleString()}`, 170, finalY + 16);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('AASTHA, SEVA AND SAMARPAN - BABA BAIDYANATH PRASADAM', 105, 280, { align: 'center' });

  doc.save(`Order_${order.id.slice(-6).toUpperCase()}.pdf`);
};

export const generatePackingSlipPDF = async (order: Order) => {
  // 4x6 inches Thermal Label size (101.6mm x 152.4mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [101.6, 152.4]
  });

  try {
    const logoUrl = localStorage.getItem('babadham_logo_image') || '/assets/logo.png';
    const logoImg = await loadImage(logoUrl);
    // Assuming the thermal printer drivers will auto-dither the logo.
    doc.addImage(logoImg, 'PNG', 41.8, 8, 18, 18);
  } catch (e) {
    console.error("Logo not found", e);
  }

  // Header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('BABA BAIDYANATH PRASADAM', 50.8, 30, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('AASTHA, SEVA AND SAMARPAN', 50.8, 34, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PACKING SLIP', 50.8, 42, { align: 'center' });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order: #${order.id.slice(-6).toUpperCase()}`, 10, 50);
  doc.text(`Date: ${formatDate(order.createdAt)}`, 10, 55);

  doc.setLineWidth(0.3);
  doc.line(10, 59, 91.6, 59);

  // Ship To
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SHIP TO:', 10, 65);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const ship = order.address;
  if (ship) {
    doc.text(ship.fullName || 'N/A', 10, 71);
    doc.text(ship.phone || 'N/A', 10, 76);
    doc.text(ship.addressLine || '', 10, 81);
    doc.text(`${ship.city || ''}, ${ship.state || ''} ${ship.pincode || ''}`, 10, 86);
  }

  doc.line(10, 91, 91.6, 91);

  // Items
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ITEMS TO PACK', 10, 98);

  const tableData = (order.items || []).map(item => [
    item.quantity?.toString() || '1',
    item.product?.name || 'Unknown Item'
  ]);

  autoTable(doc, {
    startY: 102,
    head: [['Qty', 'Item Name']],
    body: tableData,
    theme: 'plain',
    headStyles: { fillColor: false, textColor: 0, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 1.5 },
    columnStyles: { 0: { cellWidth: 15 } }
  });

  doc.save(`PackingSlip_${order.id.slice(-6).toUpperCase()}.pdf`);
};
