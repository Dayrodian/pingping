import './style.css';

// ============================================
// 🎯 HEADER NAVIGATION
// ============================================

const header = document.getElementById('header') as HTMLElement;
const burgerBtn = document.getElementById('burgerBtn') as HTMLButtonElement;
const mobileMenu = document.getElementById('mobileMenu') as HTMLElement;
const mobileMenuClose = document.getElementById('mobileMenuClose') as HTMLButtonElement;

// Создаем overlay для мобильного меню
const mobileMenuOverlay = document.createElement('div');
mobileMenuOverlay.className = 'mobile-menu-overlay';
document.body.appendChild(mobileMenuOverlay);

// Scroll эффект для header
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// Мобильное меню
function toggleMobileMenu() {
  const isActive = mobileMenu.classList.toggle('active');
  burgerBtn.classList.toggle('active');
  mobileMenuOverlay.classList.toggle('active');
  
  // Блокируем скролл body при открытом меню
  if (isActive) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

burgerBtn.addEventListener('click', toggleMobileMenu);
mobileMenuClose.addEventListener('click', toggleMobileMenu);
mobileMenuOverlay.addEventListener('click', toggleMobileMenu);

// Закрытие меню при клике на ссылку
const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    toggleMobileMenu();
  });
});

// Smooth scroll для всех якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const currentTarget = e.currentTarget as HTMLAnchorElement;
    const target = document.querySelector(currentTarget.getAttribute('href') as string);
    if (target) {
      const headerHeight = header.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// ⏰ COUNTDOWN TIMER (с Cookie)
// ============================================

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

function initCountdownTimer() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  
  // Проверяем Cookie
  let endDateStr = getCookie('promoEndDate');
  let endDate: Date;
  
  if (!endDateStr) {
    // Первый визит - устанавливаем таймер на 7 дней
    endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    setCookie('promoEndDate', endDate.getTime().toString(), 7);
    console.log('⏰ Countdown: First visit, set 7 days timer');
  } else {
    // Берем существующую дату из Cookie
    endDate = new Date(parseInt(endDateStr));
    console.log('⏰ Countdown: Continuing from cookie');
  }
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = endDate.getTime() - now;
    
    if (distance < 0) {
      // Время истекло - показываем нули
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
}


// ============================================
// 🎯 CTA BUTTONS & ANALYTICS
// ============================================

// Простая функция для трекинга событий
function trackEvent(category: string, action: string, label?: string) {
  console.log(`[Analytics] ${category} - ${action}${label ? ` - ${label}` : ''}`);
  
  // Интеграция с Яндекс.Метрикой
  const goalName = `${category}_${action}`.toUpperCase();
  if (typeof (window as any).ym !== 'undefined') {
    (window as any).ym(105603596, 'reachGoal', goalName, {
      category,
      action,
      label
    });
  }
}

// Header CTA
const headerCta = document.getElementById('headerCta');
if (headerCta) {
  headerCta.addEventListener('click', () => {
    trackEvent('CTA', 'click', 'header');
    // Модальное окно открывается через initPricingModal()
  });
}

// Hero CTA
const heroCta = document.getElementById('heroCta');
if (heroCta) {
  heroCta.addEventListener('click', () => {
    trackEvent('CTA', 'click', 'hero');
    // Модальное окно открывается через initPricingModal()
  });
}

// Mobile menu CTA
const mobileMenuCta = mobileMenu.querySelector('.mobile-menu__cta');
if (mobileMenuCta) {
  mobileMenuCta.addEventListener('click', () => {
    trackEvent('CTA', 'click', 'mobile-menu');
    toggleMobileMenu();
    // Модальное окно открывается через initPricingModal()
  });
}

// ============================================
// 🎮 GAME INTEGRATION & CTA MODAL
// ============================================

const gameFrame = document.getElementById('gameFrame') as HTMLIFrameElement;
const gamePlaceholder = document.getElementById('gamePlaceholder') as HTMLElement;
const gameCta = document.getElementById('gameCta') as HTMLElement;
const closeCta = document.getElementById('closeCta') as HTMLButtonElement;
const continueGameBtn = document.getElementById('continueGameBtn') as HTMLButtonElement;
const ctaOrderBtn = document.getElementById('ctaOrderBtn') as HTMLButtonElement;
const gameStats = document.getElementById('gameStats') as HTMLElement;

// Скрываем placeholder когда iframe загрузился
if (gameFrame && gamePlaceholder) {
  gameFrame.addEventListener('load', () => {
    setTimeout(() => {
      gamePlaceholder.classList.add('hidden');
    }, 500);
    trackEvent('Game', 'loaded', 'iframe');
    console.log('✅ Game loaded in iframe');
  });
}

// Слушаем сообщения от игры
window.addEventListener('message', (event) => {
  const { type, score, time, level } = event.data;
  
  switch(type) {
    case 'GAME_START':
      trackEvent('Game', 'start', 'play');
      console.log('🎮 Game started');
      break;
      
    case 'GAME_OVER':
      trackEvent('Game', 'over', `score_${score}`);
      console.log(`💀 Game over. Score: ${score}`);
      break;
      
    case 'GAME_WIN':
      trackEvent('Game', 'win', `score_${score}`);
      console.log(`🏆 Game won! Score: ${score}`);
      break;
      
    case 'SHOW_CTA':
      showGameCTA(score, time, level);
      break;
  }
});

// Показываем CTA модалку
function showGameCTA(score?: number, time?: number, level?: number) {
  if (!gameCta) return;
  
  // Формируем статистику если есть данные
  if (gameStats && (score || time || level)) {
    let statsHTML = '';
    
    if (score !== undefined) {
      statsHTML += `
        <div class="game-cta-modal__stat">
          <div class="game-cta-modal__stat-value">${score}</div>
          <div class="game-cta-modal__stat-label">Очков</div>
        </div>
      `;
    }
    
    if (time !== undefined) {
      statsHTML += `
        <div class="game-cta-modal__stat">
          <div class="game-cta-modal__stat-value">${Math.floor(time)}с</div>
          <div class="game-cta-modal__stat-label">Времени</div>
        </div>
      `;
    }
    
    if (level !== undefined) {
      statsHTML += `
        <div class="game-cta-modal__stat">
          <div class="game-cta-modal__stat-value">${level}</div>
          <div class="game-cta-modal__stat-label">Уровень</div>
        </div>
      `;
    }
    
    gameStats.innerHTML = statsHTML;
  }
  
  gameCta.classList.add('active');
  trackEvent('CTA', 'show', 'game-modal');
  console.log('💬 CTA modal shown');
}

// Закрытие CTA
if (closeCta) {
  closeCta.addEventListener('click', () => {
    gameCta?.classList.remove('active');
    trackEvent('CTA', 'close', 'game-modal');
  });
}

// Продолжить игру
if (continueGameBtn) {
  continueGameBtn.addEventListener('click', () => {
    gameCta?.classList.remove('active');
    trackEvent('CTA', 'continue', 'game');
    // Отправляем сообщение игре продолжить
    gameFrame?.contentWindow?.postMessage({ type: 'CONTINUE_GAME' }, '*');
  });
}

// Сделать заказ
if (ctaOrderBtn) {
  ctaOrderBtn.addEventListener('click', () => {
    trackEvent('CTA', 'order', 'from-game');
    // Модальное окно открывается через initPricingModal()
  });
}

// ============================================
// 🔥 SCROLL FIRE & PROGRESS EFFECTS
// ============================================

function initScrollEffects() {
  const fireEffect = document.getElementById('fireEffect') as HTMLElement;
  const scrollProgress = document.getElementById('scrollProgress') as HTMLElement;
  const progressFill = document.getElementById('progressFill') as HTMLElement;
  const progressPercent = document.getElementById('progressPercent') as HTMLElement;
  const chickenBubble = document.getElementById('chickenBubble') as HTMLElement;
  const milestones = document.querySelectorAll('.milestone');
  
  if (!fireEffect || !scrollProgress || !progressFill || !progressPercent) return;
  
  let lastScrollTop = 0;
  let scrollVelocity = 0;
  let ticking = false;
  
  // CTA тексты в зависимости от прогресса
  const ctaTexts = [
    { progress: 0, text: 'Получить игру!' },
    { progress: 30, text: 'Создать свою!' },
    { progress: 60, text: 'Заказать сейчас!' },
    { progress: 85, text: 'Почти у цели!' },
    { progress: 95, text: 'Жми сюда! 🎯' }
  ];
  
  // Клик по пузырю открывает CTA
  if (chickenBubble) {
    chickenBubble.addEventListener('click', () => {
      trackEvent('CTA', 'click', 'chicken-runner');
      // Скроллим к CTA кнопке или открываем модалку
      const heroCta = document.getElementById('heroCta');
      if (heroCta) {
        heroCta.click();
      }
    });
  }
  
  // Вычисляем прогресс скролла
  function calculateProgress(): number {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollableHeight = documentHeight - windowHeight;
    
    return scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
  }
  
  // Обновляем визуальные эффекты
  function updateScrollEffects() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const progress = calculateProgress();
    const windowHeight = window.innerHeight;
    
    // Вычисляем скорость скролла
    scrollVelocity = Math.abs(scrollTop - lastScrollTop);
    lastScrollTop = scrollTop;
    
    // Курочку показываем только после первого экрана (hero секции)
    const showChicken = scrollTop > windowHeight * 0.7; // После 70% первого экрана
    
    if (showChicken) {
      fireEffect.classList.add('active');
    } else {
      fireEffect.classList.remove('active');
    }
    
    // Progress-bar показываем раньше
    if (scrollTop > 100) {
      scrollProgress.classList.add('active');
    } else {
      scrollProgress.classList.remove('active');
    }
    
    // Курочка бежит по экрану в зависимости от прогресса
    const maxLeft = window.innerWidth - 350; // Место для курочки + пузыря
    const chickenPosition = Math.max(0, (progress / 100) * maxLeft);
    fireEffect.style.left = `${chickenPosition}px`;
    
    // Меняем текст CTA в зависимости от прогресса
    if (chickenBubble) {
      let currentText = ctaTexts[0].text;
      for (const item of ctaTexts) {
        if (progress >= item.progress) {
          currentText = item.text;
        }
      }
      const bubbleTextEl = chickenBubble.querySelector('.bubble__text');
      if (bubbleTextEl && bubbleTextEl.textContent !== currentText) {
        bubbleTextEl.textContent = currentText;
      }
    }
    
    // Ускорение анимации при быстром скролле
    if (scrollVelocity > 20) {
      fireEffect.classList.add('intense');
      setTimeout(() => fireEffect.classList.remove('intense'), 200);
    }
    
    // Обновляем прогресс бар
    progressFill.style.height = `${progress}%`;
    progressPercent.textContent = `${Math.round(progress)}%`;
    
    // Пульсация при высоком прогрессе
    if (progress >= 100) {
      progressFill.setAttribute('data-progress', 'complete');
    } else if (progress >= 80) {
      progressFill.setAttribute('data-progress', 'high');
    } else {
      progressFill.removeAttribute('data-progress');
    }
    
    // Активируем milestones
    milestones.forEach((milestone) => {
      const milestoneProgress = parseInt(milestone.getAttribute('data-progress') || '0');
      if (progress >= milestoneProgress) {
        if (!milestone.classList.contains('active')) {
          milestone.classList.add('active');
          trackEvent('Scroll', 'milestone', `${milestoneProgress}%`);
        }
      } else {
        milestone.classList.remove('active');
      }
    });
    
    ticking = false;
  }
  
  // Оптимизированный scroll listener через requestAnimationFrame
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Инициализация при загрузке
  updateScrollEffects();
  
  console.log('🔥 Scroll fire & progress effects: Active');
}

// ============================================
// 🎮 GALLERY SECTION
// ============================================

function initGallery() {
  const galleryTrack = document.querySelector('.gallery__track') as HTMLElement;
  const galleryItems = document.querySelectorAll('.gallery__item');
  const prevBtn = document.querySelector('.gallery__nav--prev') as HTMLButtonElement;
  const nextBtn = document.querySelector('.gallery__nav--next') as HTMLButtonElement;
  
  if (!galleryTrack || !galleryItems.length) {
    console.log('⚠️ Gallery elements not found');
    return;
  }
  
  let currentIndex = 0;
  let isProgrammaticScroll = false; // Флаг для отслеживания программного скролла
  
  // Обновление состояния кнопок (определяем заранее для использования в scrollToItem)
  function updateNavButtons() {
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
      prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex === galleryItems.length - 1;
      nextBtn.style.opacity = currentIndex === galleryItems.length - 1 ? '0.5' : '1';
    }
  }
  
  // Функция для прокрутки к нужному элементу
  function scrollToItem(index: number) {
    const item = galleryItems[index] as HTMLElement;
    if (item) {
      isProgrammaticScroll = true; // Помечаем, что скролл программный
      const scrollLeft = item.offsetLeft - galleryTrack.offsetLeft - 
                        parseInt(window.getComputedStyle(galleryTrack).paddingLeft);
      galleryTrack.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
      currentIndex = index;
      updateNavButtons(); // Обновляем кнопки сразу
      trackEvent('Gallery', 'navigate', `Item ${index + 1}`);
      
      // Сбрасываем флаг после завершения анимации скролла
      setTimeout(() => {
        isProgrammaticScroll = false;
      }, 600);
    }
  }
  
  // Кнопка "Предыдущий"
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIndex = Math.max(0, currentIndex - 1);
      scrollToItem(newIndex);
      trackEvent('Gallery', 'click', 'Previous button');
    });
  }
  
  // Кнопка "Следующий"
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIndex = Math.min(galleryItems.length - 1, currentIndex + 1);
      scrollToItem(newIndex);
      trackEvent('Gallery', 'click', 'Next button');
    });
  }
  
  // Инициализация состояния кнопок
  updateNavButtons();
  
  // Функция для закрытия всех игр кроме текущей
  function closeAllGamesExcept(currentItem: Element) {
    galleryItems.forEach((item) => {
      if (item !== currentItem) {
        const isLoaded = item.getAttribute('data-loaded') === 'true';
        
        if (isLoaded) {
          const iframe = item.querySelector('.gallery__iframe') as HTMLIFrameElement;
          const overlay = item.querySelector('.gallery__play-overlay') as HTMLElement;
          const preview = item.querySelector('.gallery__preview') as HTMLImageElement;
          const loading = item.querySelector('.gallery__loading') as HTMLElement;
          
          // Останавливаем игру и сбрасываем src
          if (iframe) {
            iframe.src = '';
            // Убираем inline стили с iframe
            iframe.removeAttribute('style');
          }
          
          // ВАЖНО: Сбрасываем состояние загрузки ПЕРЕД восстановлением стилей
          item.setAttribute('data-loaded', 'false');
          
          // Скрываем спиннер загрузки если он активен
          if (loading) {
            loading.classList.remove('active');
          }
          
          // ВАЖНО: Полностью удаляем inline стили, чтобы CSS снова работал
          if (preview) {
            preview.removeAttribute('style');
          }
          
          if (overlay) {
            overlay.removeAttribute('style');
          }
          
          console.log(`🛑 Closed game, restored preview`);
        }
      }
    });
  }
  
  // Lazy Loading для iframe с ограничением на 1 активную игру
  galleryItems.forEach((item, index) => {
    const iframe = item.querySelector('.gallery__iframe') as HTMLIFrameElement;
    const overlay = item.querySelector('.gallery__play-overlay') as HTMLElement;
    const preview = item.querySelector('.gallery__preview') as HTMLImageElement;
    const loading = item.querySelector('.gallery__loading') as HTMLElement;
    const label = item.querySelector('.gallery__label');
    const dataSrc = iframe?.getAttribute('data-src');
    
    if (!iframe || !overlay || !dataSrc) return;
    
    // Обработчик загрузки iframe
    iframe.addEventListener('load', () => {
      if (iframe.src && iframe.src !== '') {
        // Скрываем спиннер загрузки
        if (loading) {
          loading.classList.remove('active');
        }
        
        // CSS автоматически скрывает overlay и preview через data-loaded="true"
        // Не устанавливаем inline стили, чтобы CSS мог восстановить их через data-loaded="false"
        
        setTimeout(() => {
          console.log(`✅ Game iframe loaded: ${label?.textContent || `Example ${index + 1}`}`);
          console.log(`   CSS управляет видимостью через data-loaded="${item.getAttribute('data-loaded')}"`);
          console.log(`   📱 Проверьте что overlay и preview скрыты через CSS`);
        }, 300);
      }
    });
    
    // Функция загрузки игры
    const loadGame = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      
      // ВАЖНО: Закрываем все остальные игры перед открытием новой
      closeAllGamesExcept(item);
      
      // Проверяем, не загружена ли уже эта игра
      const isLoaded = item.getAttribute('data-loaded') === 'true';
      
      if (!isLoaded) {
        // Показываем спиннер загрузки
        if (loading) {
          loading.classList.add('active');
        }
        
        // Добавляем необходимые атрибуты для корректной работы iframe (только один раз)
        if (!iframe.getAttribute('allow')) {
          iframe.setAttribute('allow', 'autoplay; fullscreen');
        }
        
        // Загружаем игру
        iframe.src = dataSrc;
        item.setAttribute('data-loaded', 'true');
        
        const gameTitle = label?.textContent || `Example ${index + 1}`;
        trackEvent('Gallery', 'play', gameTitle);
        console.log(`🎮 Game loading started: ${gameTitle}`);
      }
    };
    
    // Обработчики для десктопа и мобильных устройств
    overlay.addEventListener('click', loadGame);
    overlay.addEventListener('touchend', loadGame);
  });
  
  // Обновляем текущий индекс при ручной прокрутке
  let scrollTimeout: ReturnType<typeof setTimeout>;
  galleryTrack.addEventListener('scroll', () => {
    // Игнорируем обновление индекса, если скролл программный (от кнопок)
    if (isProgrammaticScroll) return;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Определяем, какой элемент сейчас ближе всего к началу viewport
      const scrollLeft = galleryTrack.scrollLeft;
      let closestIndex = 0;
      let closestDistance = Infinity;
      
      galleryItems.forEach((item, index) => {
        const itemElement = item as HTMLElement;
        const itemLeft = itemElement.offsetLeft - galleryTrack.offsetLeft;
        const distance = Math.abs(scrollLeft - itemLeft);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      currentIndex = closestIndex;
      updateNavButtons();
    }, 50); // Уменьшена задержка для быстрого отклика кнопок
  });
  
  console.log(`🎮 Gallery initialized with ${galleryItems.length} examples`);
  console.log('✅ Features: Preview images, One active iframe limit, Lazy loading');
}

// ============================================
// ❓ FAQ ACCORDION
// ============================================

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq__item');
  
  if (!faqItems.length) {
    console.log('⚠️ FAQ items not found');
    return;
  }
  
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq__question');
    
    if (!question) return;
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Закрываем все остальные элементы
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Переключаем текущий элемент
      item.classList.toggle('active');
      
      // Трекинг
      if (!isActive) {
        const questionText = item.querySelector('.faq__question-text')?.textContent || 'Unknown';
        trackEvent('FAQ', 'open', questionText);
      }
    });
  });
  
  console.log(`❓ FAQ initialized with ${faqItems.length} items`);
}

// ============================================
// 🪟 PRICING MODAL
// ============================================

function initPricingModal() {
  const modal = document.getElementById('pricingModal');
  const modalClose = modal?.querySelector('.modal__close');
  const modalOverlay = modal?.querySelector('.modal__overlay');
  
  if (!modal) {
    console.log('⚠️ Pricing modal not found');
    return;
  }
  
  // Функция открытия модального окна
  const openModal = (source: string) => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    trackEvent('Modal', 'open', source);
    console.log(`🪟 Modal opened from: ${source}`);
  };
  
  // Функция закрытия модального окна
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Восстанавливаем скролл страницы
    trackEvent('Modal', 'close', 'User action');
    console.log('🪟 Modal closed');
  };
  
  // Закрытие по кнопке X
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  // Закрытие по клику на overlay
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }
  
  // Закрытие по ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Все кнопки, которые открывают модальное окно
  const openModalButtons = [
    document.getElementById('headerCta'),
    document.querySelector('.hero__cta'),
    document.querySelector('.pricing-trigger__button'),
    document.querySelector('.open-pricing-modal'),
    document.querySelector('.mobile-menu__cta'),
    document.getElementById('footerCta'),
  ];
  
  openModalButtons.forEach((button) => {
    if (button) {
      button.addEventListener('click', () => {
        const buttonText = button.textContent?.trim() || 'Unknown button';
        openModal(buttonText);
      });
    }
  });
  
  // Кнопка "Заказать базовый" - редирект на конструктор
  const orderBasicButton = document.querySelector('.pricing__cta');
  if (orderBasicButton) {
    orderBasicButton.addEventListener('click', () => {
      trackEvent('CTA', 'click', 'Order Basic - Redirect to Constructor');
      window.location.href = '/asset_previewer.html';
    });
  }
  
  console.log('🪟 Pricing modal initialized');
  console.log(`✅ Connected ${openModalButtons.filter(b => b).length} CTA buttons to modal`);
  console.log('✅ Order Basic button redirects to constructor');
}

// ============================================
// 🚀 INITIALIZATION
// ============================================

initCountdownTimer();
initScrollEffects();
initGallery();
initFAQ();
initPricingModal();

// ============================================
// 📊 TELEGRAM & ADDITIONAL TRACKING
// ============================================

// Отслеживание клика по Telegram в футере
const telegramLinks = document.querySelectorAll('a[href*="t.me"]');
telegramLinks.forEach((link) => {
  link.addEventListener('click', () => {
    trackEvent('Contact', 'click', 'Telegram');
  });
});

// Отслеживание клика по email
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
emailLinks.forEach((link) => {
  link.addEventListener('click', () => {
    trackEvent('Contact', 'click', 'Email');
  });
});

// Отслеживание открытия главной страницы
if (typeof (window as any).ym !== 'undefined') {
  (window as any).ym(105603596, 'reachGoal', 'PAGE_VIEW');
}

console.log('🐔 Chicken Road Landing - Initialized!');
console.log('⏰ Countdown timer: Active (7 days with Cookie)');
console.log('🔥 Scroll effects: Active');
console.log('🎮 Gallery: Manual navigation + Lazy loading (Performance optimized)');
console.log('❓ FAQ: Accordion with smooth animations');
console.log('🪟 Pricing Modal: All CTA buttons connected');
console.log('🦶 Footer: Complete with CTA');
console.log('📊 Yandex.Metrika: Goals tracking active');
console.log('📋 План разработки: DEVELOPMENT_PLAN.md');
console.log('🎮 Game integration ready - добавьте игру в public/game/');


