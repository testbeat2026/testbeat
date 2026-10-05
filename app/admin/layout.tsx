const menu = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, show: true },
  { name: 'Live Orders & Reports', href: '/admin/orders', icon: ClipboardList, show: ['SUPER_ADMIN', 'ADMIN', 'FINANCE'].includes(role) },
  { name: 'Prescription Desk', href: '/admin/prescriptions', icon: FileText, show: ['SUPER_ADMIN', 'ADMIN', 'SALES'].includes(role) },
  { name: 'Lab Partners & APIs', href: '/admin/labs', icon: Building2, show: ['SUPER_ADMIN', 'ADMIN'].includes(role) },
  { name: 'Live Visitors & Leads', href: '/admin/visitors', icon: Eye, show: ['SUPER_ADMIN', 'SALES'].includes(role) },
  { name: 'User & Roles', href: '/admin/users', icon: ShieldCheck, show: role === 'SUPER_ADMIN' },
  { name: 'Finance & P&L', href: '/admin/finance', icon: Wallet, show: ['SUPER_ADMIN', 'FINANCE'].includes(role) },
  { name: 'Affiliate Desk', href: '/admin/affiliates', icon: BadgePercent, show: ['SUPER_ADMIN', 'AFFILIATE'].includes(role) },
  { name: 'Settings', href: '/admin/settings', icon: Settings, show: ['SUPER_ADMIN', 'ADMIN'].includes(role) },
].filter(item => item.show);
