const http = require('http');
const mongodb = require('mongodb');

const hostname = '127.0.0.1'; // localhost
const port = 3000;
const dbUrl = 'mongodb://127.0.0.1:27017'; // für lokale MongoDB
const mongoClient = new mongodb.MongoClient(dbUrl);

async function startServer() {
  await mongoClient.connect(); // Verbindung zur Datenbank herstellen
  server.listen(port, hostname, () => { // Server starten
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}
//Ki hat server zum laufen gebracht
const server = http.createServer(async (request, response) => {
  
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Der Browser schickt automatisch einen OPTIONS-Request vor POST/DELETE mit JSON-Body.
  // Ohne diese Antwort hier blockiert der Browser den eigentlichen Request (CORS-Preflight).
  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    return response.end();
  }

  const requestUrl = new URL(request.url || '', `http://${request.headers.host}`);
  const warenkorbCollection = mongoClient.db('Blumenladen').collection('Warenkorb');

  if (requestUrl.pathname === '/Warenkorb') {
   
    if (request.method === 'GET') {
      const result = await warenkorbCollection.find({}).toArray();
      response.setHeader('Content-Type', 'application/json');
      return response.end(JSON.stringify(result));
    }

    //Speichern
    if (request.method === 'POST') {
      let jsonString = '';
      request.on('data', chunk => { jsonString += chunk; });
      request.on('end', async () => {
        try {
          const item = JSON.parse(jsonString);
          const insertResult = await warenkorbCollection.insertOne(item);
          response.setHeader('Content-Type', 'application/json');
          response.statusCode = 201;
          
          // gezielt löschen 
          response.end(JSON.stringify({ _id: insertResult.insertedId, ...item }));
        } catch (err) {
          console.error(err);
          response.statusCode = 500;
          response.end(JSON.stringify({ error: 'Konnte Artikel nicht speichern' }));
        }
      });
     
      return;
    }

    //Einzelnen Artikel löschen
    if (request.method === 'DELETE') {
      const id = requestUrl.searchParams.get('id');
      if (!id) {
        response.statusCode = 400;
        return response.end(JSON.stringify({ error: 'id Parameter fehlt' }));
      }
      try {
        await warenkorbCollection.deleteOne({ _id: new mongodb.ObjectId(id) });
        response.setHeader('Content-Type', 'application/json');
        return response.end(JSON.stringify({ deleted: true }));
      } catch (err) {
        console.error(err);
        response.statusCode = 500;
        return response.end(JSON.stringify({ error: 'Konnte Artikel nicht löschen' }));
      }
    }

    response.statusCode = 405; 
    return response.end();
  }

  // Kompletten Warenkorb leeren
  if (requestUrl.pathname === '/clearAll' && request.method === 'DELETE') {
    await warenkorbCollection.deleteMany({});
    response.setHeader('Content-Type', 'application/json');
    return response.end(JSON.stringify({ cleared: true }));
  }

  response.statusCode = 404;
  response.end();
});

startServer();



