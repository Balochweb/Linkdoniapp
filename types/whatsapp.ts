export type WhatsAppItemType = 'channel' | 'group' | 'ad';

export interface WhatsAppItem {
  name: string;
  type: WhatsAppItemType;
  link: string;
  manager: string;
  category: string;
  description: string;
  premium: boolean;
  pending: boolean;
  members: string;
  imageUrl: string;
}
