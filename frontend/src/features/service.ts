import axios from "axios";

import {
  Login,
  LoginResponse,
  Photo,
  PhotoListResponse,
  PhotosQuery,
  Register,
  SubscribtionState,
} from "./models";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

function getToken(): string | null {
  const storedValue = localStorage.getItem("bearer");

  if (storedValue) {
    const response = JSON.parse(storedValue) as LoginResponse;
    return response.token;
  }

  return storedValue;
}

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  async (error: Error) => {
    await Promise.reject(error);
  }
);

async function registerUser(data: Register): Promise<void> {
  await apiClient.post("/auth/register", data);
}

async function loginUser(data: Login): Promise<LoginResponse> {
  const response = await apiClient.post("/auth/login", data);
  return LoginResponse.parse(await response.data);
}

async function logoutUser(): Promise<void> {
  await apiClient.post("/auth/logout");
}

async function getSubscriptionState() {
  const response = await apiClient.get(`/subscribe`);
  return SubscribtionState.parse(await response.data);
}

async function setSubscriptionState(data: SubscribtionState) {
  await apiClient.post(`/subscribe`, data);
}

async function fetchPhotos(params: PhotosQuery): Promise<PhotoListResponse> {
  const response = await apiClient.get("/photos", { params });
  return PhotoListResponse.parse(await response.data);
}

async function uploadPhoto(data: FormData): Promise<void> {
  await apiClient.post("/photos", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

async function fetchPhotoById(photoId: string): Promise<Photo> {
  const response = await apiClient.get(`/photos/${photoId}`);
  return Photo.parse(await response.data);
}

async function deletePhotoById(photoId: string): Promise<void> {
  await apiClient.delete(`/photos/${photoId}`);
}

export const service = {
  registerUser,
  loginUser,
  logoutUser,
  fetchPhotos,
  uploadPhoto,
  fetchPhotoById,
  deletePhotoById,
  getSubscriptionState,
  setSubscriptionState,
};
