import cors from "cors";

const ACCEPTED_ORIGINS = [
  "http://127.0.0.1:5500",
  "http://localhost:1234",
  "http://br.dionel",
];

export const corsMiddlewares = ({ accepted_origins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (accepted_origins.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed CORS"));
    },
  });
