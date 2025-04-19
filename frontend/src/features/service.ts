import axios from "axios";

import {
  Login,
  LoginResponse,
  Photo,
  PhotoListResponse,
  PhotosQuery,
  Register,
} from "./models";

const createApiClient = () => axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

async function registerUser(data: Register): Promise<void> {
  await createApiClient().post("/auth/register", data);
}

async function loginUser(data: Login): Promise<LoginResponse> {
  const response = await createApiClient().post("/auth/login", data);
  return LoginResponse.parse(await response.data);
}

async function logoutUser(): Promise<void> {
  await createApiClient().post("/auth/logout");
}

async function fetchPhotos(params: PhotosQuery): Promise<PhotoListResponse> {
  const response = await createApiClient().get("/photos", { params });
  return PhotoListResponse.parse(await response.data);
}

async function uploadPhoto(data: FormData): Promise<void> {
  await createApiClient().post("/photos", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

async function fetchPhotoById(photoId: string): Promise<Photo> {
  const response = await createApiClient().get(`/photos/${photoId}`);
  return Photo.parse(await response.data);
}

async function deletePhotoById(photoId: string): Promise<void> {
  await createApiClient().delete(`/photos/${photoId}`);
}

export const service = {
  registerUser,
  loginUser,
  logoutUser,
  fetchPhotos,
  uploadPhoto,
  fetchPhotoById,
  deletePhotoById,
};
