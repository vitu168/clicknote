export type StatColor = 'indigo' | 'emerald' | 'amber' | 'rose';
export type StatIconKey = 'DollarSign' | 'Users' | 'ShoppingCart' | 'Activity';

export interface Stat {
  id: string;
  label: string;
  value: string;
  change: number;
  positive: boolean;
  iconKey: StatIconKey;
  color: StatColor;
  description: string;
}

export interface Transaction {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  avatarColor: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  growth: number;
  emoji: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Developer' | 'Viewer';
  status: 'active' | 'inactive' | 'pending';
  joined: string;
  lastActive: string;
  avatarColor: string;
  location: string;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  users: number;
}

export interface TrafficSource {
  name: string;
  percentage: number;
  color: string;
  dotClass: string;
}

export const stats: Stat[] = [
  {
    id: 'revenue',
    label: 'Monthly Sales',
    value: '$124,800',
    change: 14.2,
    positive: true,
    iconKey: 'DollarSign',
    color: 'indigo',
    description: 'vs last month',
  },
  {
    id: 'devices',
    label: 'Managed Devices',
    value: '1,842',
    change: 6.7,
    positive: true,
    iconKey: 'Users',
    color: 'emerald',
    description: 'vs last month',
  },
  {
    id: 'orders',
    label: 'Open Orders',
    value: '247',
    change: 3.1,
    positive: true,
    iconKey: 'ShoppingCart',
    color: 'amber',
    description: 'vs last month',
  },
  {
    id: 'resolution',
    label: 'Resolution Rate',
    value: '94.5%',
    change: 1.2,
    positive: false,
    iconKey: 'Activity',
    color: 'rose',
    description: 'vs last month',
  },
];

export const revenueData: RevenuePoint[] = [
  { month: 'Sep', revenue: 68000, users: 820 },
  { month: 'Oct', revenue: 74500, users: 940 },
  { month: 'Nov', revenue: 71200, users: 890 },
  { month: 'Dec', revenue: 89000, users: 1140 },
  { month: 'Jan', revenue: 85400, users: 1280 },
  { month: 'Feb', revenue: 98700, users: 1520 },
  { month: 'Mar', revenue: 112000, users: 1680 },
  { month: 'Apr', revenue: 124800, users: 1842 },
];

export const recentTransactions: Transaction[] = [
  {
    id: 'ORD-5521',
    customer: 'Sarah Johnson',
    email: 'sarah@innotek.io',
    product: 'MacBook Pro 14" M3',
    amount: 1999,
    status: 'completed',
    date: '2026-04-20',
    avatarColor: 'bg-violet-500',
  },
  {
    id: 'ORD-5520',
    customer: 'Mike Chen',
    email: 'mike@designhub.co',
    product: 'iPhone 15 Pro Max',
    amount: 1199,
    status: 'completed',
    date: '2026-04-20',
    avatarColor: 'bg-blue-500',
  },
  {
    id: 'ORD-5519',
    customer: 'Emily Davis',
    email: 'emily@startup.io',
    product: 'iPad Pro 12.9"',
    amount: 1099,
    status: 'pending',
    date: '2026-04-19',
    avatarColor: 'bg-emerald-500',
  },
  {
    id: 'ORD-5518',
    customer: 'James Wilson',
    email: 'james@agency.net',
    product: 'AirPods Pro 2nd Gen',
    amount: 249,
    status: 'completed',
    date: '2026-04-19',
    avatarColor: 'bg-amber-500',
  },
  {
    id: 'ORD-5517',
    customer: 'Olivia Martinez',
    email: 'olivia@media.co',
    product: 'Screen Protection Plan',
    amount: 149,
    status: 'refunded',
    date: '2026-04-18',
    avatarColor: 'bg-pink-500',
  },
  {
    id: 'ORD-5516',
    customer: 'Liam Thompson',
    email: 'liam@cloud.io',
    product: 'Dell XPS 15',
    amount: 1899,
    status: 'failed',
    date: '2026-04-18',
    avatarColor: 'bg-orange-500',
  },
  {
    id: 'ORD-5515',
    customer: 'Sophia Lee',
    email: 'sophia@devs.com',
    product: 'Samsung Galaxy S24',
    amount: 1099,
    status: 'completed',
    date: '2026-04-17',
    avatarColor: 'bg-cyan-500',
  },
  {
    id: 'ORD-5514',
    customer: 'Noah Brown',
    email: 'noah@ventures.dev',
    product: 'MacBook Air M2',
    amount: 1299,
    status: 'completed',
    date: '2026-04-17',
    avatarColor: 'bg-indigo-500',
  },
];

export const topProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 14" M3',
    category: 'Laptop',
    sales: 184,
    revenue: 367816,
    growth: 22.4,
    emoji: '💻',
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    category: 'Smartphone',
    sales: 312,
    revenue: 311688,
    growth: 18.7,
    emoji: '📱',
  },
  {
    id: '3',
    name: 'iPad Pro 12.9"',
    category: 'Tablet',
    sales: 227,
    revenue: 227773,
    growth: 11.2,
    emoji: '📋',
  },
  {
    id: '4',
    name: 'AirPods Pro 2nd Gen',
    category: 'Audio',
    sales: 489,
    revenue: 122261,
    growth: 31.5,
    emoji: '🎧',
  },
  {
    id: '5',
    name: 'Screen Protection Plan',
    category: 'Service',
    sales: 640,
    revenue: 95960,
    growth: 8.3,
    emoji: '🛡️',
  },
];

export const users: User[] = [
  {
    id: 'USR-001',
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.io',
    role: 'Admin',
    status: 'active',
    joined: '2025-01-15',
    lastActive: '2026-04-20',
    avatarColor: 'bg-violet-500',
    location: 'San Francisco, CA',
  },
  {
    id: 'USR-002',
    name: 'Mike Chen',
    email: 'mike@devstudio.com',
    role: 'Developer',
    status: 'active',
    joined: '2025-02-08',
    lastActive: '2026-04-20',
    avatarColor: 'bg-blue-500',
    location: 'Austin, TX',
  },
  {
    id: 'USR-003',
    name: 'Emily Davis',
    email: 'emily@startup.co',
    role: 'Editor',
    status: 'active',
    joined: '2025-03-22',
    lastActive: '2026-04-19',
    avatarColor: 'bg-emerald-500',
    location: 'New York, NY',
  },
  {
    id: 'USR-004',
    name: 'James Wilson',
    email: 'james@agency.net',
    role: 'Viewer',
    status: 'inactive',
    joined: '2025-04-10',
    lastActive: '2026-03-15',
    avatarColor: 'bg-amber-500',
    location: 'Chicago, IL',
  },
  {
    id: 'USR-005',
    name: 'Olivia Martinez',
    email: 'olivia@design.co',
    role: 'Editor',
    status: 'active',
    joined: '2025-05-03',
    lastActive: '2026-04-18',
    avatarColor: 'bg-pink-500',
    location: 'Los Angeles, CA',
  },
  {
    id: 'USR-006',
    name: 'Liam Thompson',
    email: 'liam@cloud.io',
    role: 'Developer',
    status: 'pending',
    joined: '2025-06-17',
    lastActive: '2026-04-17',
    avatarColor: 'bg-orange-500',
    location: 'Seattle, WA',
  },
  {
    id: 'USR-007',
    name: 'Sophia Lee',
    email: 'sophia@media.com',
    role: 'Viewer',
    status: 'active',
    joined: '2025-07-29',
    lastActive: '2026-04-20',
    avatarColor: 'bg-cyan-500',
    location: 'Boston, MA',
  },
  {
    id: 'USR-008',
    name: 'Noah Brown',
    email: 'noah@saas.dev',
    role: 'Admin',
    status: 'active',
    joined: '2025-08-14',
    lastActive: '2026-04-19',
    avatarColor: 'bg-indigo-500',
    location: 'Denver, CO',
  },
  {
    id: 'USR-009',
    name: 'Ava Garcia',
    email: 'ava@fintech.io',
    role: 'Developer',
    status: 'active',
    joined: '2025-09-05',
    lastActive: '2026-04-20',
    avatarColor: 'bg-teal-500',
    location: 'Miami, FL',
  },
  {
    id: 'USR-010',
    name: 'Ethan Robinson',
    email: 'ethan@ops.dev',
    role: 'Editor',
    status: 'inactive',
    joined: '2025-10-20',
    lastActive: '2026-02-28',
    avatarColor: 'bg-red-500',
    location: 'Portland, OR',
  },
  {
    id: 'USR-011',
    name: 'Isabella Clark',
    email: 'isabella@ux.co',
    role: 'Developer',
    status: 'active',
    joined: '2025-11-11',
    lastActive: '2026-04-18',
    avatarColor: 'bg-lime-500',
    location: 'Nashville, TN',
  },
  {
    id: 'USR-012',
    name: 'Mason Lewis',
    email: 'mason@growth.io',
    role: 'Viewer',
    status: 'pending',
    joined: '2025-12-03',
    lastActive: '2026-04-16',
    avatarColor: 'bg-fuchsia-500',
    location: 'Phoenix, AZ',
  },
];

export const trafficSources: TrafficSource[] = [
  { name: 'Organic Search', percentage: 45, color: '#6366F1', dotClass: 'bg-indigo-500' },
  { name: 'Direct',         percentage: 30, color: '#10B981', dotClass: 'bg-emerald-500' },
  { name: 'Social Media',   percentage: 15, color: '#F59E0B', dotClass: 'bg-amber-500' },
  { name: 'Referral',       percentage: 10, color: '#F43F5E', dotClass: 'bg-rose-500' },
];

export const monthlyAnalytics = [
  { month: 'Sep', visitors: 4200, pageViews: 12800, conversions: 136 },
  { month: 'Oct', visitors: 5100, pageViews: 15400, conversions: 165 },
  { month: 'Nov', visitors: 4800, pageViews: 14200, conversions: 155 },
  { month: 'Dec', visitors: 6300, pageViews: 18900, conversions: 204 },
  { month: 'Jan', visitors: 5900, pageViews: 17600, conversions: 191 },
  { month: 'Feb', visitors: 7200, pageViews: 21500, conversions: 233 },
  { month: 'Mar', visitors: 7900, pageViews: 23600, conversions: 256 },
  { month: 'Apr', visitors: 8400, pageViews: 25100, conversions: 272 },
];

export const weeklyPageViews = [
  { day: 'Mon', views: 2840 },
  { day: 'Tue', views: 3120 },
  { day: 'Wed', views: 2950 },
  { day: 'Thu', views: 3680 },
  { day: 'Fri', views: 4120 },
  { day: 'Sat', views: 2480 },
  { day: 'Sun', views: 1920 },
];
