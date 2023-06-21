import { useNavigate } from "react-router-dom";
import "./MovieCard.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { addToCart } from "../../../store/Slice/cart";
import { addToFavorites, deleteFromFavorites } from "../../../api/requests";
export function MovieCard({ movie, isFav, type }) {
  const allVids = useSelector((state)=>state.videos)
  const favorites = [...allVids.favorites]
  const [inCart,setInCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isFav);
  const dispatch = useDispatch();
  const handleAddToCart = function (e) {
    if(!inCart) setInCart(true);
    let obj = { ...movie, quantity: 1 };
    dispatch(addToCart(obj));
  };
  const addToFav = function (e) {
    console.log(movie)
    e.stopPropagation();
    if (!isFavorite) {
      addToFavorites(movie._id).then((res)=>{
        setIsFavorite(true);

      });
    } else {
      deleteFromFavorites(movie._id).then((res)=>{
        setIsFavorite(false);
      });
    }
  };
  const navigate = useNavigate();
  const moveToDetails = function () {
    if (type === "video") navigate(`/movies/${movie._id}`);
    else if (type === "product") navigate(`/store/product/${movie._id}`);
  };

  useEffect(()=>{
    let isMovieFav = favorites.find((obj)=>obj.id === movie._id);
    if(isMovieFav) setIsFavorite(true);
  },[])

  return (
    <div className="card p-0 m-2 mt-0 border-0 rounded-3 position-relative">
      <div className="img-container position-relative">
        <div className="card-overlay d-flex justify-content-center align-items-center rounded-3 position-absolute top-0 start-0 w-100 h-100 ">
          <div className="card-btns text-center">
            <Button
              onClick={addToFav}
              className={`my-1 ${type === "video" ? "" : "d-none"}`}
              variant="outline-secondary"
            >
              <i className={`fa-solid fa-${isFavorite ? "check" : "plus"}`}></i>{" "}
              List
            </Button>
            <Button
              onClick={handleAddToCart}
              className={`my-1 ${type === "product" ? "" : "d-none"}`}
              variant="outline-secondary"
            >
              <i className={`fa-solid fa-${inCart?"check":"plus"}`}></i> Cart
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
          className="card-img-top rounded-4"
          alt="..."
        />
      </div>
      <div className="card-body p-2">
        <h5 className="card-text text-center my-0">{movie.name}</h5>
      </div>
    </div>
  );
}
