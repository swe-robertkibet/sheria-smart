# Sheria Smart - AI Legal Assistant
#### Video Demo: https://www.youtube.com/watch?v=yNDsp6nOhz8
#### Description:

Sheria Smart is a comprehensive AI-powered legal assistant application designed to make Kenyan law accessible to everyone. This full-stack web application serves as my CS50x final project, combining modern web technologies with artificial intelligence to create a practical solution for legal guidance in Kenya.

## Project Overview

The inspiration for Sheria Smart came from observing the significant barriers that ordinary citizens face when trying to understand their legal rights and obligations in Kenya. Legal consultation is expensive, and finding reliable legal information can be challenging. This project aims to democratize legal knowledge by providing an intelligent, always-available legal assistant that can provide structured guidance, generate legal documents, and help users understand complex legal concepts in plain language.

Sheria Smart is built as a modern full-stack web application with two distinct modes of interaction: Quick Chat for immediate legal questions and Legal Analysis for comprehensive, structured legal guidance. The application also features an automated document generation system that can create various types of legal documents based on user inputs.

## Technical Architecture

The application follows a modern full-stack architecture pattern, separated into distinct frontend and backend components that communicate through RESTful APIs. This separation allows for scalability, maintainability, and the potential for future mobile app development using the same backend infrastructure.

### Frontend Architecture

The frontend is built using Next.js 15 with TypeScript, chosen for its excellent developer experience, built-in optimization features, and strong TypeScript support. Next.js provides server-side rendering capabilities, automatic code splitting, and optimized performance out of the box. The application uses React 18 with modern hooks and functional components throughout.

For styling, I chose Tailwind CSS combined with shadcn/ui components. This decision was made to achieve a consistent, modern design system while maintaining development speed. Tailwind's utility-first approach allows for rapid prototyping and easy customization, while shadcn/ui provides accessible, well-designed components that follow modern UI principles.

The frontend implements a sophisticated state management system using React Context API for authentication and component-level state for chat interfaces. The chat functionality includes real-time scrolling management, message persistence, and intelligent UI updates that enhance user experience.

### Backend Architecture

The backend is built with Express.js and TypeScript, providing a robust and type-safe API layer. I chose Express.js for its simplicity, extensive ecosystem, and excellent performance characteristics. The server implements a RESTful API architecture with clear separation of concerns through dedicated route handlers, services, and middleware.

The application integrates with Google's Gemini AI API for natural language processing and legal analysis. This integration required careful prompt engineering to ensure responses are accurate, structured, and appropriate for legal contexts. The AI system is designed to provide disclaimers and encourage professional legal consultation when appropriate.

For data persistence, the application uses MySQL with Prisma ORM. This combination provides strong type safety, excellent query performance, and easy database migrations. Prisma's generated client ensures compile-time safety when working with database queries, reducing the likelihood of runtime errors.

## Key Features and Implementation

### Dual Chat System

The application features two distinct chat interfaces, each designed for different use cases:

**Quick Chat** provides immediate, conversational responses to legal questions. This mode is designed for users who need quick answers and prefer a simple, familiar chat interface. The implementation focuses on speed and simplicity, with messages stored for conversation continuity.

**Legal Analysis** offers comprehensive, structured legal guidance with detailed breakdowns of rights, obligations, next steps, and relevant legal references. This mode demonstrates advanced prompt engineering, where the AI response is structured into multiple sections including legal summaries, user rights, obligations, required documents, and actionable next steps. The structured response format required careful design of TypeScript interfaces and React components to render complex legal information in an accessible way.

### Document Generation System

One of the most complex features is the automated document generation system. The application can create various types of legal documents including employment contracts, lease agreements, non-disclosure agreements, and various business documents. The system uses a sophisticated template engine combined with AI-powered content generation.

The document generation process involves multiple steps: user input collection through dynamic forms, data validation, AI-powered content generation, and final document compilation. Each document type has its own TypeScript interface and validation schema, ensuring data integrity throughout the process.

### Authentication and Security

The application implements OAuth 2.0 authentication using Google Sign-In, providing secure user authentication without requiring password management. This decision was made to enhance security while improving user experience. The authentication system includes JWT token management, secure cookie handling, and comprehensive error handling for various authentication scenarios.

Security considerations throughout the application include input validation, SQL injection prevention through Prisma's query builder, CORS configuration, and secure environment variable handling.

## File Structure and Organization

The project is organized into two main directories: `frontend` and `backend`, each containing their respective codebases.

### Frontend Structure

The `frontend/app` directory contains Next.js pages using the new app router, including the main dashboard, login page, and various legal document pages. The `frontend/components` directory houses all React components, organized by functionality and including a comprehensive UI component library in the `ui` subdirectory.

The `frontend/lib` directory contains utility functions, form validation logic, and document configuration files. The `frontend/types` directory defines TypeScript interfaces for legal documents, API responses, and component props, ensuring type safety throughout the application.

The `frontend/contexts` directory implements React Context providers for authentication and theme management, providing global state management without external dependencies.

### Backend Structure

The `backend/src` directory follows a clean architecture pattern with separate directories for routes, services, and middleware. The `backend/src/routes` directory contains Express.js route handlers for authentication, chat functionality, and document generation.

The `backend/src/services` directory implements business logic including database operations, AI integration, document generation services, and email functionality. This separation allows for easy testing and maintenance.

The `backend/src/generators` directory contains the document generation system, with separate generators for different categories of legal documents. Each generator implements a consistent interface while handling the specific requirements of different document types.

## Design Decisions and Rationale

Several key design decisions shaped the development of this application:

**Technology Stack Selection**: I chose modern, production-ready technologies that provide excellent developer experience while ensuring application performance and maintainability. The combination of Next.js, Express.js, and TypeScript provides full-stack type safety, which significantly reduces development errors and improves code quality.

**Database Design**: The database schema is designed to be flexible and extensible. Chat sessions and messages are stored separately to allow for efficient querying and potential future features like conversation search. The document storage system is designed to handle various document types while maintaining referential integrity.

**AI Integration**: The integration with Google Gemini API required careful consideration of prompt engineering, response handling, and error management. The system is designed to handle AI service outages gracefully while providing useful feedback to users.

**User Experience**: The application prioritizes user experience through responsive design, intuitive navigation, and clear information architecture. The dual chat system addresses different user needs while maintaining consistency in design and interaction patterns.

## Future Enhancements

The application is designed with extensibility in mind. Future enhancements could include multi-language support for Kenya's diverse linguistic landscape, integration with official legal databases, mobile applications using the existing API, and advanced document collaboration features.

This project demonstrates full-stack web development skills, AI integration, database design, user experience design, and the ability to create practical solutions for real-world problems. The comprehensive legal assistant showcases both technical proficiency and understanding of user needs in the legal domain.

The development of Sheria Smart required research into Kenyan legal systems, careful consideration of user experience, and implementation of complex technical features. This project represents a significant step toward making legal information more accessible and demonstrates the potential of AI technology to solve important societal challenges.