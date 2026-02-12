import api from "./axios";
import type { Borrowing, CreateBorrowingRequest } from "../types";

export async function createBorrowing(data: CreateBorrowingRequest) {
  const res = await api.post("/borrowings", data);
  return res.data;
}

export async function fetchMyBorrowings(): Promise<Borrowing[]> {
  const res = await api.get("/borrowings/me");
  return res.data;
}
