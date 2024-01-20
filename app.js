import { checkResponse } from "./api";

const authBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://wtwr-api.onrender.com"
    : "http://localhost:3001";

export const registerUser = ({ email, password, name, avatar }) => {
  console.log("Registering user:", { email, name, avatar }); // Log input data
  return fetch(`${authBaseUrl}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name, avatar }),
  })
    .then((res) => {
      console.log("Response from registerUser:", res);
      return checkResponse(res);
    })
    .then((data) => {
      console.log("Data from registerUser:", data);
      return data;
    });
};

export const loginUser = ({ email, password }) => {
  console.log("Logging in user:", { email }); // Log input data
  return fetch(`${authBaseUrl}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      console.log("Response from loginUser:", res);
      return checkResponse(res);
    })
    .then((data) => {
      console.log("Data from loginUser:", data);
      return data;
    });
};

export const getUserInfo = (token) => {
  console.log("Fetching user info with token:", token); // Log input data
  return fetch(`${authBaseUrl}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      console.log("Response from getUserInfo:", res);
      return checkResponse(res);
    })
    .then((data) => {
      console.log("Data from getUserInfo:", data);
      return data;
    });
};

export const editProfile = (name, avatar, token) => {
  console.log("Editing user profile:", { name, avatar, token }); // Log input data
  return fetch(`${authBaseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, avatar }),
  })
    .then((res) => {
      console.log("Response from editProfile:", res);
      return checkResponse(res);
    })
    .then((data) => {
      console.log("Data from editProfile:", data);
      return data;
    });
};
