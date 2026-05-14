const doc = document;
const body = doc.body;

const loadingScreen = doc.querySelector('.loading-screen');
const siteHeader = doc.querySelector('.site-header');
const menuToggle = doc.querySelector('.menu-toggle');
const mainNav = doc.querySelector('#main-nav');
const navLinks = doc.querySelectorAll('[data-nav]');
const navRail = doc.querySelector('.nav-rail');
const chapterIdNode = doc.querySelector('#chapter-id');
const chapterNameNode = doc.querySelector('#chapter-name');
const chapterFillNode = doc.querySelector('#chapter-fill');
const revealNodes = doc.querySelectorAll('.reveal');
const progressBar = doc.querySelector('#progress-bar');
const heroSection = doc.querySelector('.hero');
const yearNode = doc.querySelector('#year');
const cursorDot = doc.querySelector('.cursor-dot');
const cursorRing = doc.querySelector('.cursor-ring');
const magneticNodes = doc.querySelectorAll('.magnetic');
const serviceTrack = doc.querySelector('.service-track');
const servicePanels = doc.querySelectorAll('.service-panel');
const servicePrev = doc.querySelector('#service-prev');
const serviceNext = doc.querySelector('#service-next');
const serviceCurrent = doc.querySelector('#service-current');
const methodSteps = doc.querySelectorAll('.method-step');
const methodNodes = doc.querySelectorAll('.method-nodes li');
const methodProgressLine = doc.querySelector('#method-progress-line');
const methodCurrentLabel = doc.querySelector('#method-current-label');
const countNodes = doc.querySelectorAll('[data-count]');
const caseCards = doc.querySelectorAll('.case-card');
const chapterSections = doc.querySelectorAll('.section');

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

window.addEventListener('load', () => {
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 620);
  }
});

function updateHeaderAndProgress() {
  const y = window.scrollY;
  if (siteHeader) {
    if (y > 42) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  if (progressBar) {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (y / total) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  if (heroSection) {
    const heroMax = Math.max(window.innerHeight * 0.9, heroSection.offsetHeight * 0.7);
    const t = Math.min(1, Math.max(0, y / heroMax));
    document.documentElement.style.setProperty('--hero-shift', `${t * 56}px`);
    document.documentElement.style.setProperty('--hero-fade', `${1 - t * 0.28}`);
    document.documentElement.style.setProperty('--hero-blur', `${t * 2.4}px`);
  }
}

updateHeaderAndProgress();
window.addEventListener('scroll', updateHeaderAndProgress, { passive: true });

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setActiveNav() {
  const sectionIds = ['nosotros', 'servicios', 'proceso', 'filosofia', 'casos', 'contacto'];
  let active = sectionIds[0];

  sectionIds.forEach((id) => {
    const el = doc.getElementById(id);
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.36) {
      active = id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `#${active}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  updateNavRail();
  updateChapterEngine();
}

function updateChapterEngine() {
  const chapterLabels = {
    top: { id: '00', name: 'Inicio' },
    nosotros: { id: '01', name: 'Mercado' },
    servicios: { id: '02', name: 'Soluciones' },
    proceso: { id: '03', name: 'Método' },
    filosofia: { id: '04', name: 'Filosofía' },
    casos: { id: '05', name: 'Casos' },
    contacto: { id: '06', name: 'Cierre' },
  };

  let activeKey = 'top';
  const pivot = window.innerHeight * 0.44;

  ['nosotros', 'servicios', 'proceso', 'filosofia', 'casos', 'contacto'].forEach((id) => {
    const section = doc.getElementById(id);
    if (!section) {
      return;
    }
    const rect = section.getBoundingClientRect();
    if (rect.top <= pivot) {
      activeKey = id;
    }
  });

  chapterSections.forEach((section) => {
    section.classList.toggle('chapter-active', section.id === activeKey || (activeKey === 'top' && section.classList.contains('hero')));
  });

  const chapter = chapterLabels[activeKey];
  if (!chapter) {
    return;
  }

  if (chapterIdNode) {
    chapterIdNode.textContent = chapter.id;
  }
  if (chapterNameNode) {
    chapterNameNode.textContent = chapter.name;
  }
  if (chapterFillNode) {
    const numeric = Number(chapter.id);
    const progress = (numeric / 6) * 100;
    chapterFillNode.style.height = `${progress}%`;
  }
}

function updateNavRail() {
  if (!mainNav || !navRail || window.innerWidth <= 900) {
    return;
  }

  const activeLink = mainNav.querySelector('a[data-nav].active');
  if (!activeLink) {
    navRail.style.opacity = '0';
    return;
  }

  const parentRect = mainNav.getBoundingClientRect();
  const linkRect = activeLink.getBoundingClientRect();
  navRail.style.opacity = '1';
  navRail.style.width = `${linkRect.width}px`;
  navRail.style.transform = `translateX(${linkRect.left - parentRect.left}px)`;
}

setActiveNav();
window.addEventListener('scroll', setActiveNav, { passive: true });
window.addEventListener('resize', updateNavRail);

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));

  const countObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  countNodes.forEach((node) => countObserver.observe(node));

  const caseObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('chart-visible');
          animateCaseLine(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  caseCards.forEach((card) => caseObserver.observe(card));

  const chapterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    },
    {
      threshold: 0.2,
      rootMargin: '-5% 0px -20% 0px',
    }
  );

  chapterSections.forEach((section) => chapterObserver.observe(section));

  const methodObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        const idx = Number(entry.target.getAttribute('data-step-index'));
        if (Number.isNaN(idx)) {
          return;
        }
        setMethodActive(idx);
      });
    },
    {
      threshold: 0.58,
      rootMargin: '-18% 0px -30% 0px',
    }
  );

  methodSteps.forEach((step) => methodObserver.observe(step));
} else {
  revealNodes.forEach((node) => node.classList.add('visible'));
  countNodes.forEach((node) => animateCounter(node));
  caseCards.forEach((card) => {
    card.classList.add('chart-visible');
    animateCaseLine(card);
  });
  chapterSections.forEach((section) => section.classList.add('in-view'));
  setMethodActive(0);
}

function setMethodActive(index) {
  const labels = ['Analizar', 'Estructurar', 'Diseñar', 'Sistematizar', 'Automatizar', 'Escalar'];
  methodSteps.forEach((step) => {
    const stepIndex = Number(step.getAttribute('data-step-index'));
    step.classList.toggle('is-active', stepIndex === index);
    step.classList.toggle('is-past', stepIndex < index);
    step.classList.toggle('is-future', stepIndex > index);
  });

  methodNodes.forEach((node, nodeIndex) => {
    node.classList.toggle('is-active', nodeIndex === index);
  });

  if (methodProgressLine) {
    const progress = ((index + 1) / 6) * 100;
    methodProgressLine.style.height = `${progress}%`;
  }

  if (methodCurrentLabel) {
    methodCurrentLabel.textContent = labels[index] || labels[0];
  }
}

setMethodActive(0);
updateChapterEngine();

function animateCounter(node) {
  const target = Number(node.getAttribute('data-count')) || 0;
  const prefix = node.getAttribute('data-prefix') || '';
  const duration = 1300;
  const start = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    node.textContent = `${prefix}${Math.round(target * eased)}`;
    if (t < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function splitHeadline() {
  const title = doc.querySelector('[data-split]');
  if (!title) {
    return;
  }

  const raw = title.innerHTML;
  const tokens = raw.split(/(\s+)/);
  title.innerHTML = '';

  let delay = 0;
  tokens.forEach((token) => {
    if (token.trim().length === 0) {
      title.appendChild(doc.createTextNode(token));
      return;
    }

    const span = doc.createElement('span');
    span.className = 'word';
    span.style.animationDelay = `${delay}ms`;

    if (token.includes('<em>') || token.includes('</em>')) {
      const wrap = doc.createElement('span');
      wrap.innerHTML = token;
      span.innerHTML = wrap.textContent || '';
      span.style.color = 'var(--gold)';
    } else {
      span.textContent = token;
    }

    title.appendChild(span);
    delay += 70;
  });
}

splitHeadline();

function initCursor() {
  if (window.matchMedia('(pointer: fine)').matches === false) {
    return;
  }

  body.classList.add('cursor-enabled');
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let rx = x;
  let ry = y;

  window.addEventListener('mousemove', (event) => {
    x = event.clientX;
    y = event.clientY;
    if (cursorDot) {
      cursorDot.style.transform = `translate(${x}px, ${y}px)`;
    }
  });

  function animate() {
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    if (cursorRing) {
      cursorRing.style.transform = `translate(${rx}px, ${ry}px)`;
    }
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

initCursor();

magneticNodes.forEach((node) => {
  node.addEventListener('mousemove', (event) => {
    if (window.matchMedia('(pointer: fine)').matches === false) {
      return;
    }
    const rect = node.getBoundingClientRect();
    const mx = event.clientX - rect.left - rect.width / 2;
    const my = event.clientY - rect.top - rect.height / 2;
    node.style.transform = `translate(${mx * 0.12}px, ${my * 0.12}px)`;
  });

  node.addEventListener('mouseleave', () => {
    node.style.transform = 'translate(0, 0)';
  });
});

let serviceActiveIndex = 0;

function formatServiceIndex(index) {
  return String(index + 1).padStart(2, '0');
}

function updateServiceControls(index) {
  if (serviceCurrent) {
    serviceCurrent.textContent = formatServiceIndex(index);
  }
  if (servicePrev) {
    servicePrev.disabled = index <= 0;
  }
  if (serviceNext) {
    serviceNext.disabled = index >= servicePanels.length - 1;
  }
}

function scrollToService(index, behavior = 'smooth') {
  if (!serviceTrack || servicePanels.length === 0) {
    return;
  }

  const nextIndex = Math.max(0, Math.min(index, servicePanels.length - 1));
  serviceActiveIndex = nextIndex;
  const target = servicePanels[nextIndex];

  serviceTrack.scrollTo({
    left: target.offsetLeft,
    behavior,
  });

  servicePanels.forEach((panel, panelIndex) => {
    panel.classList.toggle('is-active', panelIndex === nextIndex);
  });

  updateServiceControls(nextIndex);
}

function updateActiveServicePanel() {
  if (!serviceTrack || servicePanels.length === 0 || window.innerWidth < 1200) {
    updateServiceControls(0);
    return;
  }

  const center = serviceTrack.scrollLeft + serviceTrack.clientWidth / 2;
  let closestIndex = 0;
  let minDist = Number.POSITIVE_INFINITY;

  servicePanels.forEach((panel, index) => {
    const panelCenter = panel.offsetLeft + panel.offsetWidth / 2;
    const dist = Math.abs(panelCenter - center);
    if (dist < minDist) {
      minDist = dist;
      closestIndex = index;
    }
  });

  serviceActiveIndex = closestIndex;
  servicePanels.forEach((panel, index) => {
    panel.classList.toggle('is-active', index === closestIndex);
  });

  updateServiceControls(closestIndex);
}

if (serviceTrack) {
  let dragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  serviceTrack.addEventListener('scroll', updateActiveServicePanel, { passive: true });
  serviceTrack.addEventListener('keydown', (event) => {
    if (window.innerWidth < 1200) {
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollToService(serviceActiveIndex + 1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollToService(serviceActiveIndex - 1);
    }
  });

  serviceTrack.addEventListener('pointerdown', (event) => {
    if (window.innerWidth < 1200 || event.pointerType === 'touch') {
      return;
    }
    dragging = true;
    dragStartX = event.clientX;
    dragStartScroll = serviceTrack.scrollLeft;
    serviceTrack.classList.add('is-dragging');
    serviceTrack.setPointerCapture(event.pointerId);
  });

  serviceTrack.addEventListener('pointermove', (event) => {
    if (!dragging) {
      return;
    }
    const delta = event.clientX - dragStartX;
    serviceTrack.scrollLeft = dragStartScroll - delta;
  });

  function stopServiceDrag(event) {
    if (!dragging) {
      return;
    }
    dragging = false;
    serviceTrack.classList.remove('is-dragging');
    if (event && serviceTrack.hasPointerCapture(event.pointerId)) {
      serviceTrack.releasePointerCapture(event.pointerId);
    }
    scrollToService(serviceActiveIndex);
  }

  serviceTrack.addEventListener('pointerup', stopServiceDrag);
  serviceTrack.addEventListener('pointercancel', stopServiceDrag);
  serviceTrack.addEventListener('pointerleave', stopServiceDrag);

  if (servicePrev) {
    servicePrev.addEventListener('click', () => {
      scrollToService(serviceActiveIndex - 1);
    });
  }

  if (serviceNext) {
    serviceNext.addEventListener('click', () => {
      scrollToService(serviceActiveIndex + 1);
    });
  }

  window.addEventListener('resize', updateActiveServicePanel);
  scrollToService(0, 'auto');
}

servicePanels.forEach((panel) => {
  panel.addEventListener('mousemove', (event) => {
    if (window.matchMedia('(pointer: fine)').matches === false) {
      return;
    }

    const rect = panel.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const nx = (x / rect.width) * 100;
    const ny = (y / rect.height) * 100;
    const dx = x - rect.width / 2;
    const dy = y - rect.height / 2;

    panel.style.setProperty('--mx', `${nx}%`);
    panel.style.setProperty('--my', `${ny}%`);
    panel.style.setProperty('--tilt-x', `${-(dy / rect.height) * 12}deg`);
    panel.style.setProperty('--tilt-y', `${(dx / rect.width) * 12}deg`);
  });

  panel.addEventListener('mouseleave', () => {
    panel.style.setProperty('--mx', '50%');
    panel.style.setProperty('--my', '50%');
    panel.style.setProperty('--tilt-x', '0deg');
    panel.style.setProperty('--tilt-y', '0deg');
  });
});

function animateCaseLine(card) {
  const line = card.querySelector('.sparkline .line');
  if (!line) {
    return;
  }

  const length = line.getTotalLength();
  line.style.strokeDasharray = `${length}`;
  line.style.strokeDashoffset = `${length}`;
  line.getBoundingClientRect();
  line.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
  line.style.strokeDashoffset = '0';
}

(function initHeroCanvas() {
  const canvas = doc.getElementById('hero-canvas');
  if (!canvas) {
    return;
  }

  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  const pointer = { x: 0.5, y: 0.5 };
  const nodes = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = Math.max(520, window.innerHeight);
  }

  resize();
  window.addEventListener('resize', resize);

  const amount = Math.min(90, Math.max(42, Math.floor(window.innerWidth / 18)));

  for (let i = 0; i < amount; i += 1) {
    nodes.push({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00045,
      vy: (Math.random() - 0.5) * 0.00045,
      r: Math.random() * 1.6 + 0.45,
    });
  }

  window.addEventListener('mousemove', (event) => {
    pointer.x = event.clientX / window.innerWidth;
    pointer.y = event.clientY / window.innerHeight;
  });

  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    context.clearRect(0, 0, w, h);

    const gradient = context.createRadialGradient(
      w * pointer.x,
      h * pointer.y,
      30,
      w * pointer.x,
      h * pointer.y,
      Math.max(w, h) * 0.7
    );
    gradient.addColorStop(0, 'rgba(184,152,95,0.16)');
    gradient.addColorStop(1, 'rgba(184,152,95,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, w, h);

    nodes.forEach((node, index) => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > 1) {
        node.vx *= -1;
      }
      if (node.y < 0 || node.y > 1) {
        node.vy *= -1;
      }

      const px = node.x * w;
      const py = node.y * h;

      context.beginPath();
      context.fillStyle = 'rgba(184,152,95,0.8)';
      context.arc(px, py, node.r, 0, Math.PI * 2);
      context.fill();

      for (let j = index + 1; j < nodes.length; j += 1) {
        const other = nodes[j];
        const ox = other.x * w;
        const oy = other.y * h;
        const dx = px - ox;
        const dy = py - oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const max = 120;
        if (dist < max) {
          const alpha = (1 - dist / max) * 0.25;
          context.strokeStyle = `rgba(184,152,95,${alpha})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(px, py);
          context.lineTo(ox, oy);
          context.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
