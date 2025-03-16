export interface SimpleResponse {
  success: boolean;
  message: string;
}

export interface SimpleDataResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
