import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as yup from "yup";
import * as movieValidation from "../../validation/movieValidation";
import Select from "react-select";

import imgDefault from "../../assets/img/Add-Movies.jpg";
import { getAllProducts, searchProduct } from "../../api/apiProduct";
import { addNewMovie } from "../../api/apiMovies";
import Swal from "sweetalert2";

export default function AddMovie() {
  const [loader, setLoader] = useState(true);
  const addMovieSchema = yup.object().shape({
    name: movieValidation.name,
    rate: movieValidation.rate,
    type: movieValidation.type,
    description: movieValidation.description,
    production_year: movieValidation.production_year,
    trailer: movieValidation.trailer,
    poster_image: movieValidation.poster,
    cover_image: movieValidation.cover,
    videos: movieValidation.videos,
  });
  const [img, setImg] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectCheck, setSelectCheck] = useState(false);
  const [productList, setProductList] = useState([]);
  const [productListSearch, setProductListSearch] = useState([]);
  const [productAddList, setProductAddList] = useState([]);

  const handlePoster = (e) => {
    setImg(e.target.value);
  };
  const handleCategory = (e) => {
    if (e.length >= 0) setSelectedCategories(e);
    setSelectCheck(true);
  };
  const handleSearch = (e) => {
    searchProduct({ name: e.target.value }).then((data) => {
      if (data?.message) setProductListSearch(data.products);
    });
  };

  const addProduct = (obj) => {
    let list = [...productAddList];
    const check = list.find((item) => item._id === obj._id);
    if (!check) {
      list.push(obj);
      setProductAddList(list);
    }
  };
  const deleteProduct = (id) => {
    let list = [...productAddList];
    list = list.filter((item) => item._id !== id);
    setProductAddList(list);
  };

  const dataSubmit = (obj, { resetForm }) => {
    if (!selectedCategories.length) setSelectCheck(true);
    else {
      setLoader(false);
      const category = selectedCategories.map((item) => item.value);
      const products = productAddList.map((item) => item._id);
      obj["category"] = category;
      obj["products"] = products;
      addNewMovie(obj).then((data) => {
        if (data?.message) {
          setLoader(true);
          Swal.fire({
            icon: "success",
            title: data.message,
          });
          setSelectedCategories([]);
          setSelectCheck(false);

          setProductAddList([]);
          resetForm();
        }
      });
    }
  };
  useEffect(() => {
    getAllProducts(1).then((data) => {
      if (data?.message) setProductList(data.allProducts);
    });
  }, []);
  return (
    <>
      <section className="col-xl-10 py-5 text-light offset-xl-2">
        <h2 className="pt-xl-0 pt-3 pb-2 ms-lg-5">Add Movie</h2>
        <section className="row">
          <article className="col-xl-3 col-md-4 col-10 mx-auto ">
            <div className="col-10 mx-auto">
              <img
                src={img ? img : imgDefault}
                alt="Profile"
                className="w-100 rounded-3 shadow-sm "
              />
            </div>
            {productListSearch.length || productList.length ? (
              <div className="col-10 mx-auto">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="mt-3 rounded-bottom-0"
                  aria-label="Search"
                  onChange={handleSearch}
                />
                <div
                  className="rounded-bottom-3 overflow-y-auto"
                  style={{ maxHeight: "200px" }}
                >
                  <ul className="list-group list-group-flush">
                    {(productListSearch.length
                      ? productListSearch
                      : productList
                    ).map((item) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={item._id}
                      >
                        <img
                          src={
                            item.images.length
                              ? item.images[0].secure_url
                              : imgDefault
                          }
                          alt="img"
                          className="w-25 rounded-3"
                        />
                        <span>{item.name} </span>
                        <i
                          className="fa-solid fa-plus cursor text-hover"
                          onClick={() => addProduct(item)}
                        ></i>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="vh-100 d-flex align-items-center justify-content-center">
                <i
                  className="fas fa-spinner fa-spin fa-3x"
                  aria-hidden="true"
                ></i>
              </div>
            )}

            {productAddList.length ? (
              <div
                className="my-3 overflow-y-auto col-10 mx-auto"
                style={{ borderRadius: "10px 0 0 10px", maxHeight: "200px" }}
              >
                <ul className="list-group list-group-flush">
                  {productAddList.map((item) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center "
                      key={item._id}
                    >
                      <img
                        src={
                          item.images.length
                            ? item.images[0].secure_url
                            : imgDefault
                        }
                        alt="img"
                        className="w-25 rounded-3"
                      />
                      <span>{item.name} </span>
                      <i
                        className="fa-solid fa-trash cursor text-hover"
                        onClick={() => deleteProduct(item._id)}
                      ></i>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              ""
            )}
          </article>
          <Formik
            validationSchema={addMovieSchema}
            onSubmit={dataSubmit}
            initialValues={{
              name: "",
              rate: "",
              type: "",
              description: "",
              production_year: "",
              trailer: "",
              poster_image: img,
              cover_image: "",
              videos: "",
            }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
            }) => (
              <Form
                noValidate
                onSubmit={handleSubmit}
                className="col-lg-6 col-md-7 col-10  mx-auto  pt-md-0 pt-4  "
              >
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.name && !errors.name}
                    isInvalid={touched.name && errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="rate">
                  <Form.Label>Rate</Form.Label>
                  <Form.Control
                    type="number"
                    name="rate"
                    placeholder=" "
                    value={values.rate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.rate && !errors.rate}
                    isInvalid={touched.rate && errors.rate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.rate}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="type">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.type && !errors.type}
                    isInvalid={touched.type && errors.type}
                  >
                    <option>Select One</option>
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                    <option value="anime">Anime</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.type}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Select
                    isMulti
                    name="category"
                    value={selectedCategories}
                    options={movieValidation.movieCategories}
                    className="text-dark"
                    onChange={handleCategory}
                    onBlur={handleCategory}
                  />
                  {selectCheck && !selectedCategories.length && (
                    <div className="text-danger">Category is required</div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="production_year">
                  <Form.Label>Production_year</Form.Label>
                  <Form.Control
                    type="number"
                    name="production_year"
                    placeholder=" "
                    value={values.production_year}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.production_year && !errors.production_year}
                    isInvalid={
                      touched.production_year && errors.production_year
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.production_year}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="poster">
                  <Form.Label>Poster</Form.Label>
                  <Form.Control
                    type="text"
                    name="poster_image"
                    placeholder=" "
                    value={values.poster_image}
                    onChange={handleChange}
                    onBlur={(e) => {
                      handlePoster(e);
                      handleBlur(e);
                    }}
                    isValid={touched.poster_image && !errors.poster_image}
                    isInvalid={touched.poster_image && errors.poster_image}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.poster_image}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="cover">
                  <Form.Label>Cover</Form.Label>
                  <Form.Control
                    type="text"
                    name="cover_image"
                    placeholder=" "
                    value={values.cover_image}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.cover_image && !errors.cover_image}
                    isInvalid={touched.cover_image && errors.cover_image}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cover_image}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="trailer">
                  <Form.Label>Trailer</Form.Label>
                  <Form.Control
                    type="text"
                    name="trailer"
                    placeholder=" "
                    value={values.trailer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.trailer && !errors.trailer}
                    isInvalid={touched.trailer && errors.trailer}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.trailer}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="videos">
                  <Form.Label>Videos</Form.Label>
                  <Form.Control
                    type="text"
                    name="videos"
                    placeholder=" "
                    value={values.videos}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.videos && !errors.videos}
                    isInvalid={touched.videos && errors.videos}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.videos}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.description && !errors.description}
                    isInvalid={touched.description && errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="py-3">
                  <Button type="submit" className="btn-primary">
                    {loader ? "Add" : "Waiting......"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </section>
      </section>
    </>
  );
}
