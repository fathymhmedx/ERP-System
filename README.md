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
- Redis
- JWT Authentication
- Refresh Tokens
- RBAC
- Class Validator
- Class Transformer
- Passport.js
- bcrypt
- Docker
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

## Performance & Concurrency

- Redis Caching
- Cache-Aside Pattern
- Cache Invalidation
- Cache Stampede Protection
- Distributed Locking
- Double-Check Locking
- Lock TTL
- Lock Ownership
- Atomic Lua-based Lock Release
- Concurrency Control

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

### RBAC Caching & Distributed Locking

- [x] Redis Integration
- [x] Role Caching using Cache-Aside Pattern
- [x] Permission Caching using Cache-Aside Pattern
- [x] Cache Invalidation on Role & Permission Changes
- [x] Cache Stampede Protection
- [x] Distributed Locking
- [x] Double-Check Locking
- [x] Lock Ownership using Unique Lock Tokens
- [x] Lock TTL for Failure Protection
- [x] Atomic Lock Release using Lua Script
- [x] Safe Cache Invalidation with Distributed Locking
- [x] Redis-based RBAC Permission Checks
- [x] Super Admin Permission Bypass

### Users

- [x] Get Profile
- [x] Get Users
- [x] Get User
- [x] Create User
- [x] Search Users
- [x] Filter Users
- [x] Pagination
- [x] Activate User
- [x] Deactivate User
- [x] Reset Password
- [x] Revoke All Sessions After Deactivation
- [x] Revoke All Sessions After Password Reset

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

- [x] Create Department
- [x] Update Department
- [x] Delete Department
- [x] Get Departments

### Positions

- [x] Create Position
- [x] Update Position
- [x] Delete Position
- [x] Get Positions

### Employees

- [x] Get Me
- [x] Create Employee
- [x] Update Employee
- [x] Soft Delete Employee
- [x] Get Employee
- [x] Get Employees
- [x] Search Employees
- [x] Filter Employees
- [x] Pagination
- [x] Assign Department
- [x] Assign Position
- [x] Assign Manager
- [x] Assign User Account

---

## Phase 4 — HR Operations

### Attendance

- [x] Check In
- [x] Check Out
- [x] Attendance History
- [x] Monthly Attendance Report

### Leaves

- [x] Request Leave
- [x] Approve Leave
- [x] Reject Leave
- [x] Cancel Leave
- [x] Leave History

### Payroll

- [x] Generate Payroll
- [x] Payroll History
- [x] Bonus (Create, Get, Delete)
- [x] Deduction (Create, Get, Delete)

---

## Phase 5 — Inventory

### Categories

- [x] CRUD Categories
- [x] Search Categories
- [x] Pagination Categories
- [x] Soft Delete Categories

### Suppliers

- [x] CRUD Suppliers
- [x] Search Suppliers
- [x] Pagination Suppliers
- [x] Soft Delete Suppliers

### Products

- [x] Create Product
- [x] Update Product
- [x] Delete Product
- [x] Search Products
- [x] Filter Products
- [x] Pagination Products
- [x] Manage Current Stock
- [x] Product-Categories Relationship
- [x] Product-Suppliers Relationship
- [x] SKU Uniqueness Validation

### Stock Movements

- [ ] Create Stock Movement
- [ ] Stock In
- [ ] Stock Out
- [ ] Stock Adjustment
- [ ] Stock Movement History
- [ ] Stock Movement Filtering

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

- CI/CD
- Background Jobs
- Event Driven Architecture
- WebSockets
- Unit Testing
- E2E Testing
- Multi Tenancy
- Advanced Monitoring & Observability

---

# Implementation Status

| Module              | Status         |
| ------------------- | -------------- |
| Project Foundation  | ✅ Completed   |
| Authentication      | ✅ Completed   |
| Users               | ✅ Completed   |
| Roles               | ✅ Completed   |
| Permissions         | ✅ Completed   |
| Role Permissions    | ✅ Completed   |
| RBAC                | ✅ Completed   |
| RBAC Caching        | ✅ Completed   |
| Distributed Locking | ✅ Completed   |
| Departments         | ✅ Completed   |
| Positions           | ✅ Completed   |
| Employees           | ✅ Completed   |
| Attendance          | ✅ Completed   |
| Leaves              | ✅ Completed   |
| Payroll             | ✅ Completed   |
| Categories          | ✅ Completed   |
| Suppliers           | ✅ Completed   |
| Products            | ✅ Completed   |
| Stock Movements     | ⏳ Not Started |
| Customers           | ⏳ Not Started |
| Orders              | ⏳ Not Started |
| Invoices            | ⏳ Not Started |
| Notifications       | ⏳ Not Started |
| Audit Logs          | ⏳ Not Started |
| Dashboard           | ⏳ Not Started |
| Documentation       | 🟡 In Progress |
| Postman Collection  | ✅ Completed   |
| Testing             | ⏳ Not Started |

# License

This project is licensed under the MIT License.
