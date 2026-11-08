# Lokální knihovny pro export PDF

Načítají se až po kliknutí na Stažení PDF. Prezentace nevyužívá CDN za běhu.

- `html2canvas.min.js`: html2canvas 1.4.1, MIT, Niklas von Hertzen.
  Zdroj: https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
  Dokumentace: https://html2canvas.hertzen.com/configuration/
- `jspdf.umd.min.js`: jsPDF 3.0.4, MIT, James Hall a přispěvatelé.
  Zdroj: https://cdn.jsdelivr.net/npm/jspdf@3.0.4/dist/jspdf.umd.min.js
  Dokumentace: https://parallax.github.io/jsPDF/docs/

Licenční hlavičky jsou zachovány v souborech. Vstupem jsou pouze místní slidy
prezentace. `assets/pdf-images.js` je odvozený soubor s obrázky pro bezpečné
vykreslení do canvasu i při otevření přes `file://`; není ručně editovaný zdroj.
