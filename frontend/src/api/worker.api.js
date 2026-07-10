import { api } from "./client.js";
export const workerApi = {
  discover: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined)
    ).toString();
    return api.get(`/workers/discover${qs ? `?${qs}` : ""}`);
  },
  getById: (id) => api.get(`/workers/${id}`),
  me: () => api.get("/workers/me"),
  updateMe: (data) => api.patch("/workers/me", data),
};