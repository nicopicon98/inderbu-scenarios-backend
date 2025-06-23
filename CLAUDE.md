# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- **Development server**: `npm run start:dev` (watch mode)
- **Build**: `npm run build`
- **Production start**: `npm run start:prod`

### Code Quality
- **Lint**: `npm run lint` (ESLint with auto-fix)
- **Format**: `npm run format` (Prettier)

### Testing
- **Unit tests**: `npm run test`
- **Watch mode**: `npm run test:watch`
- **Coverage**: `npm run test:cov`
- **E2E tests**: `npm run test:e2e`

### CLI and Seeding
- **CLI**: `npm run cli` (uses ts-node to run CLI commands)
- **Seed database**: `npm run start:seeds`

## Architecture Overview

This is a NestJS backend application following **Hexagonal Architecture** (Ports and Adapters pattern) with clear separation of concerns:

### Core Layer (`src/core/`)
- **Domain**: Contains business entities, domain services, and outbound ports (interfaces required by domain)
- **Application**: Contains use cases, application services, and inbound ports (interfaces for triggering business logic)

### Infrastructure Layer (`src/infrastructure/`)
- **Adapters**: Implementation of ports
  - **Inbound**: HTTP controllers, DTOs, strategies (JWT)
  - **Outbound**: Repository adapters, email services, file storage
- **Modules**: NestJS modules for dependency injection
- **Persistence**: TypeORM entities
- **Providers**: Dependency injection configuration

### Key Architectural Patterns
- **Ports and Adapters**: Clear interfaces between layers
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Using NestJS providers system
- **Command Pattern**: CLI commands for seeding and maintenance
- **Mapper Pattern**: Entity-to-DTO transformation

### Database and ORM
- **TypeORM** with MySQL backend
- **Seeding System**: Comprehensive data seeding with JSON files and dedicated seeders
- **Full-text Search**: Custom full-text search setup

### Key Features
- **Authentication**: JWT-based with Passport strategy
- **Authorization**: Role-based access control
- **File Upload**: Image handling for scenarios
- **API Documentation**: Swagger/OpenAPI integration
- **Email**: Nodemailer integration (Ethereal for development)
- **Validation**: Class-validator with global validation pipes

### Module Structure
Each business domain (User, Role, City, Scenario, etc.) follows consistent structure:
- Domain entity
- Repository port (interface)
- Application service
- Repository adapter (implementation)
- HTTP controller
- DTOs and mappers
- NestJS module with providers

### Important Notes
- Spanish comments and error messages are used throughout
- CLI commands use nestjs-command package
- Static file serving configured for uploaded images
- Global error handling and response transformation
- CORS configured for frontend integration