import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (data) => {
  let response;
  try {
    response = await api.post("/login", data);
  } catch (error) {
    return error;
  }
  return response;
};

export const signout = async () => {
  let response;
  try {
    response = await api.post("/logout");
  } catch (error) {
    return error;
  }
  return response;
};

export const createPost = async (data) => {
  let response;
  try {
    response = await api.post("/post", data);
  } catch (error) {
    return error;
  }
  return response;
};

export const getPosts = async () => {
  let response;
  try {
    response = await api.get("/post");
  } catch (error) {
    return error;
  }
  return response;
};

export const getPostById = async (id) => {
  let response;
  try {
    response = await api.get(`/post/${id}`);
  } catch (error) {
    return error;
  }
  return response;
};

export const getComments = async (id) => {
  let response;
  try {
    response = await api.get(`/comment/${id}`);
  } catch (error) {
    return error;
  }
  return response;
};

export const createComment = async (data) => {
  let response;
  try {
    response = await api.post("/comment", data);
  } catch (error) {
    return error;
  }
  return response;
};

export const deletePost = async (id) => {
  let response;
  try {
    response = await api.delete(`/post/${id}`);
  } catch (error) {
    return error;
  }
  return response;
};

export const updatePost = async (data) => {
  let response;
  try {
    response = await api.put("/post/update", data);
  } catch (error) {
    return error;
  }
  return response;
};

export const registerUser = async (data) => {
  let response;
  try {
    response = await api.post("/register", data);
  } catch (error) {
    return error;
  }
  return response;
};
