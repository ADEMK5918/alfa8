
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const filePath = __dirname + "/users.json";

function readUsers() {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function writeUsers(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.get("/users", (req, res) => {
  res.json(readUsers());
});

app.post("/users", (req, res) => {
  const { password, redirect } = req.body;
  const users = readUsers();
  users[password] = { redirect };
  writeUsers(users);
  res.json({ success: true });
});

app.delete("/users/:password", (req, res) => {
  const users = readUsers();
  delete users[req.params.password];
  writeUsers(users);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
