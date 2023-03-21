"use strict";

const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
(async () => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  const db = client.db(dbName);
  const flightsCollection = db.collection("flights");
  const reservationsCollection = db.collection("reservations");

  const handlers = require("./handlers")(
    flightsCollection,
    reservationsCollection
  );

  // import the needed node_modules.
  const express = require("express");
  const morgan = require("morgan");
  express()
    // Below are methods that are included in express(). We chain them for convenience.
    // --------------------------------------------------------------------------------

    // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
    .use(morgan("tiny"))
    .use(express.json())

    // Any requests for static files will go into the public folder
    .use(express.static("public"))

    // Nothing to modify above or below this line
    // ---------------------------------

    .get("/api/get-flights", (req, res) => handlers.getFlights(req, res))
    .get("/api/get-flight/:flight", (req, res) => handlers.getFlight(req, res))
    .get("/api/get-reservations", (req, res) =>
      handlers.getReservations(req, res)
    )
    .get("/api/get-reservation/:reservation", (req, res) =>
      handlers.getSingleReservation(req, res)
    )
    .post("/api/add-reservation", (req, res) =>
      handlers.addReservation(req, res)
    )
    .patch("/api/update-reservation", (req, res) =>
      handlers.updateReservation(req, res)
    )
    .delete("/api/delete-reservation/:reservation", (req, res) =>
      handlers.deleteReservation(req, res)
    )
    // ---------------------------------
    // Nothing to modify above or below this line

    // this is our catch all endpoint.
    .get("*", (req, res) => {
      res.status(404).json({
        status: 404,
        message: "This is obviously not what you are looking for.",
      });
    })
    // Node spins up our server and sets it to listen on port 8000.
    .listen(8000, () => console.log(`Listening on port 8000`));

  process.on("SIGINT", async () => {
    console.log("Closing server...");
    await client.close();
    process.exit();
  });
})();
