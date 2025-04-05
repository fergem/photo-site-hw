import { z } from "zod";

export const Register = z.object({
  username: z.string(),
  password: z.string(),
});
export type Register = z.infer<typeof Register>;

export const Login = z.object({
  username: z.string(),
  password: z.string(),
});
export type Login = z.infer<typeof Login>;

export const LoginResponse = z.object({
  token: z.string(),
});
export type LoginResponse = z.infer<typeof LoginResponse>;

export const Photo = z.object({
  id: z.string(),
  name: z.string().min(40),
  upload_date: z.string().datetime(),
  url: z.string().url(),
});
export type Photo = z.infer<typeof Photo>;

export const PhotoListResponse = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  data: z.array(Photo),
});
export type PhotoListResponse = z.infer<typeof PhotoListResponse>;

export const UploadPhoto = z.object({
  name: z.string().min(40),
  file: z.instanceof(File),
});
export type UploadPhoto = z.infer<typeof UploadPhoto>;

export const PhotosQuery = z.object({
  sort: z.enum(["name", "date"]).default("name"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});
export type PhotosQuery = z.infer<typeof PhotosQuery>;
