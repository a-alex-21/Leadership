/* Local presentation controller. No dependencies, server, or network requests. */
(() => {
  'use strict';

  const SLIDE_LIMIT_SECONDS = 15 * 60;
  const SWIPE_DISTANCE = 60;
  const select = (selector) => document.querySelector(selector);
  const slides = [...document.querySelectorAll('.slide')];
  const ui = {
    previous: select('#prev'),
    next: select('#next'),
    counter: select('#counter'),
    select: select('#slideSelect'),
    progress: select('#progress'),
    announcement: select('#live'),
    overview: select('#overview'),
    overviewList: select('#overviewList'),
    notes: select('#notes'),
    noteText: select('#noteText'),
    help: select('#help'),
    fullscreen: select('#fullBtn'),
    timer: select('#timer'),
    deck: select('.deck'),
  };

  const slideContent = slides.map((slide) => ({
    title: slide.querySelector('h1, h2').textContent.trim().replace(/\s+/g, ' '),
    notes: slide.querySelector('.speaker-notes')?.textContent.trim() ?? '',
  }));

  let currentSlide = 0;

  // Navigation: one function owns slide visibility, controls, notes, and URL state.
  function showSlide(index) {
    const safeIndex = Number.isFinite(index) ? Math.trunc(index) : 0;
    currentSlide = Math.max(0, Math.min(slides.length - 1, safeIndex));

    slides.forEach((slide, position) => {
      const active = position === currentSlide;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });

    const { title, notes } = slideContent[currentSlide];
    const number = currentSlide + 1;
    ui.counter.textContent = `${String(number).padStart(2, '0')} / ${slides.length}`;
    ui.previous.disabled = currentSlide === 0;
    ui.next.disabled = currentSlide === slides.length - 1;
    ui.select.value = String(currentSlide);
    ui.progress.style.width = `${(number / slides.length) * 100}%`;
    ui.noteText.textContent = notes;
    ui.announcement.textContent = `Slide ${number}: ${title}`;

    const hash = `#${number}`;
    if (location.hash !== hash) history.replaceState(null, '', hash);
  }

  function indexFromHash() {
    // Reject malformed values such as #4abc instead of partially parsing them.
    return /^#\d+$/.test(location.hash) ? Number(location.hash.slice(1)) - 1 : 0;
  }

  function createSlideNavigation() {
    slideContent.forEach(({ title }, index) => {
      const label = `${String(index + 1).padStart(2, '0')} · ${title}`;
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = label;
      ui.select.append(option);

      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', () => {
        showSlide(index);
        ui.overview.close();
      });
      ui.overviewList.append(button);
    });
  }

  // Dialogs use the browser's focus trapping and Escape handling.
  function openDialog(dialog) {
    if (!document.querySelector('dialog[open]')) dialog.showModal();
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.body.requestFullscreen) {
        await document.body.requestFullscreen();
      } else {
        alert('Použijte režim celé obrazovky v nabídce prohlížeče.');
      }
    } catch {
      alert('Fullscreen se nepodařilo otevřít. Použijte nabídku prohlížeče.');
    }
  }

  // Keyboard: preserve form controls, native button activation, and browser shortcuts.
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      document.body.classList.remove('blackout');
      return;
    }

    const target = event.target;
    const editing = target.isContentEditable || /INPUT|SELECT|TEXTAREA/.test(target.tagName);
    const activatingButton = target.tagName === 'BUTTON' && [' ', 'Enter'].includes(event.key);
    if (editing || activatingButton || event.ctrlKey || event.metaKey || event.altKey) return;
    if (document.querySelector('dialog[open]')) return;

    const key = event.key.toLowerCase();
    if (document.body.classList.contains('blackout')) {
      if (key === 'b') document.body.classList.remove('blackout');
      event.preventDefault();
      return;
    }

    const actions = {
      arrowright: () => showSlide(currentSlide + 1),
      arrowdown: () => showSlide(currentSlide + 1),
      pagedown: () => showSlide(currentSlide + 1),
      ' ': () => showSlide(currentSlide + 1),
      arrowleft: () => showSlide(currentSlide - 1),
      arrowup: () => showSlide(currentSlide - 1),
      pageup: () => showSlide(currentSlide - 1),
      home: () => showSlide(0),
      end: () => showSlide(slides.length - 1),
      f: toggleFullscreen,
      o: () => openDialog(ui.overview),
      n: () => openDialog(ui.notes),
      b: () => document.body.classList.add('blackout'),
    };

    if (actions[key]) {
      event.preventDefault();
      actions[key]();
    }
  }

  // Touch navigation ignores vertical scrolling, multi-touch, and cancelled gestures.
  let touchStart = null;

  function handleTouchStart(event) {
    touchStart = event.touches.length === 1
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
      : null;
  }

  function handleTouchEnd(event) {
    if (!touchStart || event.touches.length > 0) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    touchStart = null;

    if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
      showSlide(currentSlide + (dx < 0 ? 1 : -1));
    }
  }

  // Timer uses a monotonic clock and only refreshes while running.
  const timer = { elapsedMs: 0, startedAt: null, interval: null };

  function renderTimer() {
    const activeMs = timer.startedAt === null ? 0 : performance.now() - timer.startedAt;
    const seconds = Math.floor((timer.elapsedMs + activeMs) / 1000);
    const minutesText = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secondsText = String(seconds % 60).padStart(2, '0');
    const running = timer.startedAt !== null;

    ui.timer.textContent = `${running ? 'Ⅱ' : '▶'} ${minutesText}:${secondsText} / 15:00`;
    ui.timer.classList.toggle('over-limit', seconds >= SLIDE_LIMIT_SECONDS);
    ui.timer.setAttribute('aria-pressed', String(running));
    ui.timer.title = running ? 'Pozastavit časomíru' : 'Spustit časomíru';
  }

  function toggleTimer() {
    if (timer.startedAt === null) {
      timer.startedAt = performance.now();
      timer.interval = window.setInterval(renderTimer, 500);
    } else {
      timer.elapsedMs += performance.now() - timer.startedAt;
      timer.startedAt = null;
      window.clearInterval(timer.interval);
      timer.interval = null;
    }
    renderTimer();
  }

  function resetTimer() {
    window.clearInterval(timer.interval);
    timer.elapsedMs = 0;
    timer.startedAt = null;
    timer.interval = null;
    renderTimer();
  }

  // Bind controls once, then initialize from a bookmarked slide number.
  ui.previous.addEventListener('click', () => showSlide(currentSlide - 1));
  ui.next.addEventListener('click', () => showSlide(currentSlide + 1));
  ui.select.addEventListener('change', () => showSlide(Number(ui.select.value)));
  select('#overviewBtn').addEventListener('click', () => openDialog(ui.overview));
  select('#notesBtn').addEventListener('click', () => openDialog(ui.notes));
  select('#helpBtn').addEventListener('click', () => openDialog(ui.help));
  select('#pdfBtn').addEventListener('click', () => window.presentationPdf.download());
  ui.fullscreen.addEventListener('click', toggleFullscreen);
  ui.timer.addEventListener('click', toggleTimer);
  select('#resetTimer').addEventListener('click', resetTimer);

  document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog').close());
  });

  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('fullscreenchange', () => {
    ui.fullscreen.textContent = document.fullscreenElement ? 'Zmenšit ⛶' : 'Fullscreen ⛶';
  });
  document.body.addEventListener('click', () => document.body.classList.remove('blackout'));
  ui.deck.addEventListener('touchstart', handleTouchStart, { passive: true });
  ui.deck.addEventListener('touchend', handleTouchEnd, { passive: true });
  ui.deck.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  window.addEventListener('hashchange', () => showSlide(indexFromHash()));

  createSlideNavigation();
  showSlide(indexFromHash());
  renderTimer();
})();
