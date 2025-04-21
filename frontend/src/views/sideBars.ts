import { CACHE_STORE } from '@/data/cache';
import { SidebarTab } from '@components/SideBar/SideBar';
import { UserCache } from '@/data/user';

const userCache: UserCache = CACHE_STORE.getUser();

export const HomeSidebar: SidebarTab[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    url: 'dashboard',
  },
  {
    id: 'projects',
    title: 'Projects',
    url: 'projects',
  },
  {
    id: 'reports',
    title: 'Reports',
    url: 'reports',
  },
  {
    id: 'payments',
    title: 'Payments',
    url: 'payments',
    roles: ['Client', 'Hacker'],
  },
];

export const AdminSidebar: SidebarTab[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    url: 'admin',
  },
  {
    id: 'validator-applications',
    title: 'Validator Applications',
    url: 'admin/validator-applications',
  },
  {
    id: 'list-validators',
    title: 'List Validators',
    url: 'admin/list-validators',
  },
  {
    id: 'list-users',
    title: 'List Staff',
    url: 'admin/list-users',
  },
  {
    id: 'projects',
    title: 'Projects',
    url: 'admin/projects',
  },
  {
    id: 'reports',
    title: 'Reports',
    url: 'admin/reports',
  },
];
