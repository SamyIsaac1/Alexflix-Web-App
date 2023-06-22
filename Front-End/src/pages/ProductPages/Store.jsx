import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct, searchProduct } from "../../api/apiEcommerce";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addToCart, toggleProductFromCart } from "./../../store/Slice/cart";

export default function Store() {
  const [allProducts, setProdcts] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginationState, setPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const cartProducts = useSelector((state) => state.cart.cartList);

  let searchMovie = searchParams.get("movie");
  let searchMinPrice = searchParams.get("minPrice");
  let searchMaxPrice = searchParams.get("maxPrice");
  let searchCategory = searchParams.get("category");
  const dispatch = useDispatch();
  const [query, setQuery] = useState({
    movie: "",
    minPrice: 0,
    // maxPrice: 150,
    maxPrice: "max",
    category: "",
  });

  function searchProductsHandler(e) {
    let newQuery = { ...query };
    newQuery[e.target.name] = e.target.value;
    setQuery(newQuery);
    let string = "";
    for (let item of ["movie", "minPrice", "maxPrice", "category"]) {
      if (newQuery[item] && newQuery[item] !== "max")
        string += `${item}=${newQuery[item]}&`;
    }
    console.log(string);
    string = string.slice(0, -1);
    navigate(`/store/search?${string}`);
  }
  const navigate = useNavigate();

  useEffect(() => {
    if (searchMovie || searchMinPrice || searchMaxPrice || searchCategory) {
      searchProducts();
      setPagination(false);
    } else {
      setPagination(true);
      getProducts();
      navigate(`/store?page=${page}`);
    }
  }, [
    page,
    paginationState,
    searchMovie,
    searchMaxPrice,
    searchMinPrice,
    searchCategory,
  ]);

  async function getProducts() {
    let { allProducts, totalPages } = await getAllProduct(page);
    setQuery({
      movie: "",
      minPrice: 0,
      maxPrice: "max",
      category: "",
    });
    setProdcts(allProducts);
    setTotalPages(totalPages);
  }

  async function searchProducts() {
    let newProducts = await searchProduct(query);
    setProdcts(newProducts);
  }

  function getProductDetails(id) {
    navigate(`/store/product/${id}`);
  }

  // function increasePage(e) {
  //   e.preventDefault();
  //   if (page === 13) return;
  //   let newP = page;
  //   newP++;
  //   setPage(newP);
  // }
  // function decreasePage(e) {
  //   e.preventDefault();
  //   if (page === 1) return;
  //   let newP = page;
  //   newP--;
  //   setPage(newP);
  // }
  if (!allProducts) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        {" "}
        <i className="fas fa-spinner fa-spin fa-3x" aria-hidden="true"></i>
      </div>
    );
  }
  let nums = new Array(totalPages).fill(1).map((el, i) => i + 1);
  return (
    <div id="store">
      <section id="page-header" className="">
        <h2>
          At <strong className="alex-cl">Alexflix </strong>Store, you can
          explore a world of products <br /> inspired by your favorite Movie,
          Series, and Anime!
        </h2>
      </section>

      <section id="product-search">
        <input
          type="text"
          className="search-bar w-100 text-light rounded-3 "
          placeholder="What's you favorite movie?"
          id=""
          name="movie"
          value={query.movie}
          onChange={searchProductsHandler}
        />

        <div className="product-filters">
          <input
            type="number"
            name="minPrice"
            min="0"
            placeholder="min"
            className="text-dark rounded-3"
            id=""
            value={query.minPrice === 0 ? "" : query.minPrice}
            onChange={searchProductsHandler}
          />
          <input
            type="number"
            name="maxPrice"
            min="0"
            className="mx-1 text-dark rounded-3"
            value={query.maxPrice === "max" ? "" : query.maxPrice}
            placeholder="max"
            id=""
            onChange={searchProductsHandler}
          />
          <select
            name="category"
            id=""
            onChange={searchProductsHandler}
            value={query.category}
            className="rounded text-dark "
          >
            <option value="">All</option>
            <option value="Accessories">Accessories</option>
            <option value="Mug">Mug</option>
            <option value="T-shirt">T-shirts</option>
          </select>
        </div>
      </section>
      <section id="product1" className="section-p1">
        <div className="pro-container">
          {allProducts &&
            allProducts?.map((product) => {
              let i = cartProducts.findIndex((c) => c._id === product._id);
              if (i !== -1) {
                product = { ...product, isAdd: true };
              }
              return (
                <div key={product._id} className="pro">
                  <img
                    src={product.images[0].secure_url}
                    className="full-width "
                    alt=""
                    onClick={() => getProductDetails(product._id)}
                  />
                  <div className="des">
                    <span className="mb-1">{product.category}</span>
                    <h5 className="m-0">{product.name}</h5>
                    <div className="star">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <h4>${product.price}</h4>
                  </div>
                  <span
                    href=""
                    className="cart-icon"
                    onClick={() => {
                      let obj = { ...product, quantity: 1 };
                      // dispatch(addToCart(obj));
                      dispatch(toggleProductFromCart(obj));
                    }}
                  >
                    {product.isAdd ? (
                      <i class="fa-solid fa-cart-shopping cart text-danger"></i>
                    ) : (
                      <i className="fa-solid fa-cart-plus cart"></i>
                    )}
                    {/* <i className="fa-solid fa-cart-plus cart"></i> */}
                  </span>
                </div>
              );
            })}
        </div>
        {allProducts && allProducts.length === 0 && (
          <span className="text-danger">NO PRODUCTS FOUND .. </span>
        )}
      </section>
      {paginationState && (
        <ul
          id="pagination"
          className="section-p1 d-flex pagination m-0 justify-content-center gap-2   "
        >
          {nums.map((pageNum) => (
            <li
              key={pageNum}
              className=" page-item "
              onClick={() => setPage(pageNum)}
            >
              <span className="page-link">{pageNum}</span>
            </li>
          ))}
          {/* <button
            disabled={page === 1 ? true : false}
            onClick={(e) => decreasePage(e)}
          >
            <i className="fa-solid fa-long-arrow-alt-left"></i>
          </button>
          <button className="mx-1" onClick={() => setPage(page + 1)}>
            {page}
          </button>
          <button className="mx-1" onClick={() => setPage(page + 2)}>
            {page + 1}
          </button>
          <button
            className=""
            disabled={page === 13 ? true : false}
            onClick={(e) => increasePage(e)}
          >
            <i className="fa-solid fa-long-arrow-alt-right"></i>
          </button> */}
        </ul>
      )}
    </div>
  );
}
