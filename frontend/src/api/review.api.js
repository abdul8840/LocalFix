import { api } from "./client.js";
export const reviewApi = {
  create: (data) => api.post("/reviews", data),
  worker: (userId) => api.get(`/reviews/worker/${userId}`),
};