export type Role = 'owner' | 'admin' | 'manager' | 'employee' | 'viewer' | 'free_user';

export const GRANULAR_PERMISSIONS = [
  { id: 'view:dashboard', label: 'View Dashboard', description: 'Can access the main dashboard overview.' },
  { id: 'view:invoices', label: 'View Invoices', description: 'Can see the list of invoices.' },
  { id: 'create:invoice', label: 'Create Invoice', description: 'Can create new invoices.' },
  { id: 'view:estimates', label: 'View Estimates', description: 'Can see the list of estimates.' },
  { id: 'create:estimate', label: 'Create Estimate', description: 'Can create new estimates.' },
  { id: 'view:quotes', label: 'View Quotes', description: 'Can see the list of quotes.' },
  { id: 'create:quote', label: 'Create Quote', description: 'Can create new quotes.' },
  { id: 'view:insurance', label: 'View Insurance', description: 'Can see insurance documents.' },
  { id: 'create:insurance', label: 'Create Insurance', description: 'Can create insurance documents.' },
  { id: 'view:clients', label: 'View Clients', description: 'Can see the client directory.' },
  { id: 'create:client', label: 'Create Client', description: 'Can add new clients.' },
  { id: 'view:analytics', label: 'View Analytics', description: 'Can access the analytics dashboard.' },
  { id: 'view:employees', label: 'View Employees', description: 'Can see the employee directory.' },
  { id: 'manage:employees', label: 'Manage Employees', description: 'Can invite and edit employees.' },
  { id: 'view:settings', label: 'Access Settings', description: 'Can view general workspace settings.' },
] as const;

export interface PermissionMatrix {
  [key: string]: Role[];
}

export const PERMISSIONS: PermissionMatrix = {
  // dashboard
  'view:dashboard': ['owner', 'admin', 'manager', 'employee', 'viewer', 'free_user'],
  'view:analytics': ['owner', 'admin', 'manager', 'viewer', 'free_user'],

  // invoices
  'view:invoices': ['owner', 'admin', 'manager', 'employee', 'viewer', 'free_user'],
  'create:invoice': ['owner', 'admin', 'manager', 'employee', 'free_user'],
  'edit:invoice': ['owner', 'admin', 'manager', 'free_user'],
  'delete:invoice': ['owner', 'admin', 'free_user'],

  // estimates
  'view:estimates': ['owner', 'admin', 'manager', 'employee', 'viewer', 'free_user'],
  'create:estimate': ['owner', 'admin', 'manager', 'employee', 'free_user'],
  'edit:estimate': ['owner', 'admin', 'manager', 'free_user'],
  'delete:estimate': ['owner', 'admin', 'free_user'],

  // quotes
  'view:quotes': ['owner', 'admin', 'manager', 'employee', 'viewer', 'free_user'],
  'create:quote': ['owner', 'admin', 'manager', 'employee', 'free_user'],
  'edit:quote': ['owner', 'admin', 'manager', 'free_user'],
  'delete:quote': ['owner', 'admin', 'free_user'],

  // insurance
  'view:insurance': ['owner', 'admin', 'manager', 'employee', 'viewer', 'free_user'],
  'create:insurance': ['owner', 'admin', 'manager', 'employee', 'free_user'],
  'edit:insurance': ['owner', 'admin', 'manager', 'free_user'],
  'delete:insurance': ['owner', 'admin', 'free_user'],

  // clients
  'view:clients': ['owner', 'admin', 'manager', 'employee', 'viewer', 'free_user'],
  'create:client': ['owner', 'admin', 'manager', 'employee', 'free_user'],
  'edit:client': ['owner', 'admin', 'manager', 'free_user'],
  'delete:client': ['owner', 'admin', 'free_user'],

  // employees
  'view:employees': ['owner', 'admin', 'manager', 'employee', 'viewer', 'free_user'],
  'manage:employees': ['admin', 'owner'],

  // legacy / records (fallback)
  'view:records': ['owner', 'admin', 'manager', 'employee', 'free_user'],
  'create:records': ['owner', 'admin', 'manager', 'employee', 'free_user'],
  'edit:records': ['owner', 'admin', 'manager', 'free_user'],
  'delete:records': ['owner', 'admin', 'free_user'],

  // settings
  'view:settings': ['owner', 'admin', 'manager', 'employee', 'free_user'], // Base access to settings layout
  'view:settings:general': ['owner', 'admin', 'free_user'],
  'view:settings:appearance': ['owner', 'admin', 'manager', 'employee', 'viewer', 'free_user'],
  'view:settings:notifications': ['owner', 'admin', 'manager', 'employee', 'viewer', 'free_user'],
  'view:settings:security': ['admin', 'owner', 'free_user'],
  'view:settings:users': ['admin', 'owner'],
  'view:settings:integrations': ['admin', 'owner', 'free_user'],
  'view:settings:billing': ['owner', 'admin', 'free_user'],
  'view:settings:data': ['admin', 'owner', 'free_user'],
  'view:settings:audit': ['admin', 'owner', 'free_user'],
  'view:settings:portal': ['owner'],
};

export const hasAccess = (roleOrUser: string | { role?: string; plan?: string; permissions?: string[] } | undefined | null, permission: string): boolean => {
  if (!roleOrUser) return false;

  let role: string | undefined;
  let plan: string | undefined;
  let userPermissions: string[] = [];

  if (typeof roleOrUser === 'string') {
    role = roleOrUser;
  } else {
    role = roleOrUser.role;
    plan = roleOrUser.plan;
    userPermissions = roleOrUser.permissions || [];
  }

  // Normalize role
  const normalizedRole = role?.toLowerCase() as Role | undefined;

  // 1. Owners and Admins have full access to everything
  if (normalizedRole === 'owner' || normalizedRole === 'admin') return true;

  // 3. Check for granular permission override
  if (userPermissions.includes(permission)) return true;

  // 4. Default RBAC check
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles ? allowedRoles.includes(normalizedRole as Role) : false;
};

export const canViewSettingsTab = (roleOrUser: string | { role?: string; plan?: string } | undefined | null, tab: string): boolean => {
  return hasAccess(roleOrUser, `view:settings:${tab}`);
};

export const getPermissionsSummary = (role: Role): string => {
  switch (role) {
    case 'owner':
      return 'Full access to all settings, billing, and team management.';
    case 'admin':
      return 'Manage records, settings, and team members.';
    case 'manager':
      return 'Manage records and view analytics/notifications.';
    case 'employee':
      return 'Create and edit records, view general settings.';
    case 'viewer':
      return 'View dashboard and analytics only.';
    case 'free_user':
      return 'Basic record management for solo users.';
    default:
      return 'No specific permissions defined.';
  }
};
