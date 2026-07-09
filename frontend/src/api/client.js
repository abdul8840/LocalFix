const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (endpoint, { method = "GET", body, headers = {} } = {}) => {
  const token = localStorage.getItem("localfix_token");

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  } catch (err) {
    console.error(`API error [${endpoint}]:`, err.message);
    throw err;
  }
};

export const api = {
  get:    (endpoint)         => request(endpoint),
  post:   (endpoint, body)   => request(endpoint, { method: "POST", body }),
  put:    (endpoint, body)   => request(endpoint, { method: "PUT",  body }),
  patch:  (endpoint, body)   => request(endpoint, { method: "PATCH", body }),
  delete: (endpoint)         => request(endpoint, { method: "DELETE" }),
};