const http = require('http');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 4100;
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const server = http.createServer(async (req, res) => {
  const url = req.url;

  if (url === '/' || url === '/index.html') {
    const filePath = path.join(__dirname, 'Public', 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading homepage');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });

  } else if (url === '/api') {
    try {
      await client.connect();
      const db = client.db('apparels_hub');
      const collection = db.collection('Brands');

      const data = await collection.find().toArray();

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(data));

    } catch (err) {
      res.writeHead(500);
      res.end('Error fetching data');
    }
  } else {
    let filePath = path.join(__dirname, "Public", req.url === "/" ? "index.html" : req.url);
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
  console.log(`Server is running on port ${port}`);
});
