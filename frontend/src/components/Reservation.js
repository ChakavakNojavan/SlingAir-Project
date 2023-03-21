import styled from "styled-components";
import { useState, useEffect } from "react";

const Reservation = () => {
  const [latestReservation, setLatestReservation] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/get-reservations");
      if (response.ok) {
        const data = await response.json();
        const sortedReservations = data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        console.log("Sorted reservations:", sortedReservations);
        setLatestReservation(sortedReservations[sortedReservations.length - 1]);
      } else {
        console.error("Error fetching reservations");
      }
    } catch (error) {
      console.error("Error fetching reservations", error);
    }
  };
  return (
    <Wrapper>
      {latestReservation ? (
        <>
          <P1>Latest Reservation</P1>
          <P2>Reservation ID: {latestReservation._id}</P2>
          <P2>Flight: {latestReservation.flight}</P2>
          <P2>Seat: {latestReservation.seat}</P2>
          <P2>
            Name: {latestReservation.firstName} {latestReservation.lastName}
          </P2>
          <P2>Email: {latestReservation.email}</P2>
        </>
      ) : (
        <P1>Loading reservation...</P1>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  padding: 20px;
`;
const P1 = styled.p`
  color: #d80026;
  font-size: 30px;
  padding: 20px;
  font-weight: bold;
`;
const P2 = styled.p`
  padding: 5px;
  font-size: 20px;
`;

export default Reservation;
