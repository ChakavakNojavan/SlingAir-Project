const { MongoClient } = require("mongodb");
require("dotenv").config();

const {
  flights: initialFlights,
  reservations: initialReservations,
} = require("./data");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function importData() {
  try {
    await client.connect();

    const flightsCollection = client.db("SlingAir").collection("flights");
    const reservationsCollection = client
      .db("SlingAir")
      .collection("reservations");

    const flights = Object.keys(initialFlights).map((flightId) => ({
      _id: flightId,
      flight: flightId,
      seats: initialFlights[flightId],
    }));

    await flightsCollection.insertMany(flights);

    await reservationsCollection.insertMany(initialReservations);

    console.log("Data imported successfully");
  } catch (error) {
    console.error("Error importing data:", error);
  } finally {
    await client.close();
  }
}

importData();
