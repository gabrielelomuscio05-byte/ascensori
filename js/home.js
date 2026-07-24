/* ============================================================
   Vertiqal Systems — home.js
   dissolvenze hero e card fisse con maschere di scorrimento.
   ============================================================ */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===================== SCROLL & INTRO ANIMATION =====================
  const doorLeft = document.querySelector('.css-door-left');
  const doorRight = document.querySelector('.css-door-right');
  const floorsContainer = document.getElementById('elevator-floors-container');
  const floorSlides = floorsContainer ? Array.from(floorsContainer.querySelectorAll('.floor-slide')) : [];
  const heroContent = document.querySelector('.hero-content');
  const scrollHint = document.querySelector('.scroll-hint');

  // Initial state setup for the intro
  if (!prefersReducedMotion) {
    if (heroContent) {
      heroContent.style.opacity = '0';
      heroContent.style.transform = 'translateY(30px)';
    }
    if (scrollHint) {
      scrollHint.style.opacity = '0';
    }
    document.body.classList.add('no-scroll');
  }

  function updateDoors(easeProgress) {
    if (!doorLeft || !doorRight) return;
    const translatePercent = easeProgress * 100;
    doorLeft.style.transform = `translateX(-${translatePercent}%)`;
    doorRight.style.transform = `translateX(${translatePercent}%)`;
  }

  function updateFloorsAnimation(activeFloorVal) {
    if (!floorsContainer || floorSlides.length === 0) return;
    
    floorSlides.forEach((slide) => {
      const floorVal = parseInt(slide.dataset.floor, 10); // 0, 1, 2, 3, 4
      const distance = activeFloorVal - floorVal; // negative means above, positive means below
      
      // translateY shifts based on distance (floors above are negative, floors below are positive)
      const translateY = distance * 120;
      
      // Opacity is highest when distance is near 0, and decays smoothly to show adjacent scrolling numbers
      const opacity = Math.max(0, 1 - Math.abs(distance) * 0.7);
      const scale = 1 - Math.min(0.2, Math.abs(distance) * 0.15);
      
      slide.style.transform = `translateY(${translateY}px) scale(${scale})`;
      slide.style.opacity = opacity;
      slide.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      
      if (Math.abs(distance) < 0.35) {
        slide.classList.add('is-active');
      } else {
        slide.classList.remove('is-active');
      }
    });
  }

  function startElevatorIntro() {
    const duration = 3800; // 3.8 seconds total for arrival and door opening
    const startTime = performance.now();
    
    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      // Decelerating progress for floor travel
      const floorProgress = 1 - Math.pow(1 - progress, 2.5); // easeOutCubic/Quart
      
      // activeFloorVal goes from 0.0 (start) up to 1.0 (arrival)
      const activeFloorVal = floorProgress;
      
      updateFloorsAnimation(activeFloorVal);
      
      // Doors open before the arrival is fully finished (e.g. starting when activeFloorVal > 0.6)
      let doorProgress = 0;
      if (activeFloorVal > 0.6) {
        // map activeFloorVal in [0.6, 1.0] to doorProgress in [0, 1]
        doorProgress = (activeFloorVal - 0.6) / 0.4;
      }
      
      // Easing for door opening (sinusoidal ease-in-out)
      const easeDoorProgress = (1 - Math.cos(doorProgress * Math.PI)) / 2;
      updateDoors(easeDoorProgress);
      
      // Fluidly handle text fade-in and floor HUD fade-out during door opening
      if (doorProgress > 0.3) {
        const textFadeProgress = Math.min(1, (doorProgress - 0.3) / 0.7);
        
        if (heroContent) {
          heroContent.style.opacity = String(textFadeProgress);
          heroContent.style.transform = `translateY(${30 * (1 - textFadeProgress)}px)`;
        }
        
        if (floorsContainer) {
          floorsContainer.style.opacity = String(Math.max(0, 1 - textFadeProgress * 1.5));
        }
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Intro complete!
        if (floorsContainer) floorsContainer.style.display = 'none';
        if (scrollHint) {
          scrollHint.style.opacity = '1';
        }
        document.body.classList.remove('no-scroll');
      }
    }
    
    requestAnimationFrame(animate);
  }

  // Initialize intro on load or immediately if ready
  if (!prefersReducedMotion) {
    if (document.readyState === 'complete') {
      setTimeout(startElevatorIntro, 500);
    } else {
      window.addEventListener('load', () => {
        setTimeout(startElevatorIntro, 500);
      });
    }
  } else {
    // Reduced motion mode: open doors, hide indicator, reveal text immediately
    if (doorLeft) doorLeft.style.transform = 'translateX(-100%)';
    if (doorRight) doorRight.style.transform = 'translateX(100%)';
    if (floorsContainer) floorsContainer.style.display = 'none';
    if (heroContent) {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'none';
    }
    if (scrollHint) scrollHint.style.opacity = '1';
  }

  // ===================== HERO FADE =====================
  const hero = document.getElementById('hero');
  function updateHeroOpacity() {
    if (!hero) return;
    const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.35));
    hero.style.opacity = fade;
    hero.style.pointerEvents = fade < 0.05 ? 'none' : '';
  }

  if (hero && !prefersReducedMotion) {
    window.addEventListener('scroll', updateHeroOpacity, { passive: true });
    updateHeroOpacity();
  }

  // ===================== FIXED CARDS =====================
  const fixedCards = document.getElementById('fixed-cards');
  const cardsGrid = fixedCards ? fixedCards.querySelector('.cards-grid') : null;
  const trigger = document.getElementById('cards-trigger');

  function tickCards() {
    if (!fixedCards || !cardsGrid || !trigger) return;
    const rect = trigger.getBoundingClientRect();
    const triggerTop = rect.top + window.scrollY;
    const vh = window.innerHeight;
    const scrollY = window.scrollY;

    const start = triggerTop - vh * 0.5;
    const end = triggerTop + rect.height - vh * 0.3;
    const range = end - start;

    let progress = range > 0 ? (scrollY - start) / range : 0;
    progress = Math.max(0, Math.min(1, progress));

    const fadeIn = Math.min(1, Math.max(0, (scrollY - (start - vh * 0.2)) / (vh * 0.2)));
    const fadeOut = Math.min(1, Math.max(0, (end + vh * 0.3 - scrollY) / (vh * 0.3)));
    const active = scrollY >= start - vh * 0.2 && scrollY <= end + vh * 0.3;
    const opacity = active ? Math.min(fadeIn, fadeOut) : 0;

    fixedCards.style.opacity = opacity;
    fixedCards.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';

    const isMobile = window.innerWidth < 768;
    const revealPct = progress * 130;
    const dir = isMobile ? 'to bottom' : 'to right';
    const spread = isMobile ? 20 : 15;
    const mask = `linear-gradient(${dir}, black ${revealPct}%, transparent ${revealPct + spread}%)`;
    cardsGrid.style.maskImage = mask;
    cardsGrid.style.webkitMaskImage = mask;

    requestAnimationFrame(tickCards);
  }

  if (fixedCards) {
    if (prefersReducedMotion) {
      fixedCards.style.opacity = '';
      fixedCards.style.position = 'static';
      fixedCards.style.pointerEvents = 'auto';
    } else {
      requestAnimationFrame(tickCards);
    }
  }
})();
