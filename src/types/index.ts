// ==================== USER & AUTH ====================
export interface User {
  id: number;
  fullName: string;
  email: string;
  role: "Admin" | "User";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ==================== ROOM ====================
export interface Room {
  id: number;
  name: string;
  location: string;
  capacity: number;
  description?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateRoomRequest {
  name: string;
  location: string;
  capacity: number;
  description?: string;
}

export interface UpdateRoomRequest {
  name: string;
  location: string;
  capacity: number;
  description?: string;
  isAvailable: boolean;
}

// ==================== BORROWING ====================
export interface StatusHistory {
  id: number;
  previousStatus: string;
  newStatus: string;
  note?: string;
  changedByName: string;
  changedAt: string;
}

export interface Borrowing {
  id: number;
  roomId: number;
  roomName: string;
  roomLocation: string;
  borrowDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "Pending" | "Approved" | "Rejected";
  borrowerName: string;
  borrowerEmail: string;
  createdAt: string;
  updatedAt?: string;
  statusHistories: StatusHistory[];
}

export interface CreateBorrowingRequest {
  roomId: number;
  borrowDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
}

export interface UpdateBorrowingRequest {
  roomId: number;
  borrowDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
}

export interface UpdateStatusRequest {
  status: "Approved" | "Rejected";
  note?: string;
}

// ==================== PAGINATION ====================
export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface BorrowingQueryParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  roomId?: number;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}
