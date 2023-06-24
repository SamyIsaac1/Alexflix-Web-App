import { configAxios } from "./config.js";

export const adminGetAllOrders = async () => {
  try {
    const check = await configAxios.get("admin/order");
    if (check?.data) return check.data;
  } catch (error) {
    return error;
  }
};

export const adminUpdateOrderById = async (id) => {
  try {
    const check = await configAxios.patch(`admin/order/${id}`);
    if (check?.data) return check.data;
  } catch (error) {
    return error;
  }
};

export const adminDeleteOrderById = async (id) => {
  try {
    const check = await configAxios.delete(`admin/order/${id}`);
    if (check?.data) return check.data;
  } catch (error) {
    return error;
  }
};

export const userPostNewOrder = async (data) => {
  try {
    const check = await configAxios.post(`/user/order`, data);
    if (check?.data) return check.data;
  } catch (error) {
    return error;
  }
};

export const getAllUserOrders = async () => {
  try {
    const check = await configAxios.get(`/user/order`);
    if (check?.data) return check.data;
  } catch (error) {
    return error;
  }
};

export const userDeleteHisOrder = async (id) => {
  try {
    const check = await configAxios.delete(`/user/order`, {
      data: { _id: id },
    });
    console.log(check);
    if (check?.data) return check;
  } catch (error) {
    return error;
  }
};
