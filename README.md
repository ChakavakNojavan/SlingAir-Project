# Node.JS Project: SlingAir!

<img src='frontend/src/assets/screenshots/header.png' style='width:100%' />

## The App

### Screenshots

<img src='frontend/src/assets/screenshots/seat-select.png' style='float:left;width:48%;margin-right:4%;' />
<img src='frontend/src/assets/screenshots/confirmed.png' style='width:48%;' />

---

### Functionality

- When a user navigates to `http://localhost:3000`, they are presented with a dropdown to select the flight number.
- With the flight number, make a request to the server for the seating availability on that flight.
- When a response with seating is received, display the seating input as well as the form requesting user's information.
- User selects a seat, enters information and clicks 'Confirm'.
- Contact the server with the data, and wait for a success response to redirect to the `/confirmation` page.
- The confirmation page displays a confirmation message to the user with the info that they entered on the previous screen.

---

## Project Setup

### The Frontend

1. Open a terminal in VS Code
2. Type `cd frontend`
3. Type `yarn install`

Use `yarn dev:frontend` to start the frontend dev environment.

### The Backend

1. Open _another_ terminal in VS Code
2. Type `cd backend`
3. Type `yarn install`

Use `yarn dev:backend` to start the backend dev environment.

![dual terminal](frontend/src/assets/screenshots/dual_terminal.gif)




