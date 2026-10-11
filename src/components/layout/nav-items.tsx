import {
  LayoutGrid,
  Users,
  CalendarDays,
  QrCode,
  History,
  ShieldAlert,
} from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/', label: 'Tableau de bord', icon: LayoutGrid, end: true },
  { to: '/acces', label: 'Accès & utilisateurs', icon: Users, end: false },
  { to: '/emploi-du-temps', label: 'Emploi du temps & salles', icon: CalendarDays, end: false },
  { to: '/presences', label: 'Présences & QR', icon: QrCode, end: false },
  { to: '/fraude', label: 'Fraude', icon: ShieldAlert, end: false },
  { to: '/journal', label: "Journal d'activité", icon: History, end: false },
] as const;

// Sous-ensemble affiché dans la barre de navigation mobile (5 max)
export const MOBILE_NAV_ITEMS = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[3],
  NAV_ITEMS[5],
];
