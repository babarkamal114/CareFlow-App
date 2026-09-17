export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  url: string,
  options?: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  },
): Promise<T> {
  const { method = 'GET', body, headers: customHeaders } = options ?? {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  
  const res = await fetch(url, {
    method,
    headers,
    credentials: 'include',
    ...(body != null && { body: JSON.stringify(body) }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof (data as { error?: string })?.error === 'string'
        ? (data as { error: string }).error
        : 'Request failed';
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}

export const apiClient = {
  get<T>(url: string, headers? : Record<string , string>): Promise<T> {
    return request<T>(url, { method: 'GET' ,headers});
  },
  post<T>(url: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return request<T>(url, { method: 'POST', body, headers });
  },
  put<T>(url: string, body?: unknown): Promise<T> {
    return request<T>(url, { method: 'PUT', body });
  },
  patch<T>(url: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return request<T>(url, { method: 'PATCH', body, headers });
  },
  delete<T>(url: string): Promise<T> {
    return request<T>(url, { method: 'DELETE' });
  },
};
 

