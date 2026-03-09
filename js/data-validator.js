// Data Validator - Validates project data against schema

class DataValidator {
  /**
   * Validate project data
   * @param {Object} projectData - Project data to validate
   * @returns {Object} Validation result with isValid and errors
   */
  static validate(projectData) {
    const errors = [];

    if (!projectData) {
      errors.push('Project data is null or undefined');
      return { isValid: false, errors };
    }

    // Check required fields
    if (!projectData.id) {
      errors.push('Missing required field: id');
    }
    if (!projectData.title) {
      errors.push('Missing required field: title');
    }
    if (!projectData.shortDescription) {
      errors.push('Missing required field: shortDescription');
    }
    if (!projectData.tags || !Array.isArray(projectData.tags)) {
      errors.push('Missing or invalid required field: tags (must be an array)');
    }
    if (!projectData.links || typeof projectData.links !== 'object') {
      errors.push('Missing or invalid required field: links (must be an object)');
    }
    if (!projectData.category) {
      errors.push('Missing required field: category');
    }

    // Type validation for optional fields
    if (projectData.fullDescription && !Array.isArray(projectData.fullDescription)) {
      errors.push('fullDescription must be an array');
    }
    if (projectData.features && !Array.isArray(projectData.features)) {
      errors.push('features must be an array');
    }
    if (projectData.screenshots && !Array.isArray(projectData.screenshots)) {
      errors.push('screenshots must be an array');
    }
    if (projectData.metadata && typeof projectData.metadata !== 'object') {
      errors.push('metadata must be an object');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
