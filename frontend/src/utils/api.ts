const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(
  path: string,
  method: string = "GET",
  body?: any,
  userId?: number
): Promise<T> {
  const headers: Record<string, string> = {};

  if (userId) {
    headers["x-user-id"] = String(userId);
  }

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "API request failed");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  users: {
    getMe: (userId: number) => request<any>("/users/me", "GET", undefined, userId),
    updateRole: (userId: number, role: string) =>
      request<any>("/users/me/role", "PUT", { role }, userId),
  },
  listings: {
    list: (filters: Record<string, any> = {}) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          params.append(key, String(val));
        }
      });
      return request<any[]>(`/listings?${params.toString()}`);
    },
    get: (id: number) => request<any>(`/listings/${id}`),
    create: (data: any, userId: number) => request<any>("/listings", "POST", data, userId),
    update: (id: number, data: any, userId: number) =>
      request<any>(`/listings/${id}`, "PUT", data, userId),
    delete: (id: number, userId: number) => request<void>(`/listings/${id}`, "DELETE", undefined, userId),
  },
  bookings: {
    list: (userId: number) => request<any[]>("/bookings", "GET", undefined, userId),
    create: (data: any, userId: number) => request<any>("/bookings", "POST", data, userId),
    cancel: (id: number, userId: number) =>
      request<any>(`/bookings/${id}`, "DELETE", undefined, userId),
  },
  reviews: {
    create: (data: any, userId: number) => request<any>("/reviews", "POST", data, userId),
  },
  wishlist: {
    list: (userId: number) => request<any[]>("/wishlist", "GET", undefined, userId),
    add: (listingId: number, userId: number) =>
      request<any>(`/wishlist/${listingId}`, "POST", undefined, userId),
    remove: (listingId: number, userId: number) =>
      request<void>(`/wishlist/${listingId}`, "DELETE", undefined, userId),
  },
};
