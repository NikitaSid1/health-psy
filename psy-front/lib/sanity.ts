import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "dp2yjc73",
  dataset: "production",
  apiVersion: "2023-05-03",
  useCdn: true, 
});