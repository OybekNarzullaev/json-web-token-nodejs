const express = require("express");
const app = express();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const posts = [
  {
    username: "Oybek",
    title: "post 1",
  },
  {
    username: "Shohzod",
    title: "post 1",
  },
];

app.use(express.json());
app.get("/posts", authenticatedToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  console.log(req.body);
  if (!username) return res.sendStatus(400);
  const user = { name: username };
  console.log(user);
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.json({ accessToken: accessToken });
});

function authenticatedToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
app.listen(process.env.PORT, () => {
  console.log("Server has started on port 4000...");
});
