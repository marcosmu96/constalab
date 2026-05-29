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
const servicePanels = doc.querySelectorAll('.service-panel');
const methodSteps = doc.querySelectorAll('.method-step');
const methodNodes = doc.querySelectorAll('.method-nodes li');
const methodProgressLine = doc.querySelector('#method-progress-line');
const methodCurrentLabel = doc.querySelector('#method-current-label');
const countNodes = doc.querySelectorAll('[data-count]');
const caseStudyCards = doc.querySelectorAll('.case-study-card');
const caseModal = doc.querySelector('#case-modal');
const caseModalCloseNodes = doc.querySelectorAll('[data-case-close]');
const chapterSections = doc.querySelectorAll('.section');

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

window.addEventListener('load', () => {
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 1400);
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
  const sectionIds = ['nosotros', 'servicios', 'proceso', 'filosofia', 'casos', 'equipo', 'contacto'];
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
    equipo: { id: '06', name: 'Equipo' },
    contacto: { id: '07', name: 'Cierre' },
  };

  let activeKey = 'top';
  const pivot = window.innerHeight * 0.44;

  ['nosotros', 'servicios', 'proceso', 'filosofia', 'casos', 'equipo', 'contacto'].forEach((id) => {
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
    const progress = (numeric / 7) * 100;
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
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add('chart-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  caseStudyCards.forEach((card) => caseObserver.observe(card));

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
  caseStudyCards.forEach((card) => {
    card.classList.add('chart-visible');
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

// Categorías de servicios expandibles (Sistemas, Cloud & Hosting).
const serviceCTAs = doc.querySelectorAll('.service-cta');

serviceCTAs.forEach((cta) => {
  const panel = cta.closest('.service-panel--category');
  const region = doc.getElementById(cta.getAttribute('aria-controls'));
  const textNode = cta.querySelector('.service-cta-text');

  if (!panel || !region) {
    return;
  }

  cta.addEventListener('click', () => {
    const willOpen = !panel.classList.contains('is-open');

    if (willOpen) {
      panel.classList.add('is-open');
      // Animamos hasta la altura real del contenido y luego pasamos a 'auto'
      // para que la región se adapte sola a reflows (cambio de columnas/resize).
      region.style.height = `${region.scrollHeight}px`;
      const onEnd = (event) => {
        if (event.propertyName !== 'height') {
          return;
        }
        region.style.height = 'auto';
        region.removeEventListener('transitionend', onEnd);
      };
      region.addEventListener('transitionend', onEnd);
    } else {
      // De 'auto' a px concreto para poder animar el cierre.
      region.style.height = `${region.scrollHeight}px`;
      void region.offsetHeight; // fuerza reflow antes de colapsar
      region.style.height = '0px';
      panel.classList.remove('is-open');
    }

    cta.setAttribute('aria-expanded', String(willOpen));
    if (textNode) {
      const label = willOpen ? cta.dataset.labelOpen : cta.dataset.labelClosed;
      if (label) {
        textNode.textContent = label;
      }
    }
  });
});

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

const caseStudyData = {
  crm: {
    id: '01',
    kicker: 'CRM / Automatizacion / Escalabilidad',
    title: 'Del caos operativo al orden inteligente',
    subtitle: 'Ecosistema CRM personalizado que centraliza catalogo, precios, filtros y administracion comercial en una sola operacion.',
    context:
      'Una startup en rapido crecimiento dedicada a la venta masiva de juegos para PlayStation necesitaba una estructura operativa capaz de organizar y administrar eficientemente todo su ecosistema digital.',
    problem:
      'La operacion estaba fragmentada entre procesos manuales y herramientas aisladas, lo que hacia lenta la gestion de productos, precios y decisiones comerciales.',
    solution:
      'CONSTALAB diseno y desarrollo un sistema CRM completo junto con una web optimizada y alineada a la misma logica operativa y visual del negocio.',
    architecture:
      'Arquitectura modular con catalogo centralizado, filtros avanzados, gestion de precios, paneles de analytics y flujos automatizados para administracion diaria.',
    metrics: [
      { value: '+280%', label: 'Velocidad operativa' },
      { value: '5,000+', label: 'Productos gestionados' },
      { value: '-70%', label: 'Tiempo de gestion' },
    ],
    stack: ['Frontend web optimizado', 'CRM personalizado', 'Panel administrativo', 'Automatizaciones operativas'],
    dashboards: ['Analytics de catalogo y pricing', 'Panel de control comercial', 'Filtros inteligentes y segmentacion'],
    beforeAfter: [
      'Antes: procesos dispersos y alta friccion operativa',
      'Despues: ecosistema unificado, trazable y escalable',
    ],
    impact: ['Mayor velocidad de ejecucion del equipo', 'Operacion comercial con menor error manual', 'Coherencia digital entre sistema y presencia web'],
    tags: ['Sistema CRM personalizado', 'Catalogo centralizado', 'Filtros avanzados', 'Web optimizada', 'Ecosistema unificado'],
  },
  institutional: {
    id: '02',
    kicker: 'Institucional / Arquitectura documental / Inteligencia operativa',
    title: 'Transformando complejidad institucional en sistema digital estructurado',
    subtitle: 'Plataforma integral para gestionar perfiles, legajos y procesos internos de gran escala con dashboards inteligentes.',
    context:
      'Una institucion privada con matriculados necesitaba un sistema robusto y altamente organizado para gestionar documentacion, perfiles y procesos internos a gran escala.',
    problem:
      'La informacion critica se encontraba distribuida en formatos y canales no integrados, con baja trazabilidad y tiempos largos de busqueda y respuesta.',
    solution:
      'CONSTALAB desarrollo una plataforma de gestion integral con legajos digitales, filtros avanzados, notificaciones y paneles personalizados para cada rol.',
    architecture:
      'Estructura documental conectada, panel administrativo central, dashboard por usuario y perfiles compartibles con CV profesional y trazabilidad completa.',
    metrics: [
      { value: '10,000+', label: 'Documentos gestionados' },
      { value: '+350%', label: 'Eficiencia operativa' },
      { value: '-85%', label: 'Tiempo de busqueda' },
    ],
    stack: ['Plataforma de gestion integral', 'Panel administrativo', 'Sistema de notificaciones', 'Perfiles personalizados'],
    dashboards: ['Dashboard de legajos', 'Vista de procesos por estado', 'Filtros avanzados por perfil'],
    beforeAfter: ['Antes: operacion institucional compleja y fragmentada', 'Despues: ecosistema digital estructurado y trazable'],
    impact: ['Escalabilidad documental real', 'Mayor inteligencia operativa', 'Reduccion radical del tiempo de consulta'],
    tags: ['Plataforma de gestion integral', 'Dashboards inteligentes', 'Sistema de notificaciones', 'Panel administrativo', 'Perfiles personalizados'],
  },
  branding: {
    id: '03',
    kicker: 'Branding / Posicionamiento / Conversion',
    title: 'Construyendo una identidad estrategica para crecer',
    subtitle: 'Estrategia de marca, comunicacion y experiencia web orientada a conversion y percepcion premium.',
    context:
      'Dos empresarios especializados en gestion de importaciones necesitaban construir una presencia solida, estrategica y alineada con sus objetivos de crecimiento.',
    problem:
      'La marca no comunicaba el nivel real de expertise ni sostenia una narrativa consistente entre identidad, posicionamiento y conversion digital.',
    solution:
      'CONSTALAB desarrollo analisis estrategico, estrategia de comunicacion, identidad visual integral, logo, posicionamiento y web optimizada.',
    architecture:
      'Sistema de identidad y comunicacion con activos visuales consistentes, lineamientos de marca y experiencia digital disenada para resultados medibles.',
    metrics: [
      { value: '100%', label: 'Coherencia de marca' },
      { value: '+190%', label: 'Conversiones web' },
      { value: '+240%', label: 'Percepcion premium' },
    ],
    stack: ['Analisis estrategico', 'Identidad visual completa', 'Estrategia de comunicacion', 'Web orientada a conversion'],
    dashboards: ['Snippets UI de alto impacto', 'Bloques de narrativa visual', 'Sistema de piezas de marca'],
    beforeAfter: ['Antes: presencia sin cohesion estrategica', 'Despues: identidad premium alineada a objetivos comerciales'],
    impact: ['Incremento de conversion y autoridad percibida', 'Sistema de marca coherente y escalable', 'Posicionamiento premium sostenible'],
    tags: ['Analisis estrategico', 'Identidad visual completa', 'Estrategia de comunicacion', 'Posicionamiento premium', 'Web orientada a conversion'],
  },
};

function renderCaseModalList(container, items) {
  if (!container) {
    return;
  }
  container.innerHTML = '';
  items.forEach((item) => {
    const li = doc.createElement('li');
    li.textContent = item;
    container.appendChild(li);
  });
}

function openCaseModal(caseKey) {
  if (!caseModal) {
    return;
  }

  const data = caseStudyData[caseKey];
  if (!data) {
    return;
  }

  const idNode = doc.querySelector('#case-modal-id');
  const kickerNode = doc.querySelector('#case-modal-kicker');
  const titleNode = doc.querySelector('#case-modal-title');
  const subtitleNode = doc.querySelector('#case-modal-subtitle');
  const contextNode = doc.querySelector('#case-modal-context');
  const problemNode = doc.querySelector('#case-modal-problem');
  const solutionNode = doc.querySelector('#case-modal-solution');
  const architectureNode = doc.querySelector('#case-modal-architecture');
  const metricsNode = doc.querySelector('#case-modal-metrics');
  const tagsNode = doc.querySelector('#case-modal-tags');

  if (idNode) idNode.textContent = data.id;
  if (kickerNode) kickerNode.textContent = data.kicker;
  if (titleNode) titleNode.textContent = data.title;
  if (subtitleNode) subtitleNode.textContent = data.subtitle;
  if (contextNode) contextNode.textContent = data.context;
  if (problemNode) problemNode.textContent = data.problem;
  if (solutionNode) solutionNode.textContent = data.solution;
  if (architectureNode) architectureNode.textContent = data.architecture;

  if (metricsNode) {
    metricsNode.innerHTML = '';
    data.metrics.forEach((metric) => {
      const item = doc.createElement('article');
      item.innerHTML = `<strong>${metric.value}</strong><span>${metric.label}</span>`;
      metricsNode.appendChild(item);
    });
  }

  renderCaseModalList(doc.querySelector('#case-modal-stack'), data.stack);
  renderCaseModalList(doc.querySelector('#case-modal-dashboards'), data.dashboards);
  renderCaseModalList(doc.querySelector('#case-modal-beforeafter'), data.beforeAfter);
  renderCaseModalList(doc.querySelector('#case-modal-impact'), data.impact);

  if (tagsNode) {
    tagsNode.innerHTML = '';
    data.tags.forEach((tag) => {
      const span = doc.createElement('span');
      span.textContent = tag;
      tagsNode.appendChild(span);
    });
  }

  caseModal.classList.add('is-open');
  caseModal.setAttribute('aria-hidden', 'false');
  body.classList.add('case-modal-open');
}

function closeCaseModal() {
  if (!caseModal) {
    return;
  }
  caseModal.classList.remove('is-open');
  caseModal.setAttribute('aria-hidden', 'true');
  body.classList.remove('case-modal-open');
}

function initCaseStudyInteractions() {
  caseStudyCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      if (window.matchMedia('(pointer: fine)').matches === false) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const nx = (x / rect.width) * 100;
      const ny = (y / rect.height) * 100;
      const dx = x - rect.width / 2;
      const dy = y - rect.height / 2;

      card.style.setProperty('--case-mx', `${nx}%`);
      card.style.setProperty('--case-my', `${ny}%`);
      card.style.setProperty('--tilt-x', `${-(dy / rect.height) * 6}deg`);
      card.style.setProperty('--tilt-y', `${(dx / rect.width) * 7}deg`);

      const visual = card.querySelector('.case-visual');
      if (visual) {
        visual.style.transform = `translate3d(${dx * 0.01}px, ${dy * 0.01}px, 28px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--case-mx', '50%');
      card.style.setProperty('--case-my', '50%');
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      const visual = card.querySelector('.case-visual');
      if (visual) {
        visual.style.transform = 'translate3d(0, 0, 28px)';
      }
    });

    card.addEventListener('click', () => {
      const caseKey = card.getAttribute('data-case');
      if (caseKey) {
        openCaseModal(caseKey);
      }
    });

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      event.preventDefault();
      const caseKey = card.getAttribute('data-case');
      if (caseKey) {
        openCaseModal(caseKey);
      }
    });
  });

  caseModalCloseNodes.forEach((node) => {
    node.addEventListener('click', closeCaseModal);
  });

  doc.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && caseModal && caseModal.classList.contains('is-open')) {
      closeCaseModal();
    }
  });
}

initCaseStudyInteractions();

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
