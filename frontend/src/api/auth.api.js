import { api } from "./client.js";

export const authApi = {
  registerCustomer: (data) => api.post("/auth/register/customer", data),
  registerWorker:   (data) => api.post("/auth/register/worker", data),
  login:            (data) => api.post("/auth/login", data),
  me:               ()     => api.get("/auth/me"),
  logout:           ()     => api.post("/auth/logout", {}),
};