// Modal Controller - Manages modal lifecycle and events

class ModalController {
  constructor() {
    this.modal = null;
    this.activeCard = null;
    this.focusableElements = [];
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.isOpen = false;
    this.isOpening = false;
    this.scrollPosition = 0;
  }

  /**
   * Initialize modal system - creates modal structure once
   */
  init() {
    if (this.modal) {
      console.log('Modal already initialized');
      return; // Already initialized
    }

    console.log('Initializing modal system');

    // Create modal structure
    this.createModalStructure();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Check for backdrop-filter support
    this.checkBackdropFilterSupport();
    
    console.log('Modal system initialized successfully');
  }

  /**
   * Create modal DOM structure
   */
  createModalStructure() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'projectModal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'modalTitle');
    overlay.setAttribute('aria-hidden', 'true');

    overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h2 id="modalTitle" class="modal-title"></h2>
          <button class="modal-close" aria-label="Close modal" type="button">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- Content will be dynamically inserted here -->
        </div>
        
        <div class="modal-footer">
          <!-- Links will be dynamically inserted here -->
        </div>
      </div>
      
      <div class="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>
    `;

    document.body.appendChild(overlay);
    this.modal = overlay;
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Close button click - use normal bubbling phase
    const closeButton = this.modal.querySelector('.modal-close');
    closeButton.addEventListener('click', (event) => {
      console.log('Close button clicked');
      event.preventDefault();
      event.stopPropagation();
      this.close();
    });

    // Prevent clicks inside modal container from closing modal
    const modalContainer = this.modal.querySelector('.modal-container');
    modalContainer.addEventListener('click', (event) => {
      // Don't prevent propagation if clicking the close button
      if (event.target.closest('.modal-close')) {
        console.log('Close button click - allowing');
        return;
      }
      console.log('Modal container clicked - preventing propagation');
      event.stopPropagation();
    });

    // Overlay click (click outside)
    this.modal.addEventListener('click', (event) => {
      console.log('Modal overlay clicked');
      this.handleOverlayClick(event);
    });

    // ESC key press
    document.addEventListener('keydown', (event) => this.handleEscapeKey(event));

    // Tab key for focus trap
    document.addEventListener('keydown', (event) => this.handleTabKey(event));
  }

  /**
   * Open modal with project data
   * @param {Object} projectData - Project information to display
   */
  open(projectData) {
    if (!projectData || this.isOpen) {
      console.log('Modal open prevented:', { hasData: !!projectData, isOpen: this.isOpen });
      return;
    }

    console.log('Opening modal for project:', projectData.id);

    // Validate data
    const validation = DataValidator.validate(projectData);
    if (!validation.isValid) {
      console.error('Invalid project data:', validation.errors);
      this.showErrorMessage('Unable to display project details. Please try again.');
      return;
    }

    // Save scroll position and prevent body scroll
    this.scrollPosition = window.pageYOffset;
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    // Update modal content
    this.updateModalContent(projectData);

    // Temporarily disable close handlers
    this.isOpening = true;

    // Show modal with animation
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    
    const container = this.modal.querySelector('.modal-container');
    container.classList.add('opening');

    // Setup focus trap
    setTimeout(() => {
      this.setupFocusTrap();
      container.classList.remove('opening');
    }, 50);

    // Announce to screen readers
    const announcement = this.modal.querySelector('[role="status"]');
    announcement.textContent = `Modal opened: ${projectData.title}`;

    this.isOpen = true;
    console.log('Modal opened successfully');

    // Re-enable close handlers after a delay
    setTimeout(() => {
      this.isOpening = false;
      console.log('Modal is now fully interactive');
    }, 300);

    // Lazy load images
    this.lazyLoadImages();
  }

  /**
   * Close modal
   */
  close() {
    // Prevent closing if modal is still opening
    if (this.isOpening) {
      console.log('Modal close prevented: modal is still opening');
      return;
    }

    if (!this.isOpen) {
      console.log('Modal close prevented: modal not open');
      return;
    }

    console.log('Closing modal');

    // Add closing animation
    this.modal.classList.add('closing');
    const container = this.modal.querySelector('.modal-container');
    container.classList.add('closing');

    // Wait for animation to complete
    setTimeout(() => {
      this.modal.classList.remove('active', 'closing');
      container.classList.remove('closing');
      this.modal.setAttribute('aria-hidden', 'true');

      // Restore body scroll
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      window.scrollTo(0, this.scrollPosition);

      // Restore focus to trigger element
      this.restoreFocus();

      // Announce to screen readers
      const announcement = this.modal.querySelector('[role="status"]');
      announcement.textContent = 'Modal closed';

      this.isOpen = false;
      console.log('Modal closed successfully');
    }, 200); // Match animation duration
  }

  /**
   * Update modal content with project data
   * @param {Object} projectData - Project information
   */
  updateModalContent(projectData) {
    const renderer = new ModalRenderer();
    
    // Update title
    const title = this.modal.querySelector('#modalTitle');
    title.textContent = projectData.title;

    // Update body
    const body = this.modal.querySelector('.modal-body');
    body.innerHTML = renderer.renderBody(projectData);

    // Update footer
    const footer = this.modal.querySelector('.modal-footer');
    footer.innerHTML = renderer.renderFooter(projectData);

    // Setup image error handling
    this.setupImageErrorHandling();
  }

  /**
   * Handle overlay click (click outside modal)
   * @param {Event} event - Click event
   */
  handleOverlayClick(event) {
    // Prevent closing if modal is still opening
    if (this.isOpening) {
      console.log('Overlay click ignored: modal is still opening');
      return;
    }

    console.log('Overlay clicked:', event.target.className);
    // Only close if clicking directly on the overlay, not on the modal container
    if (event.target === this.modal && event.target.classList.contains('modal-overlay')) {
      event.stopPropagation();
      console.log('Closing modal from overlay click');
      this.close();
    }
  }

  /**
   * Handle ESC key press
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleEscapeKey(event) {
    // Prevent closing if modal is still opening
    if (this.isOpening) {
      console.log('ESC key ignored: modal is still opening');
      return;
    }

    if (event.key === 'Escape' && this.isOpen) {
      console.log('ESC key pressed - closing modal');
      this.close();
    }
  }

  /**
   * Handle Tab key for focus trap
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleTabKey(event) {
    if (!this.isOpen || event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusable) {
        event.preventDefault();
        this.lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusable) {
        event.preventDefault();
        this.firstFocusable.focus();
      }
    }
  }

  /**
   * Setup focus trap
   */
  setupFocusTrap() {
    try {
      const focusableSelectors = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ];

      this.focusableElements = this.modal.querySelectorAll(
        focusableSelectors.join(',')
      );

      if (this.focusableElements.length === 0) {
        // No focusable elements - make container focusable
        const container = this.modal.querySelector('.modal-container');
        container.setAttribute('tabindex', '0');
        container.focus();
        console.warn('No focusable elements in modal, focusing container');
        return;
      }

      this.firstFocusable = this.focusableElements[0];
      this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
      
      // Move focus to first element
      this.firstFocusable.focus();
    } catch (error) {
      console.error('Error setting up focus trap:', error);
      // Fallback: focus close button
      this.modal.querySelector('.modal-close')?.focus();
    }
  }

  /**
   * Restore focus to trigger element
   */
  restoreFocus() {
    if (this.activeCard && typeof this.activeCard.focus === 'function') {
      this.activeCard.focus();
    }
  }

  /**
   * Lazy load images in modal
   */
  lazyLoadImages() {
    const lazyImages = this.modal.querySelectorAll('img[data-src]');
    if (lazyImages.length === 0) return;

    // Check if LazyLoader is available
    if (typeof LazyLoader !== 'undefined') {
      const lazyLoader = new LazyLoader();
      lazyLoader.init();
      lazyLoader.observe(lazyImages);
    } else {
      // Fallback: load images immediately
      lazyImages.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
    }
  }

  /**
   * Setup image error handling
   */
  setupImageErrorHandling() {
    const images = this.modal.querySelectorAll('img');
    
    images.forEach(img => {
      img.addEventListener('error', function() {
        // Replace with placeholder
        this.src = 'images/placeholder.jpg';
        this.alt = 'Image not available';
        
        // Add error class for styling
        this.classList.add('image-error');
        
        console.warn(`Failed to load image: ${this.dataset.src || this.src}`);
      });
    });
  }

  /**
   * Check for backdrop-filter support
   */
  checkBackdropFilterSupport() {
    const testElement = document.createElement('div');
    testElement.style.backdropFilter = 'blur(10px)';
    
    const isSupported = testElement.style.backdropFilter !== '';
    
    if (!isSupported) {
      document.documentElement.classList.add('no-backdrop-filter');
    }
  }

  /**
   * Show error message to user
   * @param {string} message - Error message
   */
  showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'modal-error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      errorDiv.classList.add('fade-out');
      setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
  }
}
