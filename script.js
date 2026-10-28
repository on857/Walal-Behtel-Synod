// ==========================================================================
// WALAL BETHEL SYNOD (WBS) - INTERACTIVE SCRIPTS & ANIMATIONS
// Ethiopian Evangelical Church Mekane Yesus (EECMY)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Reading Progress Bar
  const progressBar = document.getElementById('reading-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
      const progress = (window.pageYOffset / totalHeight) * 100;
      progressBar.style.width = progress + '%';
    }
  }, { passive: true });

  // 2. Navbar Scrolled State & Back to Top Button
  const navbar = document.getElementById('siteNav');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  }, { passive: true });

  // Smooth scroll back to top
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 3. Mobile Navigation Menu Toggle
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggleBtn.setAttribute('aria-expanded', isOpen);
      mobileToggleBtn.innerHTML = isOpen ? '<span class="toggle-icon">✕</span> Close' : '<span class="toggle-icon">☰</span> Menu';
    });

    // Close menu when clicking any navigation link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
        mobileToggleBtn.innerHTML = '<span class="toggle-icon">☰</span> Menu';
      });
    });
  }

  // 4. ScrollSpy: Highlight Active Nav Link on Scroll
  const sections = document.querySelectorAll('article[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // 5. Scroll Reveal Animations (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 6. Animated Counter for Key Statistics
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounters = () => {
    if (animated) return;
    animated = true;

    statNumbers.forEach(stat => {
      const customDisplay = stat.getAttribute('data-display');
      if (customDisplay) {
        // Special display format like "12 & 4"
        stat.innerHTML = customDisplay;
        return;
      }

      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      const isComma = stat.getAttribute('data-format') === 'comma';
      if (isNaN(target)) return;

      const duration = 1800;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(easeProgress * target);

        if (isComma) {
          stat.innerText = currentVal.toLocaleString() + suffix;
        } else {
          stat.innerText = currentVal + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.innerText = (isComma ? target.toLocaleString() : target) + suffix;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const statsSection = document.querySelector('.stats-container');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  } else {
    animateCounters();
  }

  // 7. Toast Notification Utility
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout;

  const showToast = (message) => {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // 8. Copy to Clipboard Utility with Toast & Button State
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.innerHTML;
          btn.classList.add('copied');
          btn.innerHTML = '✓ Copied';
          showToast(`Copied to clipboard: ${textToCopy}`);

          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('copied');
          }, 2000);
        }).catch(err => {
          console.error('Clipboard copy failed: ', err);
          showToast(`Copy failed, please select manually`);
        });
      }
    });
  });

  // 9. Gallery Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.image-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCat === filterValue) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px) scale(0.96)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 10. Enhanced Lightbox Modal with Prev/Next Navigation
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  // Collect all photos data
  const photosData = [];
  galleryItems.forEach((card, index) => {
    const img = card.querySelector('img');
    const title = card.querySelector('h5')?.innerText || 'Synod Facility';
    const caption = card.querySelector('.image-desc-text')?.innerText || '';
    photosData.push({
      src: img?.getAttribute('src') || '',
      alt: img?.getAttribute('alt') || '',
      title,
      caption,
      index
    });

    card.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  let currentPhotoIndex = 0;

  const openLightbox = (index) => {
    if (!lightboxModal || !photosData[index]) return;
    currentPhotoIndex = index;
    renderLightboxPhoto(currentPhotoIndex);
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const renderLightboxPhoto = (index) => {
    const data = photosData[index];
    if (!data || !lightboxImg) return;

    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.95)';

    setTimeout(() => {
      lightboxImg.src = data.src;
      lightboxImg.alt = data.alt;
      if (lightboxTitle) lightboxTitle.innerText = data.title;
      if (lightboxCaption) lightboxCaption.innerText = data.caption;
      if (lightboxCounter) lightboxCounter.innerText = `Photo ${index + 1} of ${photosData.length}`;

      lightboxImg.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    }, 120);
  };

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  const showNextPhoto = () => {
    currentPhotoIndex = (currentPhotoIndex + 1) % photosData.length;
    renderLightboxPhoto(currentPhotoIndex);
  };

  const showPrevPhoto = () => {
    currentPhotoIndex = (currentPhotoIndex - 1 + photosData.length) % photosData.length;
    renderLightboxPhoto(currentPhotoIndex);
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextPhoto();
  });
  lightboxPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevPhoto();
  });

  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal || e.target.classList.contains('lightbox-content-wrap')) {
      closeLightbox();
    }
  });

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextPhoto();
    } else if (e.key === 'ArrowLeft') {
      showPrevPhoto();
    }
  });

  // 11. Subtle 3D Card Hover Tilt (data-tilt)
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
});
