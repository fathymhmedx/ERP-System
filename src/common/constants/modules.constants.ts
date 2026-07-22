export const MODULES = [
  'users',
  'roles',
  'permissions',
  'departments',
  'positions',
  'employees',
  'attendance',
  'leaves',
  'payroll',
  'categories',
  'suppliers',
  'products',
  'customers',
  'orders',
  'invoices',
  'notifications',
  'audit-logs',
  'dashboard',
] as const;

export type Module = (typeof MODULES)[number];
