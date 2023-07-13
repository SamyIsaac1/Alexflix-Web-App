const mongoose = require("mongoose");
const Movie = mongoose.model("movies");
const User = mongoose.model("users");
const Review = mongoose.model("reviews");
const Product = mongoose.model("products");

exports.getAllMovies = async function (request, response, next) {
  try {
    const allMovies = await Movie.find().populate([
      {
        path: "products",
        select: { name: 1, price: 1, available: 1, images: 1 },
      },
    ]);
    if (allMovies.length == 0) throw new Error("No Movies exist");
    response.status(200).json({ message: "Done", data: allMovies });
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
      poster_image,
      videos,
      description,
    } = request.body;
    // Check That Product Id Exist in Products Collection !
    const data = await Product.find({ _id: { $in: products } });
    const dataIds = data.map((d) => d._id);
    if (dataIds.length !== products.length) {
      const wrongIds = products.filter((id) => !dataIds.includes(id)).join(",");
      throw new Error(`One of these ids don't exist: ${wrongIds}`);
    }
    let movie = new Movie({
      name,
      rate,
      type,
      category,
      products,
      production_year,
      trailer,
      poster_image,
      videos,
      description,
    });
    await movie.save();
    response.status(200).json({ message: "Done", data: movie });
  } catch (error) {
    next(error);
  }
};

exports.getMovieById = async function (request, response, next) {
  try {
    let movie = await Movie.findById(request.params.id)
    .populate([{ path: "products" }]);

    if (!movie) throw new Error("No Movies exist by this ID");
    response.status(200).json({ message: "Done", data: movie });
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

    let movie = await Movie.findByIdAndUpdate(request.params.id, newMovie, {
      new: true,
    });

    if (!movie) throw new Error("No Movies exist by this ID");

    response.status(200).json({ message: "Done", data: movie });
  } catch (error) {
    next(error);
  }
};

exports.deleteMovieById = async function (request, response, next) {
  try {
    let movie = await Movie.findByIdAndDelete(request.params.id);
    if (!movie) throw new Error("No Movies exist by this ID");

    let updatedUsersStatus = await User.updateMany(
      { "favorites.id": request.params.id },
      {
        $pull: {
          favorites: { id: movie._id, name: movie.name },
        },
      }
    );
    let deleteMoviesReviews = await Review.deleteMany({ movie_id: movie._id });

    response.status(200).json({
      message: "Done",
      data: { movie, updatedUsersStatus, deleteMoviesReviews },
    });
  } catch (error) {
    next(error);
  }
};

exports.searchMovie = async function (request, response, next) {
  try {
    // No query params
    if (Object.keys(request.query).length === 0) throw new Error("Not Exist");

    const query = {};
    for (const key in request.query) {
      if (request.query[key]) query[key] = request.query[key];

      // if request has name parameter
      if (key === "name")
        query[key] = { $regex: request.query[key], $options: "i" };
    }

    let movies = await Movie.find(query).populate([
      {
        path: "products",
        select: { name: 1, images: 1 },
      },
    ]);;

    if (movies.length == 0) throw new Error("No Movies exist");
    response.status(200).json({ message: "Done", data: movies });
  } catch (error) {
    next(error);
  }
};
