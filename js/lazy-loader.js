// Lazy Loader - Optimizes image loading using IntersectionObserver

class LazyLoader {
  constructor() {
    this.observer = null;
  }

  /**
   * Initialize lazy loader with IntersectionObserver
   */
  init() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01
    };

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      options
    );
  }

  /**
   * Observe images for lazy loading
   * @param {NodeList|Array} images - Images to observe
   */
  observe(images) {
    images.forEach(img => this.observer.observe(img));
  }

  /**
   * Handle intersection - load image when visible
   * @param {Array} entries - Intersection entries
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;

        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          this.observer.unobserve(img);
        }
      }
    });
  }
}
