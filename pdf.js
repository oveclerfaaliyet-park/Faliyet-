function pdfOlustur(sayfa, bas, bit){
  fetch(URL+"?sayfa="+sayfa)
  .then(r=>r.json())
  .then(data=>{
    let doc = new jsPDF();
    data.veriler.forEach((v,i)=>{
      let tarih=v[0]; if(tarih<bas || tarih>bit) return;
      doc.text(v.join(" | "),10,10+i*10);
    });
    doc.save(sayfa+".pdf");
  });
}
