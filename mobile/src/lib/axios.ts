import axios from "axios";

const config = {
  baseURL: "http://192.168.1.10:3333",
};

export const api = axios.create(config);
