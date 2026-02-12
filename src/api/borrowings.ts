
import api from "./axios";
import type { Borrowing, CreateBorrowingRequest, UpdateBorrowingRequest } from "../types";

export async function createBorrowing(data: CreateBorrowingRequest) {
  const res = await api.post("/borrowings", data);
  return res.data;
}

export async function fetchMyBorrowings(): Promise<Borrowing[]> {
  const res = await api.get("/borrowings/me");
  return res.data;
}

export async function getBorrowingById(id: number): Promise<Borrowing> {
  const res = await api.get(`/borrowings/${id}`);
  return res.data;
}

export async function updateBorrowing(id: number, data: UpdateBorrowingRequest) {
  const res = await api.put(`/borrowings/${id}`, data);
  return res.data;
}

export async function cancelBorrowing(id: number) {
  const res = await api.patch(`/borrowings/${id}/cancel`);
  return res.data;
}
