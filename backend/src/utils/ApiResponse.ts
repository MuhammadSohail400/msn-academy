export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponseMeta {
  timestamp: string;
  requestId?: string;
  pagination?: PaginationMeta;
  [key: string]: unknown;
}

export class ApiResponse<T = unknown> {
  public readonly success: boolean = true;
  public readonly message: string;
  public readonly data: T;
  public readonly meta: ApiResponseMeta;

  constructor(message: string, data: T, meta?: Partial<ApiResponseMeta>) {
    this.message = message;
    this.data = data;
    this.meta = {
      timestamp: new Date().toISOString(),
      ...meta,
    };
  }

  public static ok<T>(data: T, message: string = 'Operation completed successfully', meta?: Partial<ApiResponseMeta>): ApiResponse<T> {
    return new ApiResponse(message, data, meta);
  }

  public static created<T>(data: T, message: string = 'Resource created successfully', meta?: Partial<ApiResponseMeta>): ApiResponse<T> {
    return new ApiResponse(message, data, meta);
  }
}

export default ApiResponse;
