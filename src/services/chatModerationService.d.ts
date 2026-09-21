export interface ChatRoomSummary {
  modId: string;
  contentId: string;
  user: string;
  preview: string;
  riskScore: string;
  riskTone: 'danger' | 'warning' | 'success';
  violation: 'HARD VIOLATION' | 'NONE';
  decision: 'BLOCK' | 'FLAG' | 'ALLOW';
  status: string;
  timestamp: string;
  raw?: any;
}

export interface ChatRoomsPageResult {
  rooms: ChatRoomSummary[];
  count: number;
  page: number;
  totalPages: number;
}

export declare const CHAT_MODERATION_API_PATHS: {
  chatRooms: string;
  chatRoomDetail: (id: string | number) => string;
  chatRoomMessages: (id: string | number) => string;
};

export declare function normalizeChatRoom(room: any, index?: number): ChatRoomSummary;

export declare function fetchChatRoomsPage(options?: {
  baseUrl?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  task?: string | number;
  authenticatedFetch?: typeof fetch;
}): Promise<ChatRoomsPageResult>;

export declare function fetchChatRoomMessages(
  id: string | number,
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<any>;
