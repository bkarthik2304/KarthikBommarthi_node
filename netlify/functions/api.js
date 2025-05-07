const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  const filePath = path.join(__dirname, '../../public/db.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Content-Type": "application/json"
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read JSON data' })
    };
  }
};
