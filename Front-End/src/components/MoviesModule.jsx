import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import AsyncSelect from "react-select/async";

import { useSelector } from "react-redux";
import { getAllProducts, searchProduct } from "../api/apiProduct";
import { productListForm } from "../Utils/moviesUtils";

export default function MoviesModule(props) {
  const loader = useSelector((state) => state.loader);

  const { show, setShow, itemSelect, updateMovie } = props;
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [productList, setProductList] = useState([]);

  const handleCategory = (e) => {
    if (e.length >= 0) setSelectedCategories(e);
  };

  const handleInputChange = (inputValue, callback) => {
    if (inputValue)
      searchProduct({name:inputValue}).then((data) => {
        if (data?.message) callback(productListForm(data.products));
      });
    else {
      callback([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const products = selectedCategories.map((item) => item.value);
    const list = selectedCategories.map((item) => item.list);
    updateMovie(
      {
        _id: itemSelect._id,
        products,
      },
      list
    );
  };
  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    getAllProducts(1).then((data) => {
      if (data?.message) setProductList(productListForm(data.allProducts));
    });
  }, []);

  useEffect(() => {
    setSelectedCategories(productListForm(itemSelect.products));
  }, [itemSelect]);

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <b>Movie Name : </b>
            {itemSelect.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="product">
              <Form.Label>Products</Form.Label>
              <AsyncSelect
              isMulti
                cacheOptions
                defaultOptions={productList}
                loadOptions={handleInputChange}
                onChange={handleCategory}
                onBlur={handleCategory}
                defaultValue={productListForm(itemSelect?.products)}

              />
            </Form.Group>

            <div className="d-flex justify-content-between py-3">
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                {loader ? "Update" : "Waiting......"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
