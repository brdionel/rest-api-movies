import express, { json } from "express";
import { moviesRouter } from "./routes/movies.js";
import { corsMiddlewares } from "./middlewares/cors.js";
// import movies from "./movies.json" with { type: "json" };
// import fs from "node:fs";
// const movies = JSON.parse(fs.readFileSync("./movies.json", "utf-8"));

const app = express();
app.disable("x-powered-by");
app.use(json());
app.use(corsMiddlewares());

const PORT = process.env.PORT ?? 1234;

app.use("/movies", moviesRouter);

// app.options("/movies/:id", (req, res) => {
//   const origin = req.header("origin");
//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header("Access-Control-Allow-Origin", origin);
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
//   }
//   res.send(200);
// });

app.use((req, res) => {
  res
    .status(404)
    .send("<strong>Nao deu cara! <br/> Nao achamamos nada.</strong>");
});

app.listen(PORT, () => {
  console.log("Server listening on port --> ", PORT);
});
