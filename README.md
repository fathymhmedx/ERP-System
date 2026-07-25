# ERP System - Development Roadmap

> A modern Enterprise Resource Planning (ERP) backend built with **NestJS**, **TypeORM**, and **PostgreSQL** following Clean Architecture, Repository Pattern, RBAC, JWT Authentication, and REST API best practices.

---

# Table of Contents

- [Project Goals](#project-goals)
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Development Roadmap](#development-roadmap)
- [Future Improvements](#future-improvements)
- [Implementation Status](#implementation-status)
- [License](#license)

---

## Project Goals

- Learn enterprise backend architecture using NestJS.
- Build a scalable ERP REST API.
- Apply Clean Code principles.
- Implement RBAC authentication & authorization.
- Practice TypeORM relationships and PostgreSQL design.

---

# Project Overview

This project aims to build a production-ready ERP backend system.

The system covers multiple business domains including:

- Authentication
- User Management
- Role & Permission Management
- Human Resources (HR)
- Attendance
- Payroll
- Inventory
- Sales
- Customers
- Suppliers
- Orders
- Invoices
- Dashboard & Reports

The main goal is to practice enterprise backend architecture using NestJS.

---

# Tech Stack

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- Refresh Tokens
- RBAC
- Class Validator
- Class Transformer
- Passport.js
- bcrypt
- pnpm

---

# Architecture

## Project Architecture

- Feature-Based Architecture
- Layered Architecture
- Repository Pattern

## API Design

- RESTful API
- DTO Validation
- Global Exception Handling
- Response Interceptors

## Security

- Authentication & Authorization
- Dynamic Role-Based Access Control (RBAC)
- JWT Authentication
- Refresh Token Rotation

## Data Management

- Soft Delete
- Pagination
- Filtering
- Searching
- Sorting

---

# Project Structure

```text
src
├── common
│   ├── decorators
│   ├── dto
│   ├── entities
│   ├── enums
│   ├── exceptions
│   ├── filters
│   ├── guards
│   ├── interceptors
│   ├── interfaces
│   ├── repositories
│   ├── types
│   └── utils
│
├── config
│
├── database
│   ├── migrations
│   ├── seeders
│   └── data-source.ts
│
├── modules
│   ├── auth
│   ├── users
│   ├── roles
│   ├── permissions
│   ├── departments
│   ├── positions
│   ├── employees
│   ├── attendance
│   ├── leaves
│   ├── payroll
│   ├── categories
│   ├── suppliers
│   ├── products
│   ├── customers
│   ├── orders
│   ├── invoices
│   ├── notifications
│   ├── audit-logs
│   └── dashboard
│
├── app.module.ts
└── main.ts
```

---

# Development Roadmap

## Phase 1 — Project Foundation

- [x] Initialize NestJS Project
- [x] Configure ESLint & Prettier
- [x] Environment Configuration
- [x] PostgreSQL Connection
- [x] TypeORM Configuration
- [x] Global Validation Pipe
- [x] Global Exception Filter
- [x] Global Response Interceptor
- [x] Husky + lint-staged
- [ ] Logger
- [x] Base Entity
- [x] CORS Configuration
- [x] Global Prefix

---

## Phase 2 — Authentication & Authorization

### Authentication

- [x] Register
- [x] Login
- [x] Logout
- [x] Logout All Devices
- [x] Refresh Token
- [x] Refresh Token Rotation & Session Management
- [x] Token Hashing
- [x] HttpOnly Cookie Storage
- [x] Change Password
- [x] Revoke All Sessions After Password Change
- [x] Expired Sessions Cleanup Scheduler

### Users

- [x] Get Profile
- [ ] Get Users
- [ ] Get User
- [ ] Activate User
- [ ] Deactivate User
- [ ] Reset Password

### Roles

- [x] CRUD Roles

### Permissions

- [x] Seed System Permissions
- [x] Get Permissions

### RBAC

- [x] Assign Permission to Role
- [x] Revoke Permission from Role
- [x] Roles Guard
- [x] Permissions Guard
- [x] Custom Decorators

---

## Phase 3 — Human Resources

### Departments

- [ ] Create Department
- [ ] Update Department
- [ ] Delete Department
- [ ] Get Departments

### Positions

- [ ] Create Position
- [ ] Update Position
- [ ] Delete Position
- [ ] Get Positions

### Employees

- [ ] Create Employee
- [ ] Update Employee
- [ ] Delete Employee
- [ ] Get Employee
- [ ] Get Employees
- [ ] Search Employees
- [ ] Filter Employees
- [ ] Assign Department
- [ ] Assign Position
- [ ] Assign Manager

---

## Phase 4 — HR Operations

### Attendance

- [ ] Check In
- [ ] Check Out
- [ ] Attendance History
- [ ] Monthly Attendance Report

### Leaves

- [ ] Request Leave
- [ ] Approve Leave
- [ ] Reject Leave
- [ ] Cancel Leave

### Payroll

- [ ] Generate Payroll
- [ ] Payroll History
- [ ] Bonus
- [ ] Deduction

---

## Phase 5 — Inventory

### Categories

- [ ] CRUD Categories

### Suppliers

- [ ] CRUD Suppliers

### Products

- [ ] Create Product
- [ ] Update Product
- [ ] Delete Product
- [ ] Search Products
- [ ] Filter Products
- [ ] Update Stock

---

## Phase 6 — Sales

### Customers

- [ ] CRUD Customers

### Orders

- [ ] Create Order
- [ ] Update Order
- [ ] Cancel Order
- [ ] Order History

### Order Items

- [ ] Add Product
- [ ] Remove Product
- [ ] Update Quantity

### Invoices

- [ ] Generate Invoice
- [ ] Get Invoice
- [ ] Invoice History

---

## Phase 7 — System Modules

### Notifications

- [ ] Get Notifications
- [ ] Mark Notification as Read

### Audit Logs

- [ ] Record System Activities
- [ ] Get Audit Logs

---

## Phase 8 — Dashboard

- [ ] Dashboard Statistics
- [ ] Employees Statistics
- [ ] Attendance Statistics
- [ ] Payroll Statistics
- [ ] Sales Statistics
- [ ] Inventory Statistics

---

## Phase 9 — Documentation

- [ ] Swagger Documentation
- [ ] README
- [ ] API Examples
- [ ] Database Diagram

---

## Phase 10 — Testing (Optional)

- [ ] Authentication Testing
- [ ] Employees Testing
- [ ] Orders Testing

---

# Future Improvements

- Redis
- Docker
- CI/CD
- Background Jobs
- Event Driven Architecture
- WebSockets
- Unit Testing
- E2E Testing
- Multi Tenancy

---

# Implementation Status

| Module             | Status         |
| ------------------ | -------------- |
| Project Foundation | ✅ Completed   |
| Authentication     | ✅ Completed   |
| Users              | 🟡 In Progress |
| Roles              | ✅ Completed   |
| Permissions        | ✅ Completed   |
| Role Permissions   | ✅ Completed   |
| RBAC               | ✅ Completed   |
| Departments        | ⏳ Not Started |
| Positions          | ⏳ Not Started |
| Employees          | ⏳ Not Started |
| Attendance         | ⏳ Not Started |
| Leaves             | ⏳ Not Started |
| Payroll            | ⏳ Not Started |
| Categories         | ⏳ Not Started |
| Suppliers          | ⏳ Not Started |
| Products           | ⏳ Not Started |
| Customers          | ⏳ Not Started |
| Orders             | ⏳ Not Started |
| Invoices           | ⏳ Not Started |
| Notifications      | ⏳ Not Started |
| Audit Logs         | ⏳ Not Started |
| Dashboard          | ⏳ Not Started |
| Documentation      | 🟡 In Progress |
| Postman Collection | ✅ Completed   |
| Testing            | ⏳ Not Started |

# License

This project is licensed under the MIT License.
