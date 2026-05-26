/*
 * -------------------------------------------------------------
 * PREMIUM STUDENT PORTFOLIO INTERACTION ENGINE (app.js)
 * Student: Dauletzhan Nazerke
 * Zhetysu University named after Ilyas Zhansugurov
 * -------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- Auto-inject Scroll Reveal Classes ---
  const autoRevealSelectors = [
    '.hero-wrapper',
    '.panel-card',
    '.cert-card',
    '.task-card',
    '.course-item-card',
    '.comic-iframe-container',
    '.section-intro-bar'
  ];
  
  autoRevealSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.classList.add('reveal-on-scroll');
    });
  });

  // --- Theme Toggle Manager ---
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  if (themeToggle) {
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
  
  function updateThemeIcon(theme) {
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2.5;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2.5;"><path d="M12 3a6.8 6.8 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    if (themeToggle) {
      themeToggle.innerHTML = (theme === 'light' ? moonIcon : sunIcon) + ` <span style="font-weight:700;font-size:0.82rem;margin-left:6px;">Күндізгі/Түнгі режим</span>`;
    }
  }

  // --- Responsive Drawer Controls (Mobile) ---
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const sidebar = document.querySelector('.sidebar');
  const drawerOverlay = document.createElement('div');
  drawerOverlay.className = 'task-drawer-overlay';
  document.body.appendChild(drawerOverlay);

  mobileMenuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = sidebar.classList.contains('active');
    if (isActive) {
      sidebar.classList.remove('active');
      drawerOverlay.classList.remove('active');
    } else {
      sidebar.classList.add('active');
      drawerOverlay.classList.add('active');
    }
  });

  drawerOverlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    drawerOverlay.classList.remove('active');
    
    const taskDrawer = document.getElementById('taskDrawer');
    if (taskDrawer) {
      taskDrawer.classList.remove('active');
    }
  });

  // --- SPA Custom Router ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.page-section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active states from navigation
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Switch active panel
      const targetId = link.getAttribute('data-target');
      sections.forEach(sec => {
        sec.classList.remove('active');
        if (sec.id === targetId) {
          sec.classList.add('active');
          
          // Re-trigger scroll reveal animations for elements inside the active section!
          const activeSectionReveals = sec.querySelectorAll('.reveal-on-scroll');
          activeSectionReveals.forEach(el => {
            el.classList.remove('revealed');
            setTimeout(() => {
              el.classList.add('revealed');
            }, 50);
          });
        }
      });
      
      // Close mobile drawer if active
      sidebar.classList.remove('active');
      drawerOverlay.classList.remove('active');
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // --- Section 2: Certificates Lightbox Preview ---
  const certCards = document.querySelectorAll('.cert-card');
  const certModal = document.getElementById('certModal');
  const modalClose = document.getElementById('modalClose');
  const modalImageTitle = document.getElementById('modalImageTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalCanvasPlaceholder = document.getElementById('modalCanvasPlaceholder');

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title');
      const category = card.getAttribute('data-category');
      const desc = card.getAttribute('data-desc');
      const pdf = card.getAttribute('data-pdf');
      
      modalImageTitle.innerText = title;
      modalDesc.innerText = desc;
      modalCanvasPlaceholder.innerHTML = `
        <h3>${category}</h3>
        <p style="font-size: 1rem; color: #f59e0b; margin-top: 10px;">★ ★ ★ ★ ★</p>
        <p style="font-size: 0.82rem; margin-top: 25px; line-height: 1.6;">Даулетжан Назеркеге<br>қашықтықтан білім беру саласындағы белсенділігі үшін табысталды.</p>
        <span style="font-size: 0.65rem; color:#64748b; margin-top: 40px; display:block;">Университет Төрағасы</span>
      `;
      
      const modalCertLink = document.getElementById('modalCertLink');
      if (pdf) {
        modalCertLink.href = pdf;
        modalCertLink.style.display = 'inline-flex';
      } else {
        modalCertLink.style.display = 'none';
      }
      
      certModal.classList.add('active');
    });
  });

  modalClose.addEventListener('click', () => {
    certModal.classList.remove('active');
  });

  // --- Section 3: Interactive Slides Player ---
  const slides = document.querySelectorAll('.slide-screen');
  const prevSlideBtn = document.getElementById('prevSlide');
  const nextSlideBtn = document.getElementById('nextSlide');
  const slideIndicators = document.querySelectorAll('.slide-dot');
  let activeSlideIndex = 0;

  function updateSlideViewer() {
    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev');
      if (idx === activeSlideIndex) {
        slide.classList.add('active');
      } else if (idx < activeSlideIndex) {
        slide.classList.add('prev');
      }
    });
    
    slideIndicators.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeSlideIndex);
    });
  }

  if (nextSlideBtn && prevSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
      activeSlideIndex = (activeSlideIndex + 1) % slides.length;
      updateSlideViewer();
    });

    prevSlideBtn.addEventListener('click', () => {
      activeSlideIndex = (activeSlideIndex - 1 + slides.length) % slides.length;
      updateSlideViewer();
    });

    slideIndicators.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        activeSlideIndex = idx;
        updateSlideViewer();
      });
    });
  }

  // --- Section 5: Built-in Educational Games ---

  // Web Audio Sound FX Synthesizer
  function playSound(type) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'wrong') {
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(147, ctx.currentTime + 0.08); // D3
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch(e) {}
  }

  // GAME 1: Сөзді тап (Memory Match Game)
  const memoryTerms = [
    { text: 'Moodle', matchId: 1 },
    { text: 'LMS Платформасы', matchId: 1 },
    { text: 'Zoom', matchId: 2 },
    { text: 'Бейнебайланыс', matchId: 2 },
    { text: 'Stepik', matchId: 3 },
    { text: 'MOOC Курстары', matchId: 3 },
    { text: 'Wordwall', matchId: 4 },
    { text: 'Дидактикалық ойын', matchId: 4 },
    { text: 'Miro', matchId: 5 },
    { text: 'Интерактивті тақта', matchId: 5 },
    { text: 'Canva', matchId: 6 },
    { text: 'Дизайн және слайд', matchId: 6 }
  ];

  let firstCard = null;
  let secondCard = null;
  let isBoardLocked = false;
  let movesCount = 0;
  let matchesCount = 0;

  const memoryBoard = document.getElementById('memoryBoard');
  const movesVal = document.getElementById('movesVal');
  const restartGameBtn = document.getElementById('restartGame');

  function initMemoryGame() {
    memoryBoard.innerHTML = '';
    firstCard = null;
    secondCard = null;
    isBoardLocked = false;
    movesCount = 0;
    matchesCount = 0;
    movesVal.innerText = movesCount;
    
    // Shuffle array
    const shuffled = [...memoryTerms].sort(() => Math.random() - 0.5);
    
    shuffled.forEach(term => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.setAttribute('data-match', term.matchId);
      
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-face front">?</div>
          <div class="card-face back">${term.text}</div>
        </div>
      `;
      
      card.addEventListener('click', flipCard);
      memoryBoard.appendChild(card);
    });
  }

  function flipCard() {
    if (isBoardLocked) return;
    if (this === firstCard) return;
    
    this.classList.add('flipped');
    
    if (!firstCard) {
      firstCard = this;
      return;
    }
    
    secondCard = this;
    movesCount++;
    movesVal.innerText = movesCount;
    
    checkMatch();
  }

  function checkMatch() {
    const isMatch = firstCard.getAttribute('data-match') === secondCard.getAttribute('data-match');
    
    if (isMatch) {
      disableCards();
    } else {
      unflipCards();
    }
  }

  function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchesCount++;
    playSound('correct');
    
    resetSelection();
    
    if (matchesCount === 6) {
      setTimeout(() => {
        alert(`Құттықтаймыз! Ойынды ${movesCount} қадамда аяқтадыңыз!`);
      }, 500);
    }
  }

  function unflipCards() {
    isBoardLocked = true;
    playSound('wrong');
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetSelection();
    }, 1000);
  }

  function resetSelection() {
    firstCard = null;
    secondCard = null;
    isBoardLocked = false;
  }

  if (memoryBoard && movesVal && restartGameBtn) {
    restartGameBtn.addEventListener('click', initMemoryGame);
    initMemoryGame();
  }

  // GAME 2: Білімділер бәйгесі (Academic Quiz)
  const quizData = [
    {
      q: 'Қашықтықтан оқытудағы басты LMS жүйелерінің бірі қандай?',
      o: ['Canva', 'Moodle', 'Miro', 'Zoom'],
      a: 1
    },
    {
      q: 'Студенттерге арналған интерактивті онлайн сабақтарда қолданылатын тақта?',
      o: ['Stepik', 'Miro', 'Wordwall', 'Coursera'],
      a: 1
    },
    {
      q: 'MOOC (жаппай ашық онлайн курс) жүйесінің көрнекті өкілі?',
      o: ['Figma', 'Wordwall', 'Stepik', 'Trello'],
      a: 2
    },
    {
      q: 'Бейнесабақтар мен бейнеконференциялар өткізуге арналған негізгі бағдарлама?',
      o: ['Zoom', 'Canva', 'Kahoot', 'Miro'],
      a: 0
    },
    {
      q: 'Ойын элементтері бар тапсырмалар мен сөзжұмбақтар жасайтын платформа?',
      o: ['Git', 'Coursera', 'LMS Moodle', 'Wordwall'],
      a: 3
    }
  ];

  let currentQuestionIndex = 0;
  let quizScore = 0;
  let isAnswered = false;

  const quizQuestion = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const quizCount = document.getElementById('quizCount');
  const quizProgress = document.getElementById('quizProgress');
  const quizResetBtn = document.getElementById('quizResetBtn');

  if (quizQuestion && quizOptions && quizCount && quizProgress && quizResetBtn) {
    function initQuiz() {
      currentQuestionIndex = 0;
      quizScore = 0;
      isAnswered = false;
      showQuestion();
    }

    function showQuestion() {
      isAnswered = false;
      const currentQ = quizData[currentQuestionIndex];
      quizQuestion.innerText = currentQ.q;
      quizOptions.innerHTML = '';
      
      // Progress
      const progressPct = ((currentQuestionIndex) / quizData.length) * 100;
      quizProgress.style.width = `${progressPct}%`;
      quizCount.innerHTML = `Сұрақ <span>${currentQuestionIndex + 1}/${quizData.length}</span>`;
      
      currentQ.o.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt-btn';
        btn.innerText = opt;
        btn.addEventListener('click', () => selectAnswer(idx, btn));
        quizOptions.appendChild(btn);
      });
    }

    function selectAnswer(selectedIdx, btnElement) {
      if (isAnswered) return;
      isAnswered = true;
      
      const currentQ = quizData[currentQuestionIndex];
      const correctIdx = currentQ.a;
      const allButtons = quizOptions.querySelectorAll('.quiz-opt-btn');
      
      if (selectedIdx === correctIdx) {
        btnElement.classList.add('correct');
        quizScore++;
        playSound('correct');
      } else {
        btnElement.classList.add('wrong');
        allButtons[correctIdx].classList.add('correct');
        playSound('wrong');
      }
      
      setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
          showQuestion();
        } else {
          showQuizResults();
        }
      }, 1500);
    }

    function showQuizResults() {
      quizProgress.style.width = `100%`;
      quizQuestion.parentNode.innerHTML = `
        <div class="quiz-result-view">
          <div class="quiz-trophy">🏆</div>
          <h4>Бәйге Аяқталды!</h4>
          <p>Сіздің жинаған ұпайыңыз: <strong>${quizScore} / ${quizData.length}</strong></p>
          <button class="game-reset-btn" id="quizRestart">Қайта ойнау</button>
        </div>
      `;
      document.getElementById('quizRestart').addEventListener('click', () => {
        location.reload(); // Quick reset
      });
    }

    quizResetBtn.addEventListener('click', initQuiz);
    initQuiz();
  }

  // --- Section 6: Tasks Custom Accordion Drawers ---
  const taskViewBtns = document.querySelectorAll('.task-view-btn');
  const taskDrawer = document.getElementById('taskDrawer');
  const taskDrawerClose = document.getElementById('taskDrawerClose');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerDesc = document.getElementById('drawerDesc');
  const drawerMetaStatus = document.getElementById('drawerMetaStatus');
  const drawerMetaTools = document.getElementById('drawerMetaTools');

  if (taskDrawer && taskDrawerClose && drawerTitle && drawerDesc && drawerMetaStatus && drawerMetaTools) {
    taskViewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.task-card');
        const title = card.querySelector('h3').innerText;
        const desc = card.querySelector('p').innerText;
        const id = card.querySelector('.task-id').innerText;
        const status = card.querySelector('.task-status').innerText;
        const file = card.getAttribute('data-file');
        
        drawerTitle.innerText = title;
        drawerDesc.innerText = `${desc}\n\nБұл практикалық тапсырма оқу бағдарламасының талаптары негізінде сапалы орындалды. Барлық қажетті дидактикалық стандарттар мен әдістемелік нұсқаулықтар сақталған.`;
        drawerMetaStatus.innerText = status;
        drawerMetaTools.innerText = 'Google Classroom, Canva, Stepik';
        
        const drawerProjectLink = document.getElementById('drawerProjectLink');
        if (drawerProjectLink) {
          if (file) {
            drawerProjectLink.href = file;
            drawerProjectLink.style.display = 'inline-flex';
          } else {
            drawerProjectLink.style.display = 'none';
          }
        }
        
        taskDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
      });
    });

    taskDrawerClose.addEventListener('click', () => {
      taskDrawer.classList.remove('active');
      drawerOverlay.classList.remove('active');
    });
  }

  // --- Section 7: Comic Strip Slides ---
  const comicStrip = document.getElementById('comicStrip');
  const prevComicBtn = document.getElementById('prevComic');
  const nextComicBtn = document.getElementById('nextComic');
  const comicPanelDesc = document.getElementById('comicPanelDesc');
  const comicBubbleText = document.getElementById('comicBubbleText');
  let currentComicFrame = 0;

  const comicFrames = [
    {
      bubble: 'Сәлем, Назерке! Сандық технологияларды қалай меңгеруге болады?',
      desc: '1-ші КАДР: Студенттің сұрағы және цифрлық әлеммен танысу.'
    },
    {
      bubble: 'Ол үшін ең алдымен заманауи онлайн платформаларды меңгеру қажет!',
      desc: '2-ші КАДР: Назерке оқыту әдістемесі туралы түсіндіреді.'
    },
    {
      bubble: 'Мысалы, Google Classroom, Canva немесе Stepik арқылы цифрлық жоба жасауды үйрен!',
      desc: '3-ші КАДР: Интерактивті құралдармен танысу.'
    },
    {
      bubble: 'Керемет! Сандық дағдылар болашақ үшін өте маңызды екен ғой!',
      desc: '4-ші КАДР: Цифрлық білім берудің болашағы мен қорытынды.'
    }
  ];

  if (comicBubbleText && comicPanelDesc && nextComicBtn && prevComicBtn) {
    function updateComicViewer() {
      comicBubbleText.innerText = comicFrames[currentComicFrame].bubble;
      comicPanelDesc.innerText = comicFrames[currentComicFrame].desc;
    }

    nextComicBtn.addEventListener('click', () => {
      currentComicFrame = (currentComicFrame + 1) % comicFrames.length;
      updateComicViewer();
    });

    prevComicBtn.addEventListener('click', () => {
      currentComicFrame = (currentComicFrame - 1 + comicFrames.length) % comicFrames.length;
      updateComicViewer();
    });

    updateComicViewer();
  }
  // --- Scroll Reveal Manager (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Email & Instagram Interaction capture for mobile/desktop reliability ---
  const emailCard = document.getElementById('email-card');
  const instagramCard = document.getElementById('instagram-card');

  if (emailCard) {
    emailCard.addEventListener('click', () => {
      console.log('Email card clicked, opening mail composer for nazerkedauletzhan@gmail.com');
    });
  }

  if (instagramCard) {
    instagramCard.addEventListener('click', () => {
      console.log('Instagram card clicked, redirecting to instagram profile @_qqqqweertyy_');
    });
  }

});
