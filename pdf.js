function pdfOlustur(){
  let s = pdfSayfa.value;
  fetch(API_URL+"?sayfa="+encodeURIComponent(s))
  .then(r=>r.json()).then(d=>{
    const { jsPDF } = window.jspdf;
    let doc=new jsPDF();
    let y=10;
    d.veriler.forEach(r=>{
      doc.text(r.join(" | "),10,y);
      y+=7;
    });
    doc.save(s+".pdf");
  });
}
