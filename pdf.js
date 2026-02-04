function pdfYap(tabloId){
  const { jsPDF } = window.jspdf;
  let doc=new jsPDF();
  doc.text("Rapor",10,10);
  let rows=[];
  document.querySelectorAll("#"+tabloId+" tr").forEach(tr=>{
    let r=[];
    tr.querySelectorAll("td").forEach(td=>r.push(td.innerText));
    rows.push(r);
  });
  doc.autoTable({ startY:20, body:rows });
  doc.save("rapor.pdf");
}
