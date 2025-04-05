import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Login, PhotosQuery, Register, UploadPhoto } from "./models";
import { service } from "./service";

export const useRegisterUser = () =>
  useMutation({ mutationFn: (data: Register) => service.registerUser(data) });

export const useLoginUser = () =>
  useMutation({
    mutationFn: (data: Login) => service.loginUser(data),
    onSuccess: (response) => {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + response.token;
    },
  });

export const useLogoutUser = () =>
  useMutation({ mutationFn: () => service.logoutUser() });

export const useFetchPhotos = (params: PhotosQuery) =>
  useQuery({
    queryKey: ["photos", params],
    queryFn: () => service.fetchPhotos(params),
  });

export const useUploadPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UploadPhoto) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("file", data.file);
      return service.uploadPhoto(formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
};

export const useFetchPhotoById = (photoId: string) =>
  useQuery({
    queryKey: ["photo", photoId],
    queryFn: () => service.fetchPhotoById(photoId),
  });

export const useDeletePhotoById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (photoId: string) => service.deletePhotoById(photoId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
};
