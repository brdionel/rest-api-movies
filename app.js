const express = require("express");
const crypto = require("node:crypto");
const cors = require("cors");
const movies = require("./movies.json");
const { validateMovie, validatePartialMovie } = require("./schemas/movies");
const { callbackify } = require("node:util");

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://127.0.0.1:5500",
        "http://localhost:1234",
        "http://br.dionel",
      ];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed CORS"));
    },
  })
);

const PORT = process.env.PORT ?? 1234;

app.get("/", (req, res) => {
  res.json({
    message: "Oi. Boa!",
  });
});

// Todos los recursos que sean MOVIES se identifican con /movies
app.get("/movies", (req, res) => {
  // const origin = req.header("origin");
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header("Access-Control-Allow-Origin", origin);
  // }

  const { genre } = req.query;
  if (genre) {
    const moviesFiltered = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(moviesFiltered);
  }
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);

  if (movie) return res.json(movie);

  res.status(404).json({ message: "nao achamos movie nenhuma" });
});

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex < 0)
    return res.status(404).json({
      message: "Nao achamos a pelicula",
    });

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updatedMovie;

  res.json(updatedMovie);
});

app.delete("/movies/:id", (req, res) => {
  // const origin = req.header("origin");
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header("Access-Control-Allow-Origin", origin);
  // }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex < 0)
    return res.status(404).json({
      message: "Nao achamos a pelicula",
    });

  movies.splice(movieIndex, 1);

  return res.json({ message: "movie deleted" });
});

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
