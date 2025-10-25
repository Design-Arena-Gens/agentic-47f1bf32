import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportAsPDF(element: HTMLElement, filename = "report.pdf") {
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
  const imgWidth = canvas.width * ratio;
  const imgHeight = canvas.height * ratio;
  const x = (pageWidth - imgWidth) / 2;
  const y = 20;
  pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
  pdf.save(filename);
}

export function exportAsHTML(html: string, filename = "report.html") {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
}

export function exportAsMarkdown(markdown: string, filename = "report.md") {
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
