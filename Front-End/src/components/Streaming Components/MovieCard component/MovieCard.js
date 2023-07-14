import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { toggleProductFromCart } from "../../../store/Slice/cart";
import {
  PopUpMsg,
  addToFavorites,
  deleteFromFavorites,
} from "../../../api/apiStream";
import { removeFromList } from "../../../store/Slice/videosSlice";
import { setFavLoader } from "../../../store/Slice/favLoader";
import "./MovieCard.css";
export function MovieCard({ movie, isFav, type }) {
  const [localLoader, setLocalLoader] = useState(false);
  const favLoader = useSelector((state) => state.favLoader);
  const cart = useSelector((state) => state.cart.cartList);
  const [inCart, setInCart] = useState(false);
  const allVids = useSelector((state) => state.videos);
  const favorites = [...allVids.favorites];
  const [isFavorite, setIsFavorite] = useState(isFav);
  const dispatch = useDispatch();
  const handleAddToCart = function (e) {
    if (localStorage.getItem("token")) {
      e.stopPropagation();
      if (movie.available === 0) return;
      if (inCart) setInCart(false);
      else setInCart(true);
      let obj = { ...movie, quantity: 1 };
      dispatch(toggleProductFromCart(obj));
    } else return PopUpMsg({ message: "Please Login First" });
  };
  const addToFav = function (e) {
    e.stopPropagation();
    setLocalLoader(true);
    if (!isFavorite) {
      addToFavorites(movie._id)
        .then((res) => {
          setLocalLoader(false);
          if (res) setIsFavorite(true);
          else {
            dispatch(setFavLoader(false));
            if (localStorage.getItem("token"))
              PopUpMsg({ message: "Connection Failed" });
            else PopUpMsg({ message: "Please Login First" });
          }
        })
        .catch((error) => {
          dispatch(setFavLoader(false));
          setLocalLoader(false);
          return PopUpMsg(error);
        });
    } else {
      deleteFromFavorites(movie._id)
        .then((res) => {
          setLocalLoader(false);
          if (res) {
            setIsFavorite(false);
            dispatch(removeFromList(movie));
          } else {
            dispatch(setFavLoader(false));
            if (localStorage.getItem("token"))
              PopUpMsg({ message: "Connection Failed" });
            else PopUpMsg({ message: "Please Login First" });
          }
        })
        .catch((error) => {
          dispatch(setFavLoader(false));
          setLocalLoader(false);

          return PopUpMsg(error);
        });
    }
  };
  const navigate = useNavigate();
  const moveToDetails = function () {
    if (localStorage.getItem("token")) {
      if (type === "video") navigate(`/movies/${movie._id}`);
      else if (type === "product") navigate(`/store/product/${movie._id}`);
      window.scrollTo(0, 0);
    } else return PopUpMsg({ message: "Please Login First" });
  };

  useEffect(() => {
    let isProductInCart = cart.find((product) => product._id === movie._id);
    if (isProductInCart) setInCart(true);
    let isMovieFav = favorites.find((obj) => obj.id === movie._id);
    if (isMovieFav) setIsFavorite(true);
  }, [cart, favorites]);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: "none" }}
      onClick={favLoader ? () => "" : moveToDetails}
      className="movie_card p-0 m-2 mt-0 border-0 rounded-3 position-relative bg-transparent"
    >
      <div className="img-container position-relative  z-1">
        <div className="card-overlay d-flex justify-content-center align-items-center rounded-3 position-absolute top-0 start-0 w-100 h-100">
          <div className="card-btns text-center">
            <Button
              disabled={favLoader}
              onClick={addToFav}
              className={`my-1 ${type === "video" ? "" : "d-none"}`}
              variant="outline-secondary"
            >
              <i
                className={`fa-solid fa-${
                  localLoader
                    ? "spinner fa-spin"
                    : isFavorite
                    ? "check"
                    : "plus"
                }`}
              ></i>{" "}
              List
            </Button>
            <Button
              onClick={handleAddToCart}
              className={`my-1 ${type === "product" ? "" : "d-none"}`}
              variant="outline-secondary"
            >
              <i className={`fa-solid fa-${inCart ? "check" : "plus"}`}></i>{" "}
              Cart
            </Button>
            <br />
            <Button
              onClick={moveToDetails}
              className="my-1"
              variant="outline-secondary"
            >
              Details
            </Button>
          </div>
        </div>
        <img
          src={movie.poster_image || movie.images[0].secure_url}
          className="card-img-top rounded-4 sold-rel"
          alt="..."
        />
      </div>
      <div className="card-body p-2">
        <h5 className="card-text text-center my-0">{movie.name}</h5>
      </div>
      {type === "product" && movie.available === 0 ? (
        <span className=" sold-out">Sold Out</span>
      ) : (
        ""
      )}
    </div>
  );
}
