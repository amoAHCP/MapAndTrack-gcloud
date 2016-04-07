curl -X POST --data-binary "@src/test/resources/routes/Tour de Radwelt - Fronleichnam.json" -H Content-Type: application/json http://localhost:8080/_ah/api/myApi/v1/routes
curl -X POST --data-binary @src/test/resources/routes/Mtb4-tagesTourOstweg.json -H Content-Type: application/json http://localhost:8080/_ah/api/myApi/v1/routes
curl -X POST --data-binary @src/test/resources/routes/Westweg-Original.json -H Content-Type: application/json http://localhost:8080/_ah/api/myApi/v1/routes
