import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { NavAuth } from "../NavAuth  Component/NavAuth";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import logo from "../../../assets/images/logo trans2.png";
import "./nav.css";
import { PopUpMsg } from "../../../api/apiStream";
import { removeAllFromCart } from "../../../store/Slice/cart";
export function Nav({ positionStyle }) {
  const dispatch = useDispatch();
  const navCollapseScreen = 992;
  const navbar = useRef();
  const toggler = useRef();
  const [isloggedIn, setIsloggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const totalInCart = useSelector((state) => state.cart.total);
  const linkClickHandle = (e) => {
    window.scrollTo(0, 0);
    if (
      window.innerWidth <= navCollapseScreen &&
      toggler.current.getAttribute("aria-expanded") === "true"
    ) {
      let bsCollapse = new bootstrap.Collapse(navbar.current);
      bsCollapse.hide();
    }
  };
  const linkClickHandleWithGuestCheck = (e) => {
    if (localStorage.getItem("token")) {
      linkClickHandle(e);
    } else {
      e.preventDefault();
      return PopUpMsg({ message: "Please Login First" });
    }
  };
  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    dispatch(removeAllFromCart());
  };
  useEffect(() => {
    //check if it's a logged in user
    if (localStorage.getItem("token")) setIsloggedIn(true);
    else setIsloggedIn(false);
    //Applying Navbar effect
    window.addEventListener("scroll", () => {
      window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false);
    });
  }, []);

  return (
    <nav
      id="home-navbar"
      className={`navbar navbar-expand-lg py-3 ${
        isScrolled ? "scrolled" : ""
      } ${positionStyle} w-100`}
    >
      <div className="container mw-100 px-4 ">
        <Link className="navbar-brand py-1" to={"/"} onClick={linkClickHandle}>
          <img src={logo} alt="Alexflix" width="170" height="35" />
        </Link>
        <button
          ref={toggler}
          id="nav-toggler"
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span id="nav-toggler-icon" className="navbar-toggler-icon">
            <i className="fa-solid fa-bars " style={{ fontSize: "28px" }}></i>
          </span>
        </button>
        <div
          ref={navbar}
          className="collapse navbar-collapse justify-content-between"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mb-2 mb-lg-0 flex-grow-1">
            <li className="nav-item">
              <NavLink
                onClick={linkClickHandleWithGuestCheck}
                className="nav-link"
                to={"/movies"}
                end
              >
                Movies
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                onClick={linkClickHandleWithGuestCheck}
                className="nav-link"
                to={"/series"}
                end
              >
                Series
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                onClick={linkClickHandleWithGuestCheck}
                className="nav-link"
                to={"/anime"}
                end
              >
                Anime
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                onClick={linkClickHandleWithGuestCheck}
                className="nav-link position-relative"
                to={"/store"}
                end
              >
                <span id="badge-icon" className=" position-relative">
                  Store
                  <span className="blue-purple-badge">NEW</span>
                </span>
              </NavLink>
            </li>

            <li id="separator" className="nav-item flex-grow-1"></li>
            <li id="lg-bag" className="nav-item ">
              <NavLink
                onClick={linkClickHandleWithGuestCheck}
                className="nav-link  me-2"
                to={"/store/cart"}
              >
                <span id="cart-icon-container" className="position-relative">
                  <i className="fa-solid fa-cart-shopping fa-lg" />
                  <span
                    id="cart-count"
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  >
                    {totalInCart}
                  </span>
                </span>
              </NavLink>
            </li>

            <li className={`nav-item ${isloggedIn ? "d-none" : "d-block"}`}>
              <NavAuth />
            </li>
            <li
              className={`nav-item dropdown ${
                isloggedIn ? "d-block" : "d-none"
              }`}
            >
              <Link
                id="user_icon"
                className="nav-link btn rounded-circle py-2 dropdown-toggle text-start"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fa-solid fa-user"></i>
              </Link>

              <ul id="user_dropdown" className="dropdown-menu">
                <li>
                  <Link
                    onClick={linkClickHandleWithGuestCheck}
                    className="dropdown-item text-capitalize"
                    to={"/profile"}
                  >
                    profile
                  </Link>
                </li>

                <li>
                  <Link
                    onClick={linkClickHandleWithGuestCheck}
                    className="dropdown-item text-capitalize"
                    to={"/favorites"}
                  >
                    my list
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={linkClickHandleWithGuestCheck}
                    className="dropdown-item text-capitalize"
                    to={"/user/orders"}
                  >
                    orders
                  </Link>
                </li>

                <li>
                  <Link
                    onClick={linkClickHandleWithGuestCheck}
                    className="dropdown-item text-capitalize"
                    to={"/settings"}
                  >
                    settings
                  </Link>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link
                    className="dropdown-item text-capitalize"
                    to="/login"
                    onClick={signOut}
                  >
                    sign out &nbsp;
                    <i className="fa-solid fa-right-from-bracket"></i>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
