import React, { useEffect, useState } from "react";
import { CardsSlider } from "../components/Streaming Components/Cards Slider Component/CardsSlider";
import { Nav } from "../components/Navbar Components/Nav component/Nav";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllVids, getAllFav } from "../store/Slice/videosSlice";
import { getAllProduct } from "../api/apiEcommerce";
import homeImage from "../assets/images/homeImg.jpg";
import "react-alice-carousel/lib/alice-carousel.css";
import "../components/Streaming Components/StreamPagesStyles/home.css";
export function Home() {
  const [products, setProducts] = useState([]);
  const allVids = useSelector((state) => state.videos);
  const dispatch = useDispatch();
  const movies =
    allVids.movies && [...allVids.movies]?.sort((a, b) => b.rate - a.rate);
  const series =
    allVids.series && [...allVids.series]?.sort((a, b) => b.rate - a.rate);
  const animes =
    allVids.animes && [...allVids.animes]?.sort((a, b) => b.rate - a.rate);
  useEffect(() => {
    getAllProduct().then((res) => {
      const { allProducts } = res || [];
      setProducts(allProducts);
    });
    dispatch(getAllFav());
    dispatch(fetchAllVids());
  }, [dispatch]);

  return (
    <>
      <Nav positionStyle={"position-fixed top-0 start-0"} />
      <div
        id="home-img"
        className=" position-relative d-flex justify-content-center align-items-center vh-100"
      >
        <span
          id="home-img-overlay"
          className=" position-absolute start-0 top-0 w-100 h-100"
        ></span>
        <img src={homeImage} className="w-100 h-100" alt="Home-Img" />
        <div className="text-content position-absolute start-50 top-25 text-center fw-bold">
          <h1 id="welcome-msg" className="text-capitalize mb-4 ">
            welcome to{" "}
            <span className="text-uppercase d-inline-block mt-3">alexflix</span>
          </h1>
          <p id="description" className="fs-4 m-0">
            Millions of movies, TV shows, Animes and their wonderful products
          </p>
        </div>
      </div>
      <CardsSlider movies={movies} title={"top movies"} type={`video`} />
      <CardsSlider movies={series} title={"top series"} type={`video`} />
      <CardsSlider movies={animes} title={"top animes"} type={`video`} />
      <CardsSlider movies={products} title={"top products"} type={`product`} />
      <Footer />
    </>
  );
}
