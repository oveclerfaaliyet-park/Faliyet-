function pdfOlustur(){
  fetch(API_URL+"?sayfa="+pdfSayfa.value)
  .then(r=>r.json()).then(d=>{
    const { jsPDF } = window.jspdf;
    let doc=new jsPDF();
    let y=10;
    d.veriler.forEach(r=>{
      doc.text(r.join(" | "),10,y);
      y+=8;
    });
    doc.save(pdfSayfa.value+".pdf");
  });
}
