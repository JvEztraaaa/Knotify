/**
 * Wedding Website - Main Controller
 * Handles slideshow, navigation, music, gallery lightbox, and interactions
 */

// ===================================
// State Management
// ===================================

const state = {
    currentSlide: 0,
    totalSlides: 0,
    isTransitioning: false,
    autoplayInterval: null,
    isMusicPlaying: false,
    lightboxIndex: 0,
    mobileGalleryIndex: 0,
    galleryImages: []
};

// ===================================
// DOM Elements
// ===================================

const elements = {
    slides: [],
    indicators: [],
    hamburgerMenu: null,
    navOverlay: null,
    navClose: null,
    navLinks: [],
    backToTop: null,
    rsvpButton: null,
    prevButton: null,
    nextButton: null,
    contentContainer: null,
    musicToggle: null,
    bgMusic: null,
    galleryItems: [],
    lightbox: null,
    lightboxImage: null,
    lightboxClose: null,
    lightboxPrev: null,
    lightboxNext: null,
    lightboxCounter: null,
    mobileGalleryTrack: null,
    mobileGalleryPrev: null,
    mobileGalleryNext: null,
    mobileGalleryIndicators: null,
    mobileGallerySlides: []
};

// ===================================
// Initialization
// ===================================

/**
 * Initialize the application
 */
const init = () => {
    cacheDOM();
    initSlideshow();
    initGallery();
    initMobileGallery();
    attachEventListeners();
    startAutoplay();
    initMusic();
};

/**
 * Cache DOM elements
 */
const cacheDOM = () => {
    elements.slides = document.querySelectorAll('.slide');
    elements.hamburgerMenu = document.getElementById('hamburgerMenu');
    elements.navOverlay = document.getElementById('navOverlay');
    elements.navClose = document.getElementById('navClose');
    elements.navLinks = document.querySelectorAll('.nav-link');
    elements.backToTop = document.getElementById('backToTop');
    elements.rsvpButton = document.getElementById('rsvpButton');
    elements.prevButton = document.getElementById('prevSlide');
    elements.nextButton = document.getElementById('nextSlide');
    elements.contentContainer = document.querySelector('.content-container');
    elements.musicToggle = document.getElementById('musicToggle');
    elements.bgMusic = document.getElementById('bgMusic');
    
    // Gallery lightbox elements
    elements.galleryItems = document.querySelectorAll('.desktop-gallery .gallery-item');
    elements.lightbox = document.getElementById('galleryLightbox');
    elements.lightboxImage = document.getElementById('lightboxImage');
    elements.lightboxClose = document.getElementById('lightboxClose');
    elements.lightboxPrev = document.getElementById('lightboxPrev');
    elements.lightboxNext = document.getElementById('lightboxNext');
    elements.lightboxCounter = document.getElementById('lightboxCounter');
    
    // Mobile gallery elements
    elements.mobileGalleryTrack = document.querySelector('.mobile-gallery-track');
    elements.mobileGalleryPrev = document.getElementById('mobileGalleryPrev');
    elements.mobileGalleryNext = document.getElementById('mobileGalleryNext');
    elements.mobileGalleryIndicators = document.querySelector('.mobile-gallery-indicators');
    elements.mobileGallerySlides = document.querySelectorAll('.mobile-gallery-slide');
    
    state.totalSlides = elements.slides.length;
    
    // Extract gallery image sources
    elements.galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            state.galleryImages.push(img.src);
        }
    });
};

// ===================================
// Slideshow Functions
// ===================================

/**
 * Initialize slideshow indicators
 */
const initSlideshow = () => {
    const indicatorsContainer = document.querySelector('.slide-indicators');
    
    for (let i = 0; i < state.totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (i === 0) indicator.classList.add('active');
        
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
        elements.indicators.push(indicator);
    }
    
    // Show first slide
    if (elements.slides.length > 0) {
        elements.slides[0].classList.add('active');
    }
};

/**
 * Navigate to specific slide
 */
const goToSlide = (index) => {
    if (state.isTransitioning) return;
    
    state.isTransitioning = true;
    
    // Update slides
    elements.slides[state.currentSlide].classList.remove('active');
    elements.indicators[state.currentSlide].classList.remove('active');
    
    state.currentSlide = index;
    
    elements.slides[state.currentSlide].classList.add('active');
    elements.indicators[state.currentSlide].classList.add('active');
    
    setTimeout(() => {
        state.isTransitioning = false;
    }, 1000);
    
    resetAutoplay();
};

/**
 * Navigate to next slide
 */
const nextSlide = () => {
    const nextIndex = (state.currentSlide + 1) % state.totalSlides;
    goToSlide(nextIndex);
};

/**
 * Navigate to previous slide
 */
const prevSlide = () => {
    const prevIndex = (state.currentSlide - 1 + state.totalSlides) % state.totalSlides;
    goToSlide(prevIndex);
};

/**
 * Start automatic slideshow
 */
const startAutoplay = () => {
    state.autoplayInterval = setInterval(nextSlide, 5000);
};

/**
 * Reset autoplay timer
 */
const resetAutoplay = () => {
    clearInterval(state.autoplayInterval);
    startAutoplay();
};

// ===================================
// Music Functions
// ===================================

/**
 * Initialize music with better autoplay handling
 */
const initMusic = () => {
    // Set volume to reasonable level
    if (elements.bgMusic) {
        elements.bgMusic.volume = 0.5;
        
        // Try autoplay with user interaction fallback
        const tryAutoplay = () => {
            const playPromise = elements.bgMusic.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        state.isMusicPlaying = true;
                        elements.musicToggle?.classList.remove('paused');
                    })
                    .catch(() => {
                        // Autoplay blocked - wait for user interaction
                        state.isMusicPlaying = false;
                        elements.musicToggle?.classList.add('paused');
                    });
            }
        };
        
        // Try on page load
        tryAutoplay();
        
        // Also try on first click anywhere
        const playOnFirstClick = () => {
            if (!state.isMusicPlaying) {
                playMusic();
            }
            document.removeEventListener('click', playOnFirstClick, { once: true });
        };
        document.addEventListener('click', playOnFirstClick, { once: true });
    }
};

/**
 * Toggle music play/pause
 */
const toggleMusic = () => {
    if (state.isMusicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
};

/**
 * Play background music
 */
const playMusic = () => {
    if (elements.bgMusic) {
        elements.bgMusic.play()
            .then(() => {
                state.isMusicPlaying = true;
                elements.musicToggle?.classList.remove('paused');
            })
            .catch(error => {
                console.error('Error playing music:', error);
            });
    }
};

/**
 * Pause background music
 */
const pauseMusic = () => {
    if (elements.bgMusic) {
        elements.bgMusic.pause();
        state.isMusicPlaying = false;
        elements.musicToggle?.classList.add('paused');
    }
};

// ===================================
// Gallery Lightbox Functions
// ===================================

/**
 * Initialize gallery with click handlers
 */
const initGallery = () => {
    elements.galleryItems.forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => openLightbox(index));
    });
};

/**
 * Open lightbox at specific image
 */
const openLightbox = (index) => {
    state.lightboxIndex = index;
    updateLightboxImage();
    elements.lightbox?.classList.add('active');
    document.body.style.overflow = 'hidden';
};

/**
 * Close lightbox
 */
const closeLightbox = () => {
    elements.lightbox?.classList.remove('active');
    document.body.style.overflow = '';
};

/**
 * Update lightbox image
 */
const updateLightboxImage = () => {
    if (elements.lightboxImage && state.galleryImages[state.lightboxIndex]) {
        elements.lightboxImage.src = state.galleryImages[state.lightboxIndex];
        if (elements.lightboxCounter) {
            elements.lightboxCounter.textContent = `${state.lightboxIndex + 1} / ${state.galleryImages.length}`;
        }
    }
};

/**
 * Navigate to next lightbox image
 */
const nextLightboxImage = () => {
    state.lightboxIndex = (state.lightboxIndex + 1) % state.galleryImages.length;
    updateLightboxImage();
};

/**
 * Navigate to previous lightbox image
 */
const prevLightboxImage = () => {
    state.lightboxIndex = (state.lightboxIndex - 1 + state.galleryImages.length) % state.galleryImages.length;
    updateLightboxImage();
};

// ===================================
// Mobile Gallery Carousel Functions
// ===================================

/**
 * Initialize mobile gallery carousel
 */
const initMobileGallery = () => {
    // Create indicators
    if (elements.mobileGalleryIndicators) {
        elements.mobileGallerySlides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'mobile-gallery-indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToMobileGallerySlide(index));
            elements.mobileGalleryIndicators.appendChild(indicator);
        });
    }
    
    // Add click handlers to slides
    elements.mobileGallerySlides.forEach((slide, index) => {
        slide.addEventListener('click', () => openLightbox(index));
    });
    
    updateMobileGallery();
};

/**
 * Navigate to specific mobile gallery slide
 */
const goToMobileGallerySlide = (index) => {
    state.mobileGalleryIndex = index;
    updateMobileGallery();
};

/**
 * Update mobile gallery position
 */
const updateMobileGallery = () => {
    if (elements.mobileGalleryTrack) {
        const offset = -state.mobileGalleryIndex * 100;
        elements.mobileGalleryTrack.style.transform = `translateX(${offset}%)`;
        
        // Update indicators
        const indicators = elements.mobileGalleryIndicators?.querySelectorAll('.mobile-gallery-indicator');
        indicators?.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === state.mobileGalleryIndex);
        });
    }
};

/**
 * Navigate to next mobile gallery slide
 */
const nextMobileGallerySlide = () => {
    state.mobileGalleryIndex = (state.mobileGalleryIndex + 1) % elements.mobileGallerySlides.length;
    updateMobileGallery();
};

/**
 * Navigate to previous mobile gallery slide
 */
const prevMobileGallerySlide = () => {
    state.mobileGalleryIndex = (state.mobileGalleryIndex - 1 + elements.mobileGallerySlides.length) % elements.mobileGallerySlides.length;
    updateMobileGallery();
};

// ===================================
// Navigation Functions
// ===================================

/**
 * Open navigation overlay
 */
const openNav = () => {
    elements.navOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
};

/**
 * Close navigation overlay
 */
const closeNav = () => {
    elements.navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
};

/**
 * Toggle navigation (open if closed, close if open)
 */
const toggleNav = () => {
    if (elements.navOverlay?.classList.contains('active')) {
        closeNav();
    } else {
        openNav();
    }
};

/**
 * Handle navigation link clicks
 */
const handleNavClick = (e) => {
    e.preventDefault();
    
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (!targetSection) return;
    
    closeNav();
    
    // Smooth scroll behavior
    setTimeout(() => {
        // Check if we're in mobile layout (slideshow is hero)
        const isMobile = window.innerWidth <= 968;
        
        if (isMobile) {
            // Scroll to section in main document flow
            const offset = targetSection.offsetTop;
            window.scrollTo({
                top: offset - 80,
                behavior: 'smooth'
            });
        } else {
            // Scroll within content container
            const containerTop = elements.contentContainer?.scrollTop || 0;
            const sectionTop = targetSection.offsetTop;
            const offset = 100;
            
            elements.contentContainer?.scrollTo({
                top: sectionTop - offset,
                behavior: 'smooth'
            });
        }
    }, 300);
};

// ===================================
// Scroll Functions
// ===================================

/**
 * Handle scroll events
 */
const handleScroll = () => {
    const scrollTop = window.innerWidth <= 968 
        ? window.pageYOffset 
        : elements.contentContainer?.scrollTop || 0;
    
    // Show/hide back to top button
    if (scrollTop > 300) {
        elements.backToTop?.classList.add('visible');
    } else {
        elements.backToTop?.classList.remove('visible');
    }
};

/**
 * Scroll to top of page
 */
const scrollToTop = () => {
    const isMobile = window.innerWidth <= 968;
    
    if (isMobile) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        elements.contentContainer?.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// ===================================
// RSVP Functions
// ===================================

/**
 * Handle RSVP button click
 */
const handleRSVP = () => {
    // Placeholder for RSVP functionality
    alert('RSVP functionality coming soon! Please contact us directly.');
};

// ===================================
// Keyboard Navigation
// ===================================

/**
 * Handle keyboard events
 */
const handleKeyPress = (e) => {
    // If lightbox is open, handle lightbox navigation
    if (elements.lightbox?.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevLightboxImage();
                break;
            case 'ArrowRight':
                nextLightboxImage();
                break;
        }
        return;
    }
    
    // Normal navigation
    switch(e.key) {
        case 'Escape':
            if (elements.navOverlay?.classList.contains('active')) {
                closeNav();
            }
            break;
        case 'ArrowLeft':
            prevSlide();
            break;
        case 'ArrowRight':
            nextSlide();
            break;
    }
};

// ===================================
// Event Listeners
// ===================================

/**
 * Attach all event listeners
 */
const attachEventListeners = () => {
    // Slideshow controls
    elements.prevButton?.addEventListener('click', prevSlide);
    elements.nextButton?.addEventListener('click', nextSlide);
    
    // Navigation - use toggle instead of just open
    elements.hamburgerMenu?.addEventListener('click', toggleNav);
    elements.navClose?.addEventListener('click', closeNav);
    elements.navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Music toggle
    elements.musicToggle?.addEventListener('click', toggleMusic);
    
    // Gallery lightbox
    elements.lightboxClose?.addEventListener('click', closeLightbox);
    elements.lightboxPrev?.addEventListener('click', prevLightboxImage);
    elements.lightboxNext?.addEventListener('click', nextLightboxImage);
    elements.lightbox?.addEventListener('click', (e) => {
        if (e.target === elements.lightbox) {
            closeLightbox();
        }
    });
    
    // Mobile gallery carousel
    elements.mobileGalleryPrev?.addEventListener('click', prevMobileGallerySlide);
    elements.mobileGalleryNext?.addEventListener('click', nextMobileGallerySlide);
    
    // Scroll events
    if (window.innerWidth <= 968) {
        window.addEventListener('scroll', handleScroll);
    } else {
        elements.contentContainer?.addEventListener('scroll', handleScroll);
    }
    
    // Back to top
    elements.backToTop?.addEventListener('click', scrollToTop);
    
    // RSVP
    elements.rsvpButton?.addEventListener('click', handleRSVP);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Re-attach scroll listener based on new screen size
            if (window.innerWidth <= 968) {
                elements.contentContainer?.removeEventListener('scroll', handleScroll);
                window.addEventListener('scroll', handleScroll);
            } else {
                window.removeEventListener('scroll', handleScroll);
                elements.contentContainer?.addEventListener('scroll', handleScroll);
            }
        }, 250);
    });
};

// ===================================
// Initialize on DOM Ready
// ===================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
