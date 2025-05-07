const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000;

const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === "/api") {
    fs.readFile(path.join(__dirname, "public", "db.json"), "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Server Error" }));
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // CORS fix
      });
      res.end(data);
    });
  } else {
    let filePath = path.join(__dirname, "public", req.url === "/" ? "index.html" : req.url);
    let ext = path.extname(filePath);

    let contentType = "text/html";
    if (ext === ".css") contentType = "text/css";
    if (ext === ".js") contentType = "application/javascript";

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end("Page Not Found");
      } else {
        res.writeHead(200, {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
        });
        res.end(content);
      }
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
