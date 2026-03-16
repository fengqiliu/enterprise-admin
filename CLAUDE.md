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

# Start dev server (port 3000, with API proxy to localhost:8081)
npm run dev

# Build production
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit

# Format
npx prettier --write src/
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

# API Documentation: http://localhost:8081/api/doc.html
# Swagger UI: http://localhost:8081/swagger-ui.html
```

### Database Setup

```bash
# MySQL (production)
mysql -u root -p < backend/src/main/resources/sql/init.sql

# SQLite (development - auto-created in backend/data/)
# No manual setup needed, just run the application
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
├── pages/              # Page components (Dashboard, User, System, Business, Log, Report)
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
- Routing via React Router v6 with `RouterProvider` and protected routes
- UI Components: Material-UI v5, MUI X DataGrid, MUI X Date Pickers
- Forms: React Hook Form + Zod validation
- Charts: Recharts
- Data Grid: MUI X DataGrid for table listings with pagination, sorting, filtering
- Server state: TanStack Query for data fetching and caching

### Backend Structure

```
backend/src/main/java/com/enterprise/
├── AdminApplication.java    # Spring Boot entry point
├── common/                  # Common utilities (Result, PageResult)
├── config/                  # Configuration (Security, Cors, Jwt, Redis, MyBatis-Plus, Swagger)
├── controller/              # REST controllers (Auth, User, Role, Menu, Department, Dict, Config, Report, Log)
├── dto/                     # Data transfer objects (LoginRequest, LoginResponse, UserDTO, ConfigDTO)
├── entity/                  # JPA entities (User, Config) with MyBatis-Plus annotations
├── handler/                 # Global exception handler
├── mapper/                  # MyBatis-Plus mappers
└── service/                 # Service layer + implementations
```

**Key patterns:**
- 统一响应：`Result<T>` and `PageResult<T>` wrappers
- JWT authentication via `JwtAuthenticationFilter` (stateless session)
- MyBatis-Plus for ORM with logical deletion support (logic-delete-field: deleted)
- Redis for caching (optional, can be disabled for SQLite mode)
- Knife4j for Swagger documentation at `/api/doc.html`
- BCrypt password encoding
- Spring Security with method-level security (`@PreAuthorize`)
- Global exception handling via `GlobalExceptionHandler`
- Controllers: `AuthController`, `UserController`, `RoleController`, `MenuController`, `DepartmentController`, `DictController`, `ConfigController`, `ReportController`, `OperationLogController`, `LoginLogController`
- Mapper XML location: `classpath*:/mapper/**/*.xml` (if using XML mappers)
- SQLite support for development (configured in `application.yml`)

## Configuration Files

| File | Purpose |
|------|---------|
| `frontend/vite.config.ts` | Vite config, API proxy to `:8081`, path aliases |
| `frontend/tsconfig.json` | TypeScript paths matching Vite aliases |
| `frontend/package.json` | Frontend dependencies and scripts |
| `backend/pom.xml` | Maven dependencies (Spring Boot 3.2.2, MyBatis-Plus 3.5.5, JWT 0.12.3) |
| `backend/application.yml` | DB (MySQL/SQLite), Redis, JWT, MyBatis-Plus, OAuth2 config |
| `backend/src/main/resources/sql/init.sql` | Database initialization script |

## Backend API Endpoints

### Authentication
- `POST /api/auth/login` - User login (username/password)
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/register` - User registration
- `GET /api/auth/oauth2/github` - GitHub OAuth login

### System Management
- `GET/POST/PUT/DELETE /api/system/user` - User CRUD
- `GET/POST/PUT/DELETE /api/system/role` - Role CRUD
- `GET/POST/PUT/DELETE /api/system/menu` - Menu CRUD
- `GET/POST/PUT/DELETE /api/system/department` - Department CRUD

### Business
- `GET/POST/PUT/DELETE /api/business/dict` - Data dictionary CRUD
- `GET/POST/PUT/DELETE /api/business/config` - System config CRUD

### Reports
- `GET /api/report/*` - Report generation and statistics

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
| `sys_config` | System configuration key-value pairs |

## Environment Requirements

- Node.js >= 18.x
- JDK >= 17
- MySQL >= 8.0 (production)
- SQLite 3.x (development, optional)
- Redis >= 7.0 (optional, can be disabled)

## Development Notes

### SQLite Development Mode

The application supports SQLite as a development database. To use SQLite:

1. Ensure `spring.data.redis.enabled: false` in `application.yml`
2. Ensure datasource is configured for SQLite:
   ```yaml
   datasource:
     driver-class-name: org.sqlite.JDBC
     url: jdbc:sqlite:./data/enterprise_admin.db
   ```
3. Initialize the database:
   ```bash
   cd backend/data
   sqlite3 enterprise_admin.db < ../src/main/resources/sql/init-sqlite.sql
   ```
4. Run the application with `mvn spring-boot:run`

**Important:** The application uses conditional bean configuration:
- `AuthServiceImpl` is used when Redis is enabled (default)
- `AuthServiceImplNoRedis` is used when Redis is disabled (SQLite mode)

### Known Issues

- **map-underscore-to-camel-case**: Must be set to `true` in MyBatis-Plus configuration for proper column mapping (e.g., `user_id` -> `userId`)
- **BCrypt password hashes**: Ensure password hashes in the database are generated with BCrypt (10 rounds). The default admin password is `admin123`.
- **SQLite INSERT syntax**: Use individual INSERT statements instead of multi-row inserts for compatibility

### Feature Documentation

Design specs and implementation plans are stored in `docs/superpowers/`:
- `specs/` - Feature design specifications
- `plans/` - Implementation plans