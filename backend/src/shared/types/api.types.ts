// Standardized API Response Contracts

export type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
  message?: string;
  timestamp: string;
};
