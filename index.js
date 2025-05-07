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
    const filePath = path.join(__dirname, 'public', 'index.html');
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
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
