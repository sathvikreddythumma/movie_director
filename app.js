const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server started successfully");
    });
  } catch (e) {
    console.log(`DB error:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//API1
app.get("/movies/", async (request, response) => {
  const getMovieNames = `SELECT movie_name FROM movie;`;
  const movArray = await db.all(getMovieNames);
  response.send(
    movArray.map((eachMovie) => ({
      movieName: eachMovie.movie_name}))
  );
});
//API2

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const addMovie = `INSERT into movie
    (director_id,movie_name,lead_actor)
    VALUES
    ('${directorId}',
    '${movieName}',
    '${leadActor}');
    `;
  const getArray = await db.run(addMovie);
  const movId = getArray.lastID;
  response.send("Movie Successfully Added");
});
//API3
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieNames = `SELECT * FROM movie where movie_id='${movieId}';`;
  const movArray = await db.get(getMovieNames);
  response.send(movArray);
});
//API4
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const getMovieNames = `
  UPDATE movie 
  SET
  director_id='${directorId}',
  movie_name='${movieName}',
  lead_actor='${leadActor}'
  WHERE movie_id=${movieId}
  ;`;
  const movArray = await db.run(getMovieNames);
  response.send("Movie Details Updated");
});
//API5
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieNames = `DELETE FROM movie where movie_id='${movieId}';`;
  const movArray = await db.get(getMovieNames);
  response.send("Movie Removed");
});
//API6
app.get("/directors/", async (request, response) => {
  const getDirNames = `SELECT * FROM director;`;
  const dirArray = await db.all(getDirNames);
  response.send(
    dirArray.map((eachMovie) => ({
      directorId: eachMovie.director_id,
      directorName: eachMovie.director_name,
    }))
  );
});
//API7
app.get("/directors/:directorId/movies/", async (request, response) => {
  const getDirNames = `SELECT * FROM movie m,director d
  WHERE m.director_id=d.director_id;
  ;`;
  const dirArray = await db.all(getDirNames);
  response.send(
    dirArray.map((eachMovie) => ({
      movieName: eachMovie.movie_name,
      directorName: eachMovie.director_name,
    }))
  );
});

module.exports = app;
