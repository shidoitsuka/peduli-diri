const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

app.get("/login", (req, res) => {
  res.render("login");
});


app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/user/:nik", (req, res) => {
  const { nik } = req.params;
  const data = JSON.parse(fs.readFileSync(`./data/${nik}.txt`));
  res.status(200).send({ result: "success", data });
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/dashboard/new", (req, res) => {
  res.render("new");
});

app.get("/dashboard/history", (req, res) => {
  res.render("history");
});

app.post("/api/history/:nik", (req, res) => {
  const { nik } = req.params
  const data = JSON.parse(fs.readFileSync(`./data/${nik}.txt`));
  res.status(200).send({ result: "success", data });
});

app.post("/api/login", (req, res) => {
  const { nik, name } = req.body;
  fs.readdir("./data", (err, files) => {
    files.map(file => {
      const e = file.slice(0, file.indexOf("."));
      try {
        const user = JSON.parse(fs.readFileSync(`./data/${nik}.txt`, "utf8"));
        if (user.name.toLowerCase() != name.toLowerCase()) return res.status(500).send({ result: "failed", message: "Mohon periksa data anda." });
        if (e == nik) return res.status(200).send({ result: "success", message: "Berhasil login!" });
      } catch (_) {
        return res.status(500).send({ result: "failed", message: "User tidak ditemukan." });
      }
    });
  });
});

app.post("/api/register", (req, res) => {
  const { nik, name } = req.body;
  fs.readdir("./data", (err, files) => {
    if (files.includes(nik)) return res.status(500).send({ result: "failed", message: "NIK sudah terdaftar" });
    else {
      fs.writeFileSync(`./data/${nik}.txt`, JSON.stringify({ name, history: [] }));
      res.status(200).json({ result: "success", message: `${name} berhasil di registrasi.` });
      return;
    }
  });
});

app.post("/api/:nik", (req, res) => {
  const { nik } = req.params;
  const { date, time, location, temp } = req.body;
  const userData = JSON.parse(fs.readFileSync(`./data/${nik}.txt`, "utf-8"));
  userData.history.push({ date, time, location, temp });
  fs.writeFileSync(`./data/${nik}.txt`, JSON.stringify(userData));
  res.status(200).json({ result: "success", message: "Berhasil melakukan check-in!" })
});

app.listen(3000, () => console.log("listening"));
