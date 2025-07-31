export interface ErrorResponse {
  success: false;
  statusCode: number;
  timestamp: string;
  path: string;
  error: string | string[];
  message?: string;
}
