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