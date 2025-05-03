const axios = require("axios");

const LOGIN_URL = "http://localhost:4001/api/auth/login";

const loginAndGetToken = async () => {
  const response = await axios.post(LOGIN_URL, {
    username: "admin",      // reemplaza con tu usuario real
    password: "admin123"    // reemplaza con tu contraseña real
  });
  return response.data.token;
};

module.exports = { loginAndGetToken };
