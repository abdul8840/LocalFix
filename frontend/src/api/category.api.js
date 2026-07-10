import { api } from "./client.js";
export const categoryApi = {
  list: () => api.get("/categories"),
};