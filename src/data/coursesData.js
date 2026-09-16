export const coursesData = [
  {
    id: "full-stack-web-development",
    title: "Modern Full-Stack Web Development",
    category: "Web Development",
    instructor: "Alex Rivera",
    instructorRole: "Senior Software Architect",
    rating: 4.9,
    reviewsCount: 1280,
    studentsCount: "12.4K",
    lessonsCount: 42,
    duration: "38 hours",
    level: "Beginner to Advanced",
    price: "Free",
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=800&auto=format&fit=crop",
    description: "Master modern web development from ground up. Learn React, Node.js, TypeScript, PostgreSQL, and state-of-the-art deployment pipelines.",
    syllabus: [
      {
        title: "Module 1: Foundations & Architecture",
        lessons: [
          "HTML5 Semantic Elements & CSS Grid/Flexbox",
          "Modern JavaScript ESNext & TypeScript Basics",
          "Component Driven Architecture in React"
        ]
      },
      {
        title: "Module 2: Frontend Engineering with React",
        lessons: [
          "State Management with Hooks & Context",
          "Client-Side Routing with React Router",
          "Performance Optimization & Code Splitting"
        ]
      },
      {
        title: "Module 3: Backend & APIs",
        lessons: [
          "RESTful APIs with Node.js and Express",
          "Database Modeling with PostgreSQL & Prisma",
          "Authentication, JWT & Security Best Practices"
        ]
      },
      {
        title: "Module 4: Deployment & CI/CD",
        lessons: [
          "Containerization with Docker",
          "Automated Testing with Vitest & Playwright",
          "Cloud Deployment to Vercel and AWS"
        ]
      }
    ]
  },
  {
    id: "python-data-science-machine-learning",
    title: "Data Science & Machine Learning with Python",
    category: "Data Science",
    instructor: "Dr. Elena Rostova",
    instructorRole: "AI Research Scientist",
    rating: 4.8,
    reviewsCount: 940,
    studentsCount: "9.1K",
    lessonsCount: 36,
    duration: "32 hours",
    level: "Intermediate",
    price: "Free",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    description: "Comprehensive hands-on training in Python, NumPy, Pandas, Scikit-Learn, and Deep Learning models for real-world predictive analysis.",
    syllabus: [
      {
        title: "Module 1: Data Manipulation & Visualization",
        lessons: [
          "NumPy Arrays and Vectorized Computation",
          "Pandas DataFrames for Wrangling & Cleaning",
          "Interactive Visualizations with Matplotlib and Seaborn"
        ]
      },
      {
        title: "Module 2: Statistical Modeling & Machine Learning",
        lessons: [
          "Linear & Logistic Regression Models",
          "Decision Trees, Random Forests & XGBoost",
          "Model Evaluation Metrics & Hyperparameter Tuning"
        ]
      },
      {
        title: "Module 3: Deep Learning Foundations",
        lessons: [
          "Neural Networks with PyTorch",
          "Computer Vision & Convolutional Neural Networks",
          "Natural Language Processing & Transformers"
        ]
      }
    ]
  },
  {
    id: "ui-ux-design-masterclass",
    title: "UI/UX Design Systems & Interaction Design",
    category: "Design",
    instructor: "Marcus Chen",
    instructorRole: "Principal Product Designer",
    rating: 4.9,
    reviewsCount: 820,
    studentsCount: "8.6K",
    lessonsCount: 28,
    duration: "24 hours",
    level: "All Levels",
    price: "Free",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop",
    description: "Learn to design world-class user interfaces in Figma, create robust scalable design systems, and craft intuitive digital experiences.",
    syllabus: [
      {
        title: "Module 1: User Experience Foundations",
        lessons: [
          "User Research, Personas & Journey Mapping",
          "Information Architecture & Wireframing",
          "Usability Testing Methodologies"
        ]
      },
      {
        title: "Module 2: Visual & Interface Design",
        lessons: [
          "Color Theory, Typography & Spacing Systems",
          "Auto Layout, Components & Variants in Figma",
          "Design Systems & Token Architecture"
        ]
      },
      {
        title: "Module 3: Prototyping & Handoff",
        lessons: [
          "Micro-Interactions & Interactive Prototyping",
          "Developer Handoff Documentation",
          "Accessibility (WCAG) Standards"
        ]
      }
    ]
  },
  {
    id: "react-native-mobile-apps",
    title: "Cross-Platform Mobile Apps with React Native",
    category: "Mobile",
    instructor: "Sarah Jenkins",
    instructorRole: "Mobile Tech Lead",
    rating: 4.7,
    reviewsCount: 650,
    studentsCount: "6.2K",
    lessonsCount: 30,
    duration: "26 hours",
    level: "Intermediate",
    price: "Free",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop",
    description: "Build high-performance iOS and Android applications with React Native, Expo, native animations, and offline-first data caching.",
    syllabus: [
      {
        title: "Module 1: React Native Core Architecture",
        lessons: [
          "Expo Workflow vs Bare React Native",
          "Core Mobile Components & Styling",
          "Navigation with React Navigation 6"
        ]
      },
      {
        title: "Module 2: Device APIs & Native Features",
        lessons: [
          "Camera, Location & Push Notifications",
          "Local Storage & Offline Synchronization",
          "Smooth Gestures with Reanimated"
        ]
      },
      {
        title: "Module 3: App Store & Play Store Release",
        lessons: [
          "App Signing and Configuration",
          "EAS Build & Continuous Deployment",
          "Monitoring with Sentry"
        ]
      }
    ]
  },
  {
    id: "cloud-devops-kubernetes",
    title: "Cloud Engineering, Docker & Kubernetes",
    category: "DevOps",
    instructor: "David Kumar",
    instructorRole: "DevOps Infrastructure Lead",
    rating: 4.9,
    reviewsCount: 710,
    studentsCount: "7.4K",
    lessonsCount: 34,
    duration: "30 hours",
    level: "Advanced",
    price: "Free",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop",
    description: "Master modern DevOps pipelines, Infrastructure as Code with Terraform, container orchestration with Kubernetes, and AWS cloud management.",
    syllabus: [
      {
        title: "Module 1: Linux & Containers",
        lessons: [
          "Linux Server Administration & Bash Scripting",
          "Building Optimized Multi-Stage Docker Images",
          "Docker Compose for Multi-Container Apps"
        ]
      },
      {
        title: "Module 2: Kubernetes Orchestration",
        lessons: [
          "Pods, Deployments, Services & Ingress",
          "ConfigMaps, Secrets & Persistent Volumes",
          "Helm Package Management"
        ]
      },
      {
        title: "Module 3: Infrastructure as Code & CI/CD",
        lessons: [
          "Terraform on AWS Infrastructure",
          "GitHub Actions Automation Pipelines",
          "Monitoring with Prometheus and Grafana"
        ]
      }
    ]
  },
  {
    id: "ai-llm-application-engineering",
    title: "Generative AI & LLM Application Engineering",
    category: "AI & ML",
    instructor: "Dr. Aisha Patel",
    instructorRole: "AI Architect",
    rating: 4.9,
    reviewsCount: 1100,
    studentsCount: "10.8K",
    lessonsCount: 38,
    duration: "35 hours",
    level: "Intermediate to Advanced",
    price: "Free",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop",
    description: "Build real-world AI applications using LangChain, OpenAI APIs, vector databases, RAG systems, and open-source model fine-tuning.",
    syllabus: [
      {
        title: "Module 1: LLM Architecture & Prompt Engineering",
        lessons: [
          "Transformer Architecture & Attention Mechanisms",
          "System Prompting & Structured Outputs",
          "Function Calling & Agentic Tool Use"
        ]
      },
      {
        title: "Module 2: Retrieval Augmented Generation (RAG)",
        lessons: [
          "Embeddings & Vector Databases (Pinecone, Chroma)",
          "Document Chunking & Hybrid Search Strategies",
          "Reranking & Context Optimization"
        ]
      },
      {
        title: "Module 3: Autonomous Agents & Evaluation",
        lessons: [
          "Multi-Agent Workflows with LangGraph",
          "Evaluation Frameworks with Ragas",
          "Production Deployment & Token Cost Optimization"
        ]
      }
    ]
  }
];
