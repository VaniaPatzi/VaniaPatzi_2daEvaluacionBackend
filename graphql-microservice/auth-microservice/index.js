const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4003;
const SECRET_KEY = "supersecreto";

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Simulación de usuario fijo
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ token });
  }

  res.status(401).json({ message: "Credenciales incorrectas" });
});

app.listen(PORT, () => {
  console.log(` Auth Microservicio en http://localhost:${PORT}/login`);
});
