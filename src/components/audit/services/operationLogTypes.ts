
// Define the OperationLog interface for use in components
export interface OperationLog {
  id: string;
  eventType: string;
  entityType: string;
  details: string | null;
  recordCount: number | null;
  format: string | null;
  created_at: string;
  userId: string | null;
  userName: string | null;
  createdAt: string;
  user?: { name: string | null } | null;
}

export interface LogOperationParams {
  eventType: string;
  entityType: string;
  details?: string;
  recordCount?: number;
  format?: string;
}

export interface OperationLogQuery {
  limit?: number;
  offset?: number;
  user_id?: string;
  entity_type?: string;
  event_type?: string;
  startDate?: string;
  endDate?: string;
}

export interface OperationStats {
  byType: Array<{ event_type: string; count: number }>;
  byEntity: Array<{ entity_type: string; count: number }>;
  activeUsers: Array<{ id: string; name: string; count: number }>;
}
