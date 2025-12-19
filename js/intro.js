/**
 * Intro Animation & Interaction Controller
 * Handles the intro page animations and user interactions
 */

// Constants
const TRANSITION_DURATION = 2500;
const MAIN_PAGE_URL = 'main.html';

// DOM Elements
const elements = {
    mailWrapper: null,
    introContainer: null,
    glitterSound: null
};

/**
 * Initialize the intro page
 */
const initIntro = () => {
    // Get DOM elements
    elements.mailWrapper = document.getElementById('mailWrapper');
    elements.introContainer = document.getElementById('introContainer');
    elements.glitterSound = document.getElementById('glitterSound');

    // Check if all elements exist
    if (!elements.mailWrapper || !elements.introContainer || !elements.glitterSound) {
        console.error('Required DOM elements not found');
        return;
    }

    // Attach event listeners
    attachEventListeners();
};

/**
 * Attach event listeners to elements
 */
const attachEventListeners = () => {
    // Click event - navigate to main page
    elements.mailWrapper.addEventListener('click', handleMailClick);

    // Hover events - pause/resume animation
    elements.mailWrapper.addEventListener('mouseenter', pauseAnimation);
    elements.mailWrapper.addEventListener('mouseleave', resumeAnimation);
};

/**
 * Handle mail click - play sound and navigate
 */
const handleMailClick = () => {
    // Play glitter sound effect
    playSound();

    // Trigger fade out animation
    elements.introContainer.classList.add('fade-out');

    // Navigate after animation completes
    setTimeout(navigateToMain, TRANSITION_DURATION);
};

/**
 * Play glitter sound effect
 */
const playSound = () => {
    elements.glitterSound.play().catch(error => {
        console.warn('Audio playback failed:', error);
    });
};

/**
 * Pause floating animation on hover
 */
const pauseAnimation = function() {
    this.style.animationPlayState = 'paused';
};

/**
 * Resume floating animation on mouse leave
 */
const resumeAnimation = function() {
    this.style.animationPlayState = 'running';
};

/**
 * Navigate to main page
 */
const navigateToMain = () => {
    window.location.href = MAIN_PAGE_URL;
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initIntro);
