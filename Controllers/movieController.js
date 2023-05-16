const mongoose = require("mongoose");
require("./../Models/movieModel");
const Movie = mongoose.model("movies");

exports.getAllMovies = async function (request, response, next) {
  try {
    const allMovies = await Movie.find();
    if (allMovies.length == 0) throw new Error("No Movies exist");
    response.status(200).json(allMovies);
  } catch (error) {
    next(error);
  }
};

exports.addNewMovie = async function (request, response, next) {
  try {
    let {
      name,
      rate,
      type,
      category,
      products,
      production_year,
      trailer,
      poster,
      videos,
    } = request.body;

    let movie = new Movie({
      name,
      rate,
      type,
      category,
      products,
      production_year,
      trailer,
      poster,
      videos,
    });
    await movie.save();
    response.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

exports.getMovieById = async function (request, response, next) {
  try {
    let movie = await Movie.findById(request.params.id);

    if (!movie) throw new Error("No Movies exist by this ID");
    response.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

exports.updateMovieById = async function (request, response, next) {
  try {
    let newMovie = {};
    for (prop in request.body) {
      newMovie[prop] = request.body[prop];
    }

    let movie = await Movie.findByIdAndUpdate(request.body._id, newMovie, {
      new: true,
    });

    if (!movie) throw new Error("No Movies exist by this ID");

    response.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

exports.deleteMovieById = async function (request, response, next) {
  try {
    let movie = await Movie.findByIdAndDelete(request.body._id);
    if (!movie) throw new Error("No Movies exist by this ID");
    response.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};