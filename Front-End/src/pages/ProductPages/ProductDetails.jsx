import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../api/apiEcommerce";
import { useDispatch } from "react-redux";
import { addToCart } from "./../../store/Slice/cart";
import FullScreenLoader from "./../../components/FullScreenLoader";
import Swal from "sweetalert2";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const imgRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    //API
    showProduct();
  }, []);

  async function showProduct() {
    let newProduct = await getProductById(params.id);
    if (!newProduct) navigate("/store");

    setProduct(newProduct);
  }

  function changeImgSource(e) {
    imgRef.current.src = e.target.src;
  }

  if (!product) {
    return <FullScreenLoader />;
  }
  return (
    <>{product.images?.length >= 0 &&( 
      <section id="prodetails" className="section-p1 w-75 mx-auto text-light ">
        {product.images?.length >= 3 ? (
          <div className="single-pro-img ">
            <img
              src={product.images[0]?.secure_url}
              className="full-width main-img"
              alt=""
              ref={imgRef}
            />
            <div className="small-img-group">
              <div className="small-img-col">
                <img
                  src={product.images[0]?.secure_url}
                  alt=""
                  className="small-img full-width"
                  onClick={changeImgSource}
                />
              </div>
              <div className="small-img-col">
                <img
                  src={product.images[1]?.secure_url}
                  alt=""
                  className="small-img full-width"
                  onClick={changeImgSource}
                />
              </div>
              <div className="small-img-col">
                <img
                  src={product.images[2]?.secure_url}
                  alt=""
                  className="small-img full-width"
                  onClick={changeImgSource}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="single-pro-img">
            <img
              src={product.images[0]?.secure_url}
              className="full-width main-img"
              alt=""
              ref={imgRef}
            />{" "}
          </div>
        )}

        <div className="single-pro-details">
          <h6 className="text-secondary">{product.category}</h6>
          <h4 className="pt-3">{product.name}</h4>
          <h2>${product.price}</h2>
          <p className="mb-3">
            {" "}
            In Stock :{" "}
            <strong className="text-warning">{product.available}</strong> item
          </p>
          {product.category === "T-shirt" && (
            <select name="" id="">
              <option value="" disabled defaultValue>
                Select Size
              </option>
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
              <option value="xl">XL</option>
            </select>
          )}
          <input
            type="number"
            min="1"
            max={product.available}
            value={quantity}
            onChange={(e) => setQuantity(+e.target.value)}
            placeholder="1"
            // onKeyDown={(e) => e.preventDefault()}
          />
          <button
            className="btn add-button"
            disabled={
              quantity > product.available || quantity <= 0 ? true : false
            }
            onClick={() => {
              dispatch(
                addToCart({ ...product, quantity, image: imgRef.current.src })
              );
              Swal.fire({
                icon: 'success',
                title: 'Product added to cart',
                showConfirmButton: false,
                timer: 1500
              })
            }}
          >
            <i class="fa-solid fa-cart-plus"></i> Add To Cart
          </button>
          <h4>Product Details</h4>
          <span>{product.description}</span>
        </div>
      </section>)}
    </>
  );
}
