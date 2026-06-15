// Generates branded PDF invoices issued by Eclipse Softworks (ZAR, 15% VAT).
// jsPDF is imported dynamically so it never runs during SSR.

import { formatMoney, currencyConf, DEFAULT_COUNTRY } from "./locale";

const BRAND = [79, 70, 229];   // indigo
const INK = [30, 41, 59];
const MUTED = [100, 116, 139];
const LINE = [226, 232, 240];
const GREEN = [22, 197, 94];

// money() resolves against the active country, set at the start of each export
let _country = DEFAULT_COUNTRY;
const fmt = (n) => formatMoney(n, _country);

const BILLER = {
  name: "Eclipse Softworks (Pty) Ltd",
  lines: ["12 Maude Street, Sandton", "Johannesburg, 2196", "South Africa", "VAT No: 4920288176", "billing@eclipsesoftworks.com"],
};
const CUSTOMER = {
  name: "Eclipse Softworks",
  lines: ["Attn: TR Mokwena", "Apex workspace · eclipsesoftworks.apex.io", "billing@eclipsesoftworks.com"],
};

function header(doc, W, M, title, sub) {
  doc.setFont("helvetica", "bold"); doc.setFontSize(24); doc.setTextColor(...BRAND);
  doc.text("Apex", M, 24);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...MUTED);
  doc.text("by Eclipse Softworks", M, 29.5);

  doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.setTextColor(...INK);
  doc.text(title, W - M, 23, { align: "right" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...MUTED);
  doc.text(sub, W - M, 29.5, { align: "right" });
  doc.setDrawColor(...LINE); doc.line(M, 38, W - M, 38);
}

function parties(doc, W, M) {
  let y = 50;
  doc.setFontSize(8); doc.setTextColor(...MUTED); doc.setFont("helvetica", "bold");
  doc.text("FROM", M, y);
  doc.text("BILL TO", W - M, y, { align: "right" });
  y += 6;
  doc.setFontSize(10.5); doc.setTextColor(...INK);
  doc.text(BILLER.name, M, y);
  doc.text(CUSTOMER.name, W - M, y, { align: "right" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...MUTED);
  BILLER.lines.forEach((l, i) => doc.text(l, M, y + 6 + i * 5));
  CUSTOMER.lines.forEach((l, i) => doc.text(l, W - M, y + 6 + i * 5, { align: "right" }));
  return y + 6 + Math.max(BILLER.lines.length, CUSTOMER.lines.length) * 5 + 8;
}

function paidStamp(doc, x, y, label) {
  doc.setFillColor(...GREEN); doc.roundedRect(x - 24, y - 4.5, 24, 6.5, 1.2, 1.2, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(255, 255, 255);
  doc.text(label.toUpperCase(), x - 12, y, { align: "center" });
}

function totals(doc, W, M, y, subtotal, vat, total) {
  const lx = W - M - 62, vx = W - M;
  doc.setFontSize(9.5); doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED); doc.text("Subtotal", lx, y); doc.setTextColor(...INK); doc.text(fmt(subtotal), vx, y, { align: "right" });
  y += 6; doc.setTextColor(...MUTED); doc.text("VAT (15%)", lx, y); doc.setTextColor(...INK); doc.text(fmt(vat), vx, y, { align: "right" });
  y += 3; doc.setDrawColor(...LINE); doc.line(lx, y, vx, y);
  y += 7; doc.setFont("helvetica", "bold"); doc.setFontSize(12.5); doc.setTextColor(...BRAND);
  doc.text("Total", lx, y); doc.text(fmt(total), vx, y, { align: "right" });
  return y;
}

function footer(doc, W, M, note) {
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(...MUTED);
  doc.text(note, M, 274);
  doc.text("Eclipse Softworks (Pty) Ltd · Registered in South Africa · billing@eclipsesoftworks.com", M, 282);
}

export async function generateInvoicePdf(inv, country = DEFAULT_COUNTRY) {
  _country = country;
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, M = 18;
  const total = inv.total, subtotal = total / 1.15, vat = total - subtotal, unit = subtotal / inv.seats;

  header(doc, W, M, "INVOICE", `No. ${inv.no}`);
  doc.setFontSize(9); doc.setTextColor(...MUTED); doc.setFont("helvetica", "normal");
  doc.text(`Issued: ${inv.date}`, W - M, 34.5, { align: "right" });
  let y = parties(doc, W, M);

  // table head
  doc.setFillColor(241, 242, 250); doc.rect(M, y, W - 2 * M, 9, "F");
  doc.setFontSize(8.5); doc.setTextColor(...MUTED); doc.setFont("helvetica", "bold");
  doc.text("DESCRIPTION", M + 3, y + 6);
  doc.text("SEATS", W - M - 62, y + 6, { align: "right" });
  doc.text("UNIT", W - M - 34, y + 6, { align: "right" });
  doc.text("AMOUNT", W - M - 3, y + 6, { align: "right" });
  y += 9;

  doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); doc.setTextColor(...INK);
  doc.text(`${inv.plan} plan — monthly subscription`, M + 3, y + 8);
  doc.setTextColor(...MUTED); doc.setFontSize(8.5);
  doc.text(`Billing period · ${inv.date}`, M + 3, y + 13);
  doc.setTextColor(...INK); doc.setFontSize(10.5);
  doc.text(String(inv.seats), W - M - 62, y + 8, { align: "right" });
  doc.text(fmt(unit), W - M - 34, y + 8, { align: "right" });
  doc.text(fmt(subtotal), W - M - 3, y + 8, { align: "right" });
  y += 18; doc.setDrawColor(...LINE); doc.line(M, y, W - M, y);

  const ty = totals(doc, W, M, y + 9, subtotal, vat, total);
  paidStamp(doc, M + 24, ty, inv.status);
  footer(doc, W, M, "Thank you for your business. Payment received in full — no action required.");
  doc.save(`Apex-Invoice-${inv.no}.pdf`);
}

export async function generateStatementPdf(invoices, country = DEFAULT_COUNTRY) {
  _country = country;
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, M = 18;
  header(doc, W, M, "STATEMENT", "Billing history");
  let y = parties(doc, W, M);

  doc.setFillColor(241, 242, 250); doc.rect(M, y, W - 2 * M, 9, "F");
  doc.setFontSize(8.5); doc.setTextColor(...MUTED); doc.setFont("helvetica", "bold");
  doc.text("INVOICE", M + 3, y + 6);
  doc.text("DATE", M + 48, y + 6);
  doc.text("DESCRIPTION", M + 86, y + 6);
  doc.text("STATUS", W - M - 38, y + 6, { align: "right" });
  doc.text("AMOUNT", W - M - 3, y + 6, { align: "right" });
  y += 9;

  let grand = 0;
  invoices.forEach((inv) => {
    grand += inv.total;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(...INK);
    doc.text(inv.no, M + 3, y + 7);
    doc.setTextColor(...MUTED); doc.text(inv.date, M + 48, y + 7);
    doc.setTextColor(...INK); doc.text(`${inv.plan} · ${inv.seats} seats`, M + 86, y + 7);
    doc.setTextColor(...GREEN); doc.text(inv.status, W - M - 38, y + 7, { align: "right" });
    doc.setTextColor(...INK); doc.text(fmt(inv.total), W - M - 3, y + 7, { align: "right" });
    y += 10; doc.setDrawColor(...LINE); doc.line(M, y, W - M, y);
  });

  y += 8; doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...BRAND);
  doc.text("Total billed", W - M - 62, y); doc.text(fmt(grand), W - M, y, { align: "right" });
  footer(doc, W, M, `Statement of ${invoices.length} invoices. All amounts in ${currencyConf(country).currency}, VAT inclusive.`);
  doc.save("Apex-Billing-Statement.pdf");
}
