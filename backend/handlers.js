"use strict";

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

// returns an array of all flight numbers
const getFlights = async (flightsCollection, req, res) => {
  try {
    const flightNumbers = await flightsCollection
      .find({}, { projection: { _id: 0, flight: 1 } })
      .toArray();
    res.status(200).json(flightNumbers.map((flight) => flight.flight));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching flights" });
  }
};

// returns all the seats on a specified flight
const getFlight = async (flightsCollection, req, res) => {
  const flightNumber = req.params.flight;
  try {
    const flight = await flightsCollection.findOne({ flight: flightNumber });
    if (flight) {
      res.json(flight);
    } else {
      res.status(404).json({ error: "Flight not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching flight");
  }
};

// returns all reservations
const getReservations = async (reservationsCollection, req, res) => {
  try {
    const allReservations = await reservationsCollection.find().toArray();
    res.json(allReservations);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching reservations");
  }
};

// returns a single reservation
const getSingleReservation = async (reservationsCollection, req, res) => {
  const reservationId = req.params.reservation;
  try {
    const reservation = await reservationsCollection.findOne({
      _id: reservationId,
    });
    if (reservation) {
      res.json(reservation);
    } else {
      res.status(404).json({ error: "Reservation not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching reservation");
  }
};
const updateSeatAvailability = async (
  flightsCollection,
  flightId,
  seat,
  isAvailable
) => {
  const flight = await flightsCollection.findOne({ _id: flightId });

  if (!flight) {
    throw new Error("Flight not found");
  }

  const seatIndex = flight.seats.findIndex((s) => s.id === seat);

  if (seatIndex === -1) {
    throw new Error("Seat not found");
  }

  await flightsCollection.updateOne(
    { _id: flightId, "seats.id": seat },
    { $set: { "seats.$.isAvailable": isAvailable } }
  );
};

// creates a new reservation
const addReservation = async (
  flightsCollection,
  reservationsCollection,
  req,
  res
) => {
  try {
    const { flight, seat, firstName, lastName, email } = req.body;

    if (flight && seat && firstName && lastName && email) {
      const newReservation = {
        _id: uuidv4(),
        flight,
        seat,
        firstName,
        lastName,
        email,
      };

      await updateSeatAvailability(flightsCollection, flight, seat, false);

      console.log("addReservation: New reservation:", newReservation);
      await reservationsCollection.insertOne(newReservation);
      res.status(201).json(newReservation);
    } else {
      res.status(400).json({ error: "Missing required reservation data" });
    }
  } catch (error) {
    console.error("Error in addReservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// updates a specified reservation
const updateReservation = async (
  flightsCollection,
  reservationsCollection,
  req,
  res
) => {
  const { _id, flight, seat, givenName, surname, email } = req.body;

  try {
    const reservation = await reservationsCollection.findOne({ _id: _id });
    if (!reservation) {
      res.status(404).json({ error: "Reservation not found" });
      return;
    }

    const updatedReservation = {
      _id,
      flight,
      seat,
      givenName,
      surname,
      email,
    };

    await updateSeatAvailability(
      flightsCollection,
      reservation.flight,
      reservation.seat,
      true
    );
    await updateSeatAvailability(flightsCollection, flight, seat, false);

    const { matchedCount, modifiedCount } =
      await reservationsCollection.updateOne(
        { _id },
        { $set: updatedReservation }
      );

    if (matchedCount && modifiedCount) {
      res.status(200).json(updatedReservation);
    } else {
      res.status(404).json({ error: "Reservation not found" });
    }
  } catch (error) {
    console.error("Error in updateReservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// deletes a specified reservation
const deleteReservation = async (
  flightsCollection,
  reservationsCollection,
  req,
  res
) => {
  const reservationId = req.params.reservation;

  try {
    const reservation = await reservationsCollection.findOne({
      _id: reservationId,
    });
    if (!reservation) {
      res.status(404).json({ error: "Reservation not found" });
      return;
    }

    await updateSeatAvailability(
      flightsCollection,
      reservation.flight,
      reservation.seat,
      true
    );

    const { deletedCount } = await reservationsCollection.deleteOne({
      _id: reservationId,
    });

    if (deletedCount) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Reservation not found" });
    }
  } catch (error) {
    console.error("Error in deleteReservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handlers = (flightsCollection, reservationsCollection) => {
  return {
    getFlights: (req, res) => getFlights(flightsCollection, req, res),
    getFlight: (req, res) => getFlight(flightsCollection, req, res),
    getReservations: (req, res) =>
      getReservations(reservationsCollection, req, res),
    addReservation: (req, res) =>
      addReservation(flightsCollection, reservationsCollection, req, res),
    getSingleReservation: (req, res) =>
      getSingleReservation(reservationsCollection, req, res),
    deleteReservation: (req, res) =>
      deleteReservation(flightsCollection, reservationsCollection, req, res),
    updateReservation: (req, res) =>
      updateReservation(flightsCollection, reservationsCollection, req, res),
  };
};

module.exports = handlers;
