import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import tombstone from "../assets/tombstone.png";

const Confirmation = () => {
  const [reservationData, setReservationData] = useState({});
  const [reservationId, setReservationId] = useState(useParams().reservationId);
  const navigate = useNavigate();

  useEffect(() => {
    if (reservationId) {
      fetchReservation();
    }
  }, [reservationId]);

  const fetchReservation = async () => {
    try {
      const response = await fetch(`/api/get-reservation/${reservationId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched reservation data:", data);
        setReservationData(data);
      } else {
        console.error("Error fetching reservation");
      }
    } catch (error) {
      console.error("Error fetching reservation", error);
    }
  };

  const goToReservations = () => {
    navigate("/reservation");
  };

  return (
    <Wrapper>
      <P1>Your flight is booked!</P1>
      <P2>Reservation ID: {reservationData._id}</P2>
      <P2>Flight: {reservationData.flight}</P2>
      <P2>Seat: {reservationData.seat}</P2>
      <P2>
        Name: {reservationData.firstName} {reservationData.lastName}
      </P2>

      <P2>Email: {reservationData.email}</P2>
      <Img src={tombstone} alt="Tombstone" />
      <Button onClick={goToReservations}>Reservations</Button>
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
const Img = styled.img`
  width: 20%;
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
const Button = styled.button`
  padding: 10px;
  font-size: 20px;
  background-color: #aa001e;
  border-color: #aa001e;
  cursor: pointer;
`;
export default Confirmation;
