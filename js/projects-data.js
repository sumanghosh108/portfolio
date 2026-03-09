// Project Data Configuration
// Centralized data store for all portfolio projects with extended information

const PROJECTS_DATA = {
  "agentic-ai": {
    id: "agentic-ai",
    title: "AgenticAI",
    shortDescription: "Autonomous AI-driven research assistant that automates the entire research process.",
    fullDescription: [
      "AgenticAI is an advanced autonomous research assistant powered by LangChain and LangGraph. It automates the entire research workflow from query understanding to comprehensive report generation.",
      "The system uses multiple AI agents working in coordination to search, analyze, synthesize, and present information in a structured format. Built with FastAPI for the backend and Streamlit for the interactive frontend.",
      "Features include intelligent query processing, multi-source data aggregation, automated citation management, and real-time progress tracking."
    ],
    tags: ["Python", "LangChain", "LangGraph", "OpenRouter", "FastAPI", "Streamlit", "PostgreSQL", "Docker"],
    features: [
      "Multi-agent architecture for distributed research tasks",
      "Automated web scraping and data extraction",
      "Intelligent query understanding and refinement",
      "Real-time research progress tracking",
      "Comprehensive report generation with citations",
      "PostgreSQL database for research history",
      "Docker containerization for easy deployment"
    ],
    links: {
      github: "https://github.com/sumanghosh108/AgenticAI",
      overview: "https://github.com/sumanghosh108/AgenticAI/blob/main/README.md"
    },
    metadata: {
      completed: "February 2026",
      duration: "4 months",
      role: "Full Stack Developer",
      team: "Solo project"
    },
    category: "ml db"
  },

  "brain-tumor-detection": {
    id: "brain-tumor-detection",
    title: "Tumor Detection and Prediction System",
    shortDescription: "Brain tumor detection and prediction system through MRI scans.",
    fullDescription: [
      "A comprehensive deep learning system for detecting and classifying brain tumors from MRI scans. The project processes over 19,000+ MRI images using state-of-the-art computer vision models.",
      "Implemented multiple architectures including CNN, VGG16, VGG19, and YOLOv8 for comparison and ensemble predictions. Achieved 93% accuracy on the test dataset.",
      "The system provides real-time tumor detection, classification into tumor types, and confidence scores for medical professionals to make informed decisions."
    ],
    tags: ["Python", "Scikit-learn", "TensorFlow", "YOLOv8", "CNN", "VGG19"],
    features: [
      "Multi-model ensemble for improved accuracy",
      "Real-time MRI scan analysis",
      "Tumor type classification (Glioma, Meningioma, Pituitary)",
      "Confidence score visualization",
      "Data augmentation for robust training",
      "Transfer learning with pre-trained models",
      "93% accuracy on test dataset"
    ],
    links: {
      github: "https://github.com/sumanghosh108/BrainTumorDetection"
    },
    metadata: {
      completed: "December 2025",
      duration: "5 months",
      role: "ML Engineer & Team Lead",
      team: "Team of 3"
    },
    category: "ml"
  },

  "performance-report": {
    id: "performance-report",
    title: "Performance Report",
    shortDescription: "Student performance analysis and prediction based on their criteria.",
    fullDescription: [
      "A machine learning system that analyzes student performance data to predict academic outcomes and identify at-risk students.",
      "Uses multiple regression and classification algorithms to predict final grades based on various factors including attendance, previous grades, study time, and demographic information.",
      "Provides actionable insights for educators to implement targeted interventions and improve student success rates."
    ],
    tags: ["Python", "Scikit-learn"],
    features: [
      "Multi-factor performance prediction",
      "At-risk student identification",
      "Feature importance analysis",
      "Interactive visualizations",
      "Comparative model evaluation"
    ],
    links: {
      github: ""
    },
    metadata: {
      completed: "October 2025",
      duration: "2 months",
      role: "Data Scientist",
      team: "Solo project"
    },
    category: "ml"
  },

  "aqi-prediction": {
    id: "aqi-prediction",
    title: "AQI Prediction",
    shortDescription: "Air quality index prediction.",
    fullDescription: [
      "An environmental data science project that predicts Air Quality Index (AQI) using historical pollution data and meteorological factors.",
      "Implements multiple machine learning algorithms including Random Forest, XGBoost, and LSTM neural networks for time-series forecasting.",
      "The system provides short-term and long-term AQI predictions to help citizens and policymakers make informed decisions about outdoor activities and pollution control measures."
    ],
    tags: ["Python", "Scikit-learn"],
    features: [
      "Time-series forecasting with LSTM",
      "Ensemble methods (Random Forest, XGBoost)",
      "Multi-pollutant analysis (PM2.5, PM10, NO2, SO2, CO, O3)",
      "Weather factor integration",
      "Interactive prediction dashboard",
      "Historical trend analysis"
    ],
    links: {
      github: "https://github.com/sumanghosh108/Air-Quality-Index-Prediction"
    },
    metadata: {
      completed: "September 2025",
      duration: "3 months",
      role: "Data Scientist",
      team: "Solo project"
    },
    category: "ml"
  },

  "ems-portal": {
    id: "ems-portal",
    title: "EMS Portal",
    shortDescription: "Enterprise employee management solutions.",
    fullDescription: [
      "A production-grade Employee Management System built with Python and FastAPI that automates payroll calculations, leave management, and employee record keeping.",
      "The system enforces strict input validation, applies deterministic payroll rules using Python Decimal arithmetic, and persists all operations in PostgreSQL with full audit trails.",
      "Features both a CLI interface for automation and a REST API for integration with other enterprise systems. Includes comprehensive CI/CD pipeline with automated testing."
    ],
    tags: ["Python", "PostgreSQL", "FastAPI"],
    features: [
      "Automated payroll calculation with leave deductions",
      "Type-specific employee rules (Senior/Junior/Temporary)",
      "PostgreSQL database with audit trails",
      "REST API for system integration",
      "CLI interface for batch operations",
      "Comprehensive input validation",
      "CI/CD pipeline with GitHub Actions",
      "Docker containerization"
    ],
    links: {
      github: "https://github.com/sumanghosh108/EmployeeManagementSystem",
      overview: "https://github.com/sumanghosh108/EmployeeManagementSystem/blob/master/README.md"
    },
    metadata: {
      completed: "March 2026",
      duration: "3 months",
      role: "Backend Developer",
      team: "Solo project"
    },
    category: "ml"
  },

  "university-finder": {
    id: "university-finder",
    title: "University Finder",
    shortDescription: "Find university locations and maps across entire globe.",
    fullDescription: [
      "A geographic information system that helps users discover universities worldwide with interactive map visualization.",
      "Integrates with OpenStreetMap API to provide accurate location data, campus boundaries, and nearby amenities for thousands of universities globally.",
      "Features include search by country, city, or university name, with detailed information about each institution including contact details and website links."
    ],
    tags: ["Python", "SQLite", "OpenStreetMap API"],
    features: [
      "Global university database",
      "Interactive map visualization",
      "OpenStreetMap API integration",
      "Search by location or name",
      "Campus boundary mapping",
      "Nearby amenities information",
      "SQLite database for offline access"
    ],
    links: {
      github: "https://github.com/sumanghosh108/opengeo"
    },
    metadata: {
      completed: "August 2025",
      duration: "2 months",
      role: "Full Stack Developer",
      team: "Solo project"
    },
    category: "db"
  },

  "dash-app": {
    id: "dash-app",
    title: "Dash App",
    shortDescription: "Interactive Plotly dashboard for analyzing automobile sales trends with real-time data.",
    fullDescription: [
      "A comprehensive data visualization dashboard built with Plotly Dash for analyzing automobile sales trends and market dynamics.",
      "Features interactive charts, filters, and real-time data updates to help stakeholders make data-driven decisions about inventory, pricing, and marketing strategies.",
      "The dashboard processes large datasets efficiently and provides drill-down capabilities for detailed analysis of sales patterns by region, model, and time period."
    ],
    tags: ["Python", "Dash", "Plotly", "Pandas"],
    features: [
      "Interactive sales trend visualization",
      "Real-time data updates",
      "Multi-dimensional filtering",
      "Regional sales comparison",
      "Time-series analysis",
      "Export functionality for reports",
      "Responsive design for mobile viewing"
    ],
    links: {
      github: "https://github.com/sumanghosh108/Automobile-sales-dash-app"
    },
    metadata: {
      completed: "July 2025",
      duration: "2 months",
      role: "Data Analyst",
      team: "Solo project"
    },
    category: "viz"
  },

  "sales-analytics": {
    id: "sales-analytics",
    title: "Sales Analytics",
    shortDescription: "Interactive dashboard for analyzing sales trends with real-time data.",
    fullDescription: [
      "A Power BI dashboard that provides comprehensive sales analytics and business intelligence insights for retail operations.",
      "Connects to multiple data sources including Excel spreadsheets and databases to create unified views of sales performance, customer behavior, and inventory trends.",
      "Features advanced DAX calculations, custom visualizations, and automated report generation for executive stakeholders."
    ],
    tags: ["Power BI", "Excel"],
    features: [
      "Multi-source data integration",
      "Advanced DAX calculations",
      "Custom visualizations",
      "Automated report generation",
      "Sales forecasting",
      "Customer segmentation analysis",
      "Inventory optimization insights"
    ],
    links: {
      github: "https://github.com/sumanghosh108/Sales"
    },
    metadata: {
      completed: "June 2025",
      duration: "1 month",
      role: "Business Intelligence Analyst",
      team: "Solo project"
    },
    category: "viz"
  },

  "banking-system": {
    id: "banking-system",
    title: "Banking System",
    shortDescription: "Complete banking solutions.",
    fullDescription: [
      "A full-featured banking system simulation built with Python and SQL that implements core banking operations including account management, transactions, and loan processing.",
      "Features secure authentication, transaction history tracking, interest calculations, and comprehensive reporting capabilities.",
      "Designed with proper database normalization, ACID compliance, and security best practices for handling financial data."
    ],
    tags: ["Python", "SQL", "Database Design"],
    features: [
      "Account management (Savings, Checking, Loan)",
      "Secure user authentication",
      "Transaction processing (Deposit, Withdrawal, Transfer)",
      "Interest calculation automation",
      "Transaction history and statements",
      "Loan application and approval workflow",
      "Database normalization and ACID compliance"
    ],
    links: {
      github: "https://github.com/sumanghosh108/BankingSystem"
    },
    metadata: {
      completed: "May 2025",
      duration: "3 months",
      role: "Backend Developer",
      team: "Solo project"
    },
    category: "db"
  },

  "call-center-optimization": {
    id: "call-center-optimization",
    title: "Call Center Optimization",
    shortDescription: "Power BI dashboard for call center performance analysis, customer retention insights, and D&I metrics from PwC Switzerland Virtual Experience.",
    fullDescription: [
      "A comprehensive Power BI dashboard developed as part of the PwC Switzerland Virtual Experience program, focusing on call center operations optimization.",
      "Analyzes key performance indicators including average handle time, first call resolution, customer satisfaction scores, and agent performance metrics.",
      "Includes diversity and inclusion (D&I) analytics to ensure equitable service delivery and identify areas for improvement in workforce representation."
    ],
    tags: ["Power BI", "Excel"],
    features: [
      "Call center KPI tracking",
      "Agent performance analytics",
      "Customer satisfaction analysis",
      "First call resolution metrics",
      "Customer retention insights",
      "Diversity and inclusion metrics",
      "Interactive filtering and drill-down"
    ],
    links: {},
    metadata: {
      completed: "April 2025",
      duration: "1 month",
      role: "Business Intelligence Analyst",
      team: "PwC Virtual Experience"
    },
    category: "viz"
  },

  "quiz-app": {
    id: "quiz-app",
    title: "Quiz App",
    shortDescription: "Interactive quiz application with user authentication and score tracking using React and PostgreSQL.",
    fullDescription: [
      "A full-stack quiz application built with React frontend and PostgreSQL backend that provides an engaging platform for creating and taking quizzes.",
      "Features user authentication, quiz creation tools, real-time score tracking, and leaderboards to gamify the learning experience.",
      "Supports multiple question types including multiple choice, true/false, and short answer with automatic grading and detailed performance analytics."
    ],
    tags: ["React", "PostgreSQL", "Full Stack"],
    features: [
      "User authentication and authorization",
      "Quiz creation and management",
      "Multiple question types",
      "Real-time score tracking",
      "Leaderboard system",
      "Performance analytics",
      "Responsive React UI",
      "RESTful API backend"
    ],
    links: {
      github: "https://github.com/sumanghosh108/Quiz-app"
    },
    metadata: {
      completed: "March 2025",
      duration: "2 months",
      role: "Full Stack Developer",
      team: "Solo project"
    },
    category: "db"
  }
};

// Data validation schema
const PROJECT_SCHEMA = {
  required: ['id', 'title', 'shortDescription', 'tags', 'links', 'category'],
  optional: ['fullDescription', 'features', 'screenshots', 'metadata'],
  types: {
    id: 'string',
    title: 'string',
    shortDescription: 'string',
    fullDescription: 'array',
    tags: 'array',
    features: 'array',
    screenshots: 'array',
    metadata: 'object',
    links: 'object',
    category: 'string'
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROJECTS_DATA, PROJECT_SCHEMA };
}
