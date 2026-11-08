/* Direct, offline 16:9 PDF download. Libraries and image data load only on demand. */
(() => {
  'use strict';

  const PAGE_MM = [320, 180];
  const CANVAS_PX = { width: 1600, height: 900 };
  const SCRIPT_URL = document.currentScript.src;
  const loadedScripts = new Map();
  let exporting = false;

  function loadScript(relativePath) {
    const url = new URL(relativePath, SCRIPT_URL).href;
    if (!loadedScripts.has(url)) {
      loadedScripts.set(url, new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = () => {
          script.remove();
          loadedScripts.delete(url);
          reject(new Error('Chybí soubor pro export PDF. Přiložte celou složku assets.'));
        };
        document.head.append(script);
      }));
    }
    return loadedScripts.get(url);
  }

  async function createExportFrame() {
    const frame = document.createElement('iframe');
    frame.title = 'Příprava PDF';
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    frame.className = 'pdf-export-frame';
    frame.width = CANVAS_PX.width;
    frame.height = CANVAS_PX.height;
    document.body.append(frame);

    const doc = frame.contentDocument;
    doc.documentElement.lang = 'cs';
    doc.body.className = 'pdf-export';
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('styles.css', SCRIPT_URL).href;
    const ready = new Promise((resolve, reject) => {
      link.onload = resolve;
      link.onerror = () => reject(new Error('Nepodařilo se načíst styl prezentace.'));
    });
    doc.head.append(link);
    const deck = doc.createElement('div');
    deck.className = 'deck';
    doc.body.append(deck);
    try {
      await ready;
      await doc.fonts.ready;
      return { frame, doc, deck };
    } catch (error) {
      frame.remove();
      throw error;
    }
  }

  async function prepareSlide(original, frameDocument, deck) {
    const slide = frameDocument.importNode(original, true);
    slide.classList.add('active');
    slide.removeAttribute('aria-hidden');
    slide.querySelectorAll('.speaker-notes').forEach(node => node.remove());
    const images = [...slide.querySelectorAll('img')];
    for (const image of images) {
      const path = image.getAttribute('src');
      if (!window.presentationPdfImages[path]) {
        throw new Error(`Chybí obrázek pro PDF: ${path}`);
      }
      // Data URLs prevent file:// canvas security restrictions, without a server.
      image.src = window.presentationPdfImages[path];
      image.removeAttribute('srcset');
      image.loading = 'eager';
    }
    deck.replaceChildren(slide);
    await Promise.all(images.map(image => image.decode()));
    if (slide.scrollHeight > CANVAS_PX.height + 2 || slide.scrollWidth > CANVAS_PX.width + 2) {
      throw new Error('Obsah přesahuje rozměry slidu. Zkraťte obsah nebo upravte rozložení.');
    }
    return slide;
  }

  function addCitationLinks(pdf, slide) {
    const origin = slide.getBoundingClientRect();
    const scaleX = PAGE_MM[0] / CANVAS_PX.width;
    const scaleY = PAGE_MM[1] / CANVAS_PX.height;
    for (const link of slide.querySelectorAll('a[href^="https://"]')) {
      for (const rect of link.getClientRects()) {
        pdf.link((rect.left - origin.left) * scaleX, (rect.top - origin.top) * scaleY,
          rect.width * scaleX, rect.height * scaleY, { url: link.href });
      }
    }
  }

  async function download() {
    if (exporting) return;
    exporting = true;
    const button = document.querySelector('#pdfBtn');
    const dialog = document.querySelector('#pdfProgress');
    const message = document.querySelector('#pdfMessage');
    const progress = document.querySelector('#pdfMeter');
    const cancelButton = document.querySelector('#pdfCancel');
    const slides = [...document.querySelectorAll('main .slide')];
    let cancelled = false;
    let frame;
    let slideNumber = 0;

    const cancel = () => { cancelled = true; message.textContent = 'Ruším export…'; };
    const escape = event => { event.preventDefault(); cancel(); };
    cancelButton.addEventListener('click', cancel);
    dialog.addEventListener('cancel', escape);
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    progress.max = slides.length;
    progress.value = 0;
    message.textContent = 'Připravuji PDF…';
    dialog.showModal();

    try {
      await Promise.all([
        loadScript('vendor/html2canvas.min.js'),
        loadScript('vendor/jspdf.umd.min.js'),
        loadScript('pdf-images.js'),
      ]);
      if (cancelled) return;
      const stage = await createExportFrame();
      frame = stage.frame;
      const pdf = new window.jspdf.jsPDF({
        orientation: 'landscape', unit: 'mm', format: PAGE_MM, compress: true,
      });
      pdf.setProperties({ title: 'Konflikt na pracovišti', subject: 'Leadership – prezentace', creator: 'Lokální HTML prezentace' });
      pdf.setDisplayMode('fullwidth', 'single', 'UseNone');

      for (const [index, original] of slides.entries()) {
        if (cancelled) return;
        slideNumber = index + 1;
        message.textContent = `Připravuji slide ${slideNumber} z ${slides.length}…`;
        const slide = await prepareSlide(original, stage.doc, stage.deck);
        const canvas = await window.html2canvas(slide, {
          width: CANVAS_PX.width, height: CANVAS_PX.height,
          windowWidth: CANVAS_PX.width, windowHeight: CANVAS_PX.height,
          scale: 2, backgroundColor: '#ffffff', logging: false,
          scrollX: 0, scrollY: 0,
        });
        if (cancelled) return;
        if (index > 0) pdf.addPage(PAGE_MM, 'landscape');
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.96), 'JPEG', 0, 0, ...PAGE_MM);
        addCitationLinks(pdf, slide);
        canvas.width = 1;
        canvas.height = 1;
        progress.value = slideNumber;
      }
      if (!cancelled) pdf.save('Konflikt-na-pracovisti.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
      if (!cancelled) {
        alert(`PDF se nepodařilo vytvořit${slideNumber ? ` (slide ${slideNumber})` : ''}. ${error.message}`);
      }
    } finally {
      frame?.remove();
      dialog.close();
      cancelButton.removeEventListener('click', cancel);
      dialog.removeEventListener('cancel', escape);
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.focus();
      exporting = false;
    }
  }

  window.presentationPdf = Object.freeze({ download });
})();
