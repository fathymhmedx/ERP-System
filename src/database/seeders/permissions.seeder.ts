import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from 'src/modules/permissions/entities/permission.entity';

@Injectable()
export class PermissionsSeeder {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async run(): Promise<void> {
    const permissions: Array<{
      module: string;
      name: string;
      description: string;
    }> = [
      // USERS
      {
        module: 'users',
        name: 'users.read',
        description: 'View user accounts',
      },
      {
        module: 'users',
        name: 'users.update',
        description: 'Update user accounts',
      },
      {
        module: 'users',
        name: 'users.activate',
        description: 'Activate user accounts',
      },
      {
        module: 'users',
        name: 'users.deactivate',
        description: 'Deactivate user accounts',
      },
      {
        module: 'users',
        name: 'users.reset-password',
        description: 'Reset user password',
      },

      // ROLES
      {
        module: 'roles',
        name: 'roles.create',
        description: 'Create roles',
      },
      {
        module: 'roles',
        name: 'roles.read',
        description: 'View roles',
      },
      {
        module: 'roles',
        name: 'roles.update',
        description: 'Update roles',
      },
      {
        module: 'roles',
        name: 'roles.delete',
        description: 'Delete roles',
      },

      // PERMISSIONS
      {
        module: 'permissions',
        name: 'permissions.read',
        description: 'View permissions',
      },
      {
        module: 'permissions',
        name: 'permissions.assign',
        description: 'Assign permissions to role',
      },
      {
        module: 'permissions',
        name: 'permissions.revoke',
        description: 'Revoke permissions from role',
      },

      // DEPARTMENTS
      {
        module: 'departments',
        name: 'departments.create',
        description: 'Create department',
      },
      {
        module: 'departments',
        name: 'departments.read',
        description: 'View departments',
      },
      {
        module: 'departments',
        name: 'departments.update',
        description: 'Update department',
      },
      {
        module: 'departments',
        name: 'departments.delete',
        description: 'Delete department',
      },

      //POSITIONS
      {
        module: 'positions',
        name: 'positions.create',
        description: 'Create position',
      },
      {
        module: 'positions',
        name: 'positions.read',
        description: 'View positions',
      },
      {
        module: 'positions',
        name: 'positions.update',
        description: 'Update position',
      },
      {
        module: 'positions',
        name: 'positions.delete',
        description: 'Delete position',
      },

      //EMPLOYEES
      {
        module: 'employees',
        name: 'employees.create',
        description: 'Create employee',
      },
      {
        module: 'employees',
        name: 'employees.read',
        description: 'View employees',
      },
      {
        module: 'employees',
        name: 'employees.update',
        description: 'Update employee',
      },
      {
        module: 'employees',
        name: 'employees.delete',
        description: 'Delete employee',
      },
      {
        module: 'employees',
        name: 'employees.assign-department',
        description: 'Assign department',
      },
      {
        module: 'employees',
        name: 'employees.assign-position',
        description: 'Assign position',
      },
      {
        module: 'employees',
        name: 'employees.assign-manager',
        description: 'Assign manager',
      },

      // ATTENDANCE
      {
        module: 'attendance',
        name: 'attendance.check-in',
        description: 'Employee check in',
      },
      {
        module: 'attendance',
        name: 'attendance.check-out',
        description: 'Employee check out',
      },
      {
        module: 'attendance',
        name: 'attendance.read',
        description: 'View attendance',
      },

      // LEAVES
      {
        module: 'leaves',
        name: 'leaves.request',
        description: 'Request leave',
      },
      {
        module: 'leaves',
        name: 'leaves.approve',
        description: 'Approve leave',
      },
      {
        module: 'leaves',
        name: 'leaves.reject',
        description: 'Reject leave',
      },
      {
        module: 'leaves',
        name: 'leaves.cancel',
        description: 'Cancel leave',
      },
      {
        module: 'leaves',
        name: 'leaves.read',
        description: 'View leave requests',
      },

      // PAYROLL
      {
        module: 'payroll',
        name: 'payroll.generate',
        description: 'Generate payroll',
      },
      {
        module: 'payroll',
        name: 'payroll.read',
        description: 'View payroll',
      },
      {
        module: 'payroll',
        name: 'payroll.bonus',
        description: 'Manage bonuses',
      },
      {
        module: 'payroll',
        name: 'payroll.deduction',
        description: 'Manage deductions',
      },

      // CATEGORIES
      {
        module: 'categories',
        name: 'categories.create',
        description: 'Create category',
      },
      {
        module: 'categories',
        name: 'categories.read',
        description: 'View categories',
      },
      {
        module: 'categories',
        name: 'categories.update',
        description: 'Update category',
      },
      {
        module: 'categories',
        name: 'categories.delete',
        description: 'Delete category',
      },

      //SUPPLIERS
      {
        module: 'suppliers',
        name: 'suppliers.create',
        description: 'Create supplier',
      },
      {
        module: 'suppliers',
        name: 'suppliers.read',
        description: 'View suppliers',
      },
      {
        module: 'suppliers',
        name: 'suppliers.update',
        description: 'Update supplier',
      },
      {
        module: 'suppliers',
        name: 'suppliers.delete',
        description: 'Delete supplier',
      },

      // PRODUCTS
      {
        module: 'products',
        name: 'products.create',
        description: 'Create product',
      },
      {
        module: 'products',
        name: 'products.read',
        description: 'View products',
      },
      {
        module: 'products',
        name: 'products.update',
        description: 'Update product',
      },
      {
        module: 'products',
        name: 'products.delete',
        description: 'Delete product',
      },
      {
        module: 'products',
        name: 'products.update-stock',
        description: 'Update product stock',
      },

      // CUSTOMERS
      {
        module: 'customers',
        name: 'customers.create',
        description: 'Create customer',
      },
      {
        module: 'customers',
        name: 'customers.read',
        description: 'View customers',
      },
      {
        module: 'customers',
        name: 'customers.update',
        description: 'Update customer',
      },
      {
        module: 'customers',
        name: 'customers.delete',
        description: 'Delete customer',
      },

      // ORDERS
      {
        module: 'orders',
        name: 'orders.create',
        description: 'Create order',
      },
      {
        module: 'orders',
        name: 'orders.read',
        description: 'View orders',
      },
      {
        module: 'orders',
        name: 'orders.update',
        description: 'Update order',
      },
      {
        module: 'orders',
        name: 'orders.cancel',
        description: 'Cancel order',
      },

      // ORDER ITEMS
      {
        module: 'orders',
        name: 'orders.add-item',
        description: 'Add item to order',
      },
      {
        module: 'orders',
        name: 'orders.remove-item',
        description: 'Remove item from order',
      },
      {
        module: 'orders',
        name: 'orders.update-item',
        description: 'Update order item',
      },

      // INVOICES
      {
        module: 'invoices',
        name: 'invoices.generate',
        description: 'Generate invoice',
      },
      {
        module: 'invoices',
        name: 'invoices.read',
        description: 'View invoices',
      },

      // NOTIFICATIONS
      {
        module: 'notifications',
        name: 'notifications.read',
        description: 'View notifications',
      },
      {
        module: 'notifications',
        name: 'notifications.mark-read',
        description: 'Mark notification as read',
      },

      // AUDIT LOGS
      {
        module: 'audit-logs',
        name: 'audit-logs.read',
        description: 'View audit logs',
      },

      // DASHBOARD
      {
        module: 'dashboard',
        name: 'dashboard.read',
        description: 'View dashboard',
      },
    ];

    for (const permission of permissions) {
      const exists = await this.permissionRepository.exists({
        where: {
          name: permission.name,
        },
      });

      if (!exists) {
        await this.permissionRepository.save(permission);
      }
    }

    console.log('Permissions seeded successfully');
  }
}
