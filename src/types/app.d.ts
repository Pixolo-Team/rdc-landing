export type ApiResponseData<T> = {
  status: boolean;
  status_code: number;
  message: string;
  data: T;
};

export type AuthenticationResponseData = {
  token: string
}