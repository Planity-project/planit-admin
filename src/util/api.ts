import axios from "axios";

// const api = axios.create({
//   baseURL: "http://43.200.250.222:5001",
//   withCredentials: true,
// });
// export default api;

const api = axios.create({
  baseURL: "https://planit.ai.kr/api",
  withCredentials: true,
});

export default api;
