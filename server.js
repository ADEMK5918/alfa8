const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// users.json dosyasının yolu
const filePath = __dirname + "/users.json";

// Kullanıcıları okumak için bir fonksiyon
function readUsers() {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch {
    return {}; // Eğer dosya yoksa, boş bir obje döndür
  }
}

// Kullanıcıları yazmak için bir fonksiyon
function writeUsers(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Ana sayfa rotası
app.get("/", (req, res) => {
  res.send("Sunucu çalışıyor! 👌 /users endpoint'ini kullanabilirsin.");
});

// GET /users - Kullanıcıları listeleme
app.get("/users", (req, res) => {
  res.json(readUsers());
});

// POST /users - Yeni kullanıcı ekleme
app.post("/users", (req, res) => {
  const { password, redirect } = req.body; // POST gövdesinden password ve redirect al
  const users = readUsers();
  users[password] = { redirect }; // Yeni kullanıcı ekle
  writeUsers(users); // Güncellenmiş kullanıcıları yaz
  res.json({ success: true });
});

// DELETE /users/:password - Kullanıcıyı silme
app.delete("/users/:password", (req, res) => {
  const users = readUsers();
  delete users[req.params.password]; // Belirtilen şifreye sahip kullanıcıyı sil
  writeUsers(users); // Güncellenmiş kullanıcıları yaz
  res.json({ success: true });
});

// Sunucuyu başlatma
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
