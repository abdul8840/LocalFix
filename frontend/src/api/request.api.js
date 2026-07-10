import { api } from "./client.js";
export const requestApi = {
  create: (data) => api.post("/requests", data),
  mine: () => api.get("/requests/mine"),
  assigned: () => api.get("/requests/assigned"),
  updateStatus: (id, data) => api.patch(`/requests/${id}/status`, data),
};