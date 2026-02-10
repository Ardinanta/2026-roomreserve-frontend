import api from "./axios";
import type { Room, CreateRoomRequest, UpdateRoomRequest } from "../types";

// ==================== GET ALL ROOMS ====================
export async function fetchRooms(search?: string, available?: boolean): Promise<Room[]> {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (available !== undefined) params.available = String(available);

    const res = await api.get("/rooms", { params });
    return res.data;
}

// ==================== GET ROOM BY ID ====================
export async function fetchRoomById(id: number): Promise<Room> {
    const res = await api.get(`/rooms/${id}`);
    return res.data;
}

// ==================== CREATE ROOM (ADMIN) ====================
export async function createRoom(data: CreateRoomRequest): Promise<Room> {
    const res = await api.post("/rooms", data);
    return res.data;
}

// ==================== UPDATE ROOM (ADMIN) ====================
export async function updateRoom(id: number, data: UpdateRoomRequest): Promise<Room> {
    const res = await api.put(`/rooms/${id}`, data);
    return res.data;
}

// ==================== DELETE ROOM (ADMIN) ====================
export async function deleteRoom(id: number): Promise<void> {
    await api.delete(`/rooms/${id}`);
}