export const PERMISSIONS = {
  // USERS
  USERS: {
    READ: 'users.read',
    UPDATE: 'users.update',
    ACTIVATE: 'users.activate',
    DEACTIVATE: 'users.deactivate',
    RESET_PASSWORD: 'users.reset-password',
  },

  // ROLES
  ROLES: {
    CREATE: 'roles.create',
    READ: 'roles.read',
    UPDATE: 'roles.update',
    DELETE: 'roles.delete',
  },

  // PERMISSIONS
  PERMISSIONS: {
    READ: 'permissions.read',
    ASSIGN: 'permissions.assign',
    REVOKE: 'permissions.revoke',
  },

  // DEPARTMENTS
  DEPARTMENTS: {
    CREATE: 'departments.create',
    READ: 'departments.read',
    UPDATE: 'departments.update',
    DELETE: 'departments.delete',
  },

  // POSITIONS
  POSITIONS: {
    CREATE: 'positions.create',
    READ: 'positions.read',
    UPDATE: 'positions.update',
    DELETE: 'positions.delete',
  },

  // EMPLOYEES
  EMPLOYEES: {
    CREATE: 'employees.create',
    READ: 'employees.read',
    UPDATE: 'employees.update',
    DELETE: 'employees.delete',

    ASSIGN_DEPARTMENT: 'employees.assign-department',
    ASSIGN_POSITION: 'employees.assign-position',
    ASSIGN_MANAGER: 'employees.assign-manager',
  },

  // ATTENDANCE
  ATTENDANCE: {
    CHECK_IN: 'attendance.check-in',
    CHECK_OUT: 'attendance.check-out',
    READ: 'attendance.read',
  },

  // LEAVES
  LEAVES: {
    REQUEST: 'leaves.request',
    APPROVE: 'leaves.approve',
    REJECT: 'leaves.reject',
    CANCEL: 'leaves.cancel',
    READ: 'leaves.read',
  },

  // PAYROLL
  PAYROLL: {
    GENERATE: 'payroll.generate',
    READ: 'payroll.read',
    BONUS: 'payroll.bonus',
    DEDUCTION: 'payroll.deduction',
  },

  // CATEGORIES
  CATEGORIES: {
    CREATE: 'categories.create',
    READ: 'categories.read',
    UPDATE: 'categories.update',
    DELETE: 'categories.delete',
  },

  // SUPPLIERS
  SUPPLIERS: {
    CREATE: 'suppliers.create',
    READ: 'suppliers.read',
    UPDATE: 'suppliers.update',
    DELETE: 'suppliers.delete',
  },

  // PRODUCTS
  PRODUCTS: {
    CREATE: 'products.create',
    READ: 'products.read',
    UPDATE: 'products.update',
    DELETE: 'products.delete',

    UPDATE_STOCK: 'products.update-stock',
  },

  // CUSTOMERS
  CUSTOMERS: {
    CREATE: 'customers.create',
    READ: 'customers.read',
    UPDATE: 'customers.update',
    DELETE: 'customers.delete',
  },

  // ORDERS
  ORDERS: {
    CREATE: 'orders.create',
    READ: 'orders.read',
    UPDATE: 'orders.update',
    CANCEL: 'orders.cancel',

    ADD_ITEM: 'orders.add-item',
    REMOVE_ITEM: 'orders.remove-item',
    UPDATE_ITEM: 'orders.update-item',
  },

  // INVOICES
  INVOICES: {
    GENERATE: 'invoices.generate',
    READ: 'invoices.read',
  },

  // NOTIFICATIONS
  NOTIFICATIONS: {
    READ: 'notifications.read',
    MARK_READ: 'notifications.mark-read',
  },

  // AUDIT LOGS
  AUDIT_LOGS: {
    READ: 'audit-logs.read',
  },

  // DASHBOARD
  DASHBOARD: {
    READ: 'dashboard.read',
  },
} as const;

type PermissionValues<T> = T extends object ? PermissionValues<T[keyof T]> : T;

export type Permission = PermissionValues<typeof PERMISSIONS>;
