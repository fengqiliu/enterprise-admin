# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Enterprise Admin System (企业后台管理系统) - A full-stack enterprise backend management system with:
- **Frontend**: React 18 + Material-UI v5 + TypeScript + Vite
- **Backend**: Spring Boot 3.2.x + Spring Security + MyBatis-Plus + JWT

## Quick Reference

### Frontend Commands

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (port 3000, with API proxy to localhost:8080)
npm run dev

# Build production
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

### Backend Commands

```bash
cd backend

# Run with Maven
mvn spring-boot:run

# Package
mvn clean package

# Run tests
mvn test

# Run single test class
mvn test -Dtest=ClassNameTest

# Skip tests during build
mvn clean package -DskipTests

# API Documentation: http://localhost:8080/api/doc.html
```

### Database Setup

```bash
# Initialize database
mysql -u root -p < backend/src/main/resources/sql/init.sql
```

### Default Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Super Admin |

## Architecture

### Frontend Structure

```
frontend/src/
├── components/         # Shared components (Layout: AppHeader, AppSidebar, AppLayout)
├── pages/              # Page components (Dashboard, User, Login)
├── router/             # React Router v6 configuration
├── stores/             # Zustand state management (theme, user, sidebar, tabs)
├── services/           # Axios API layer with interceptors (http helper, token injection)
├── theme/              # MUI theme configuration (light/dark)
└── utils/              # Utility functions
```

**Key patterns:**
- Path aliases: `@/*`, `@components/*`, `@stores/*`, etc. (configured in `vite.config.ts` + `tsconfig.json`)
- API requests use `http` helper from `@services/api.ts` with automatic token injection
- State managed via Zustand stores with persistence: `useUserStore`, `useThemeStore`, `useSidebarStore`, `useTabsStore`
- Routing via React Router v6 with `RouterProvider`
- UI Components: Material-UI v5, MUI X DataGrid, MUI X Date Pickers
- Forms: React Hook Form + Zod validation
- Charts: Recharts

### Backend Structure

```
backend/src/main/java/com/enterprise/
├── AdminApplication.java    # Spring Boot entry point
├── common/                  # Common utilities (Result, PageResult)
├── config/                  # Configuration (Security, Cors, Jwt, Redis, MyBatis-Plus, Swagger)
├── controller/              # REST controllers (Auth, User)
├── dto/                     # Data transfer objects (LoginRequest, LoginResponse, UserDTO)
├── entity/                  # JPA entities (User) with MyBatis-Plus annotations
├── handler/                 # Global exception handler
├── mapper/                  # MyBatis-Plus mappers
└── service/                 # Service layer + implementations
```

**Key patterns:**
- 统一响应：`Result<T>` and `PageResult<T>` wrappers
- JWT authentication via `JwtAuthenticationFilter` (stateless session)
- MyBatis-Plus for ORM with logical deletion support (logic-delete-field: deleted)
- Redis for caching
- Knife4j for Swagger documentation at `/api/doc.html`
- BCrypt password encoding
- Spring Security with method-level security (`@PreAuthorize`)
- Global exception handling via `GlobalExceptionHandler`
- Controllers: `AuthController`, `UserController`, `RoleController`, `MenuController`, `DepartmentController`, `DictController`, `OperationLogController`, `LoginLogController`

## Configuration Files

| File | Purpose |
|------|---------|
| `frontend/vite.config.ts` | Vite config, API proxy to `:8080`, path aliases |
| `frontend/tsconfig.json` | TypeScript paths matching Vite aliases |
| `backend/pom.xml` | Maven dependencies (Spring Boot 3.2.2, MyBatis-Plus 3.5.5, JWT 0.12.3) |
| `backend/application.yml` | DB (MySQL), Redis, JWT, MyBatis-Plus config |

## Backend API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### System Management
- `GET/POST/PUT/DELETE /api/system/user` - User CRUD
- `GET/POST/PUT/DELETE /api/system/role` - Role CRUD
- `GET/POST/PUT/DELETE /api/system/menu` - Menu CRUD
- `GET/POST/PUT/DELETE /api/system/department` - Department CRUD

### Business
- `GET/POST/PUT/DELETE /api/business/dict` - Data dictionary CRUD
- `GET/POST/PUT/DELETE /api/business/config` - System config CRUD

### Logs
- `GET /api/log/operation` - Operation logs
- `GET /api/log/login` - Login logs

## Database Schema

The system uses the following tables (defined in `backend/src/main/resources/sql/init.sql`):

| Table | Description |
|-------|-------------|
| `sys_user` | User accounts with logical deletion |
| `sys_role` | Role definitions |
| `sys_menu` | Menu/permission structure |
| `sys_department` | Department hierarchy |
| `sys_user_role` | User-role many-to-many mapping |
| `sys_role_menu` | Role-menu many-to-many mapping |
| `sys_operation_log` | Operation audit logs |
| `sys_login_log` | Login audit logs |
| `sys_dict` | Data dictionary definitions |
| `sys_dict_item` | Dictionary data items |

## Environment Requirements

- Node.js >= 18.x
- JDK >= 17
- MySQL >= 8.0
- Redis >= 7.0
