import { api } from "./client.js";

export const fraudApi = {
  list: (resolved) =>
    api.get(`/fraud/alerts${resolved !== undefined ? `?resolved=${resolved}` : ""}`),
  scan: () => api.post("/fraud/scan", {}),
  resolve: (id) => api.patch(`/fraud/alerts/${id}/resolve`, {}),
};