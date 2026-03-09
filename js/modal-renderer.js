// Modal Renderer - Generates modal content from project data

class ModalRenderer {
  /**
   * Render modal body content
   * @param {Object} projectData - Project information
   * @returns {string} HTML string
   */
  renderBody(projectData) {
    let html = '';

    // Description
    html += this.renderDescription(projectData);

    // Tags
    html += this.renderTags(projectData.tags);

    // Features (optional)
    if (projectData.features && projectData.features.length > 0) {
      html += this.renderFeatures(projectData.features);
    }

    // Screenshots (optional)
    if (projectData.screenshots && projectData.screenshots.length > 0) {
      html += this.renderScreenshots(projectData.screenshots);
    }

    // Metadata (optional)
    if (projectData.metadata && Object.keys(projectData.metadata).length > 0) {
      html += this.renderMetadata(projectData.metadata);
    }

    return html;
  }

  /**
   * Render modal footer with links
   * @param {Object} projectData - Project information
   * @returns {string} HTML string
   */
  renderFooter(projectData) {
    return this.renderLinks(projectData.links);
  }

  /**
   * Render description section
   * @param {Object} projectData - Project information
   * @returns {string} HTML string
   */
  renderDescription(projectData) {
    const descriptions = projectData.fullDescription || [projectData.shortDescription || 'No description available.'];
    
    let html = '<div class="modal-description">';
    descriptions.forEach(paragraph => {
      html += `<p>${this.sanitizeHTML(paragraph)}</p>`;
    });
    html += '</div>';
    
    return html;
  }

  /**
   * Render tags section
   * @param {Array} tags - Technology tags
   * @returns {string} HTML string
   */
  renderTags(tags) {
    if (!tags || tags.length === 0) {
      tags = ['Uncategorized'];
    }

    let html = '<div class="modal-tags">';
    tags.forEach(tag => {
      html += `<span class="modal-tag">${this.sanitizeHTML(tag)}</span>`;
    });
    html += '</div>';
    
    return html;
  }

  /**
   * Render features section
   * @param {Array} features - Feature list
   * @returns {string} HTML string
   */
  renderFeatures(features) {
    let html = '<div class="modal-features">';
    html += '<h3>Key Features</h3>';
    html += '<ul>';
    
    features.forEach(feature => {
      html += `<li>${this.sanitizeHTML(feature)}</li>`;
    });
    
    html += '</ul>';
    html += '</div>';
    
    return html;
  }

  /**
   * Render screenshots section
   * @param {Array} screenshots - Screenshot objects
   * @returns {string} HTML string
   */
  renderScreenshots(screenshots) {
    let html = '<div class="modal-screenshots">';
    html += '<h3>Screenshots</h3>';
    html += '<div class="screenshot-grid">';
    
    screenshots.forEach(screenshot => {
      const url = screenshot.url || screenshot;
      const alt = screenshot.alt || 'Project screenshot';
      html += `<img data-src="${this.sanitizeHTML(url)}" alt="${this.sanitizeHTML(alt)}" class="lazy-load">`;
    });
    
    html += '</div>';
    html += '</div>';
    
    return html;
  }

  /**
   * Render metadata section
   * @param {Object} metadata - Metadata object
   * @returns {string} HTML string
   */
  renderMetadata(metadata) {
    let html = '<div class="modal-metadata">';
    
    const labels = {
      completed: 'Completed',
      duration: 'Duration',
      team: 'Team',
      role: 'Role'
    };
    
    for (const [key, value] of Object.entries(metadata)) {
      if (value) {
        const label = labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
        html += `
          <div class="metadata-item">
            <span class="metadata-label">${this.sanitizeHTML(label)}:</span>
            <span class="metadata-value">${this.sanitizeHTML(value)}</span>
          </div>
        `;
      }
    }
    
    html += '</div>';
    
    return html;
  }

  /**
   * Render links section
   * @param {Object} links - Links object
   * @returns {string} HTML string
   */
  renderLinks(links) {
    if (!links || Object.keys(links).length === 0) {
      return '';
    }

    let html = '';
    
    const linkLabels = {
      github: 'GitHub',
      demo: 'Live Demo',
      overview: 'Overview'
    };
    
    for (const [key, url] of Object.entries(links)) {
      if (url) {
        const label = linkLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
        html += `<a href="${this.sanitizeHTML(url)}" class="modal-link" target="_blank" rel="noopener noreferrer">${this.sanitizeHTML(label)}</a>`;
      }
    }
    
    return html;
  }

  /**
   * Sanitize HTML to prevent XSS
   * @param {string} html - HTML string
   * @returns {string} Sanitized string
   */
  sanitizeHTML(html) {
    if (typeof html !== 'string') {
      return String(html);
    }
    
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }
}
