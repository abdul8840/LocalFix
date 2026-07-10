import { api } from "./client.js";

const qs = (params) => {
  const cleaned = Object.entries(params || {})
    .filter(([, v]) => v !== undefined && v !== null && v !== "");
  return cleaned.length ? `?${new URLSearchParams(cleaned)}` : "";
};

export const adminApi = {
  analytics: () => api.get("/admin/analytics"),

  listWorkers: (params) => api.get(`/admin/workers${qs(params)}`),
  setVerification: (id, status) =>
    api.patch(`/admin/workers/${id}/verification`, { status }),

  listUsers: (params) => api.get(`/admin/users${qs(params)}`),
  setBlocked: (id, is_blocked) =>
    api.patch(`/admin/users/${id}/blocked`, { is_blocked }),

  listReviews: (params) => api.get(`/admin/reviews${qs(params)}`),
  flagReview: (id, is_flagged) =>
    api.patch(`/admin/reviews/${id}/flag`, { is_flagged }),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
};