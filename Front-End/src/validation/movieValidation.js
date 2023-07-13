import * as yup from "yup";

export const movieCategories = [
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "animation", label: "Animation" },
  { value: "comedy", label: "Comedy" },
  { value: "crime", label: "Crime" },
  { value: "documentary", label: "Documentary" },
  { value: "drama", label: "Drama" },
  { value: "family", label: "Family" },
  { value: "fantasy", label: "Fantasy" },
  { value: "history", label: "History" },
  { value: "horror", label: "Horror" },
  { value: "musical", label: "Musical" },
  { value: "mystery", label: "Mystery" },
  { value: "romance", label: "Romance" },
  { value: "sci-Fi", label: "Sci-Fi" },
  { value: "sport", label: "Sport" },
  { value: "thriller", label: "Thriller" },
  { value: "war", label: "War" },
  { value: "western", label: "Western" },
];
const currentYear = new Date().getFullYear();

export const name = yup.string().required("name should be String");
export const rate = yup
  .number()
  .required("Rating is required")
  .min(1, "Rating must be at least 1")
  .max(10, "Rating cannot exceed 10");
export const type = yup.string().required("type should be String");
export const production_year = 
yup.number().required('production_year is required').integer().min(1878).max(currentYear);

export const trailer = yup
  .string()
  .url("trailer must be a valid URL")
  .required("trailer should be String");
  export const cover = yup
  .string()
  .url("cover must be a valid URL")
  .required("cover should be String");

export const poster = yup
  .string()
  .url("Poster must be a valid URL")
  .required("Poster URL is required");
export const videos = yup
  .string()
  .url("videos must be a valid URL")
  .required("videos should be String");
  export const description = yup
  .string()
  .required("Description must be a string")
  .min(5, "Description must be at least 5 characters long");
