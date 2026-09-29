import { formatRelativeTime, isoMinutesAgo, pluralize } from "./dashboard-helpers";

export interface NotificationDTO {
  id: string;
  title: string;
  body?: string | null;
  createdAt: string;
  read: boolean;
}

export interface NotificationsResponse {
  unreadCount: number;
  items: NotificationDTO[];
}

export function getMockNotifications(): NotificationsResponse {
  return {
    unreadCount: 2,
    items: [
      { id: "n1", title: "Care plan review due", body: "Dorothy Chen · due tomorrow", createdAt: isoMinutesAgo(25), read: false },
      { id: "n2", title: "Visit completed", body: "Margaret Johnson · 60 min", createdAt: isoMinutesAgo(90), read: false },
      { id: "n3", title: "New patient added", body: "Sophie Martinez", createdAt: isoMinutesAgo(60 * 20), read: true },
    ],
  };
}


export interface NotificationRow {
  id: string;
  title: string;
  body?: string;
  time: string;
  read: boolean;
}

export interface NotificationsView {
  unreadCount: number;
  subtitle: string;
  srLabel: string; 
  rows: NotificationRow[];
}

export function getNotificationsSubtitle(unreadCount: number): string {
  if (unreadCount <= 0) return "You have no new notifications.";
  return `You have ${unreadCount} new ${pluralize(unreadCount, "notification")}.`;
}

export function getNotificationsView(): NotificationsView {
  const { unreadCount, items } = getMockNotifications();

  return {
    unreadCount,
    subtitle: getNotificationsSubtitle(unreadCount),
    srLabel: `Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`,
    rows: items.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body ?? undefined,
      time: formatRelativeTime(n.createdAt),
      read: n.read,
    })),
  };
}
