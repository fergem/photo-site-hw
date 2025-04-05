import { PhotoListResponse } from "./models";

export const photoListTestData: PhotoListResponse = {
  total: 5,
  page: 1,
  limit: 10,
  data: [
    {
      id: "1",
      name: "Photo 1".padEnd(40, " "), // Ensures the name meets the minLength requirement
      upload_date: new Date("2025-04-01T10:00:00Z").toISOString(),
      url: "https://example.com/photo1.jpg",
    },
    {
      id: "2",
      name: "Photo 2".padEnd(40, " "),
      upload_date: new Date("2025-04-02T11:00:00Z").toISOString(),
      url: "https://example.com/photo2.jpg",
    },
    {
      id: "3",
      name: "Photo 3".padEnd(40, " "),
      upload_date: new Date("2025-04-03T12:00:00Z").toISOString(),
      url: "https://example.com/photo3.jpg",
    },
    {
      id: "4",
      name: "Photo 4".padEnd(40, " "),
      upload_date: new Date("2025-04-04T13:00:00Z").toISOString(),
      url: "https://example.com/photo4.jpg",
    },
    {
      id: "5",
      name: "Photo 5".padEnd(40, " "),
      upload_date: new Date("2025-04-05T14:00:00Z").toISOString(),
      url: "https://example.com/photo5.jpg",
    },
  ],
};
