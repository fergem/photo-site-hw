import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai/react";

import { bearerAtom } from "./bearerAtom";
import { Login, Register, UploadPhoto } from "./models";
import { photosQueryAtom } from "./photosQueryAtom";
import { service } from "./service";

export const useRegisterUser = ({ onSuccess }: { onSuccess: () => void }) =>
  useMutation({
    mutationFn: (data: Register) => service.registerUser(data),
    onSuccess,
  });

export const useLoginUser = ({ onSuccess }: { onSuccess: () => void }) => {
  const setBearer = useSetAtom(bearerAtom);

  return useMutation({
    mutationFn: (data: Login) => service.loginUser(data),
    onSuccess: (response) => {
      setBearer(response);
      onSuccess();
    },
  });
};

export const useLogoutUser = () =>
  useMutation({ mutationFn: () => service.logoutUser() });

export const useFetchPhotos = () => {
  const params = useAtomValue(photosQueryAtom);

  return useQuery({
    queryKey: ["photos", params],
    queryFn: () => service.fetchPhotos(params),
  });
};

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
