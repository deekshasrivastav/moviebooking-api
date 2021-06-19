require('./config/config');
require("./db/mongoose");

const express = require("express");
let {Screen} = require('./models/screen');
let {isAvailable} = require('./util/checkSeatAvaibility');
let {getUnreservedSeats} = require('./util/unreservedSeats');
let {getSeatAvailableAtChoice} = require('./util/checkSeatOfChoice');
const port = process.env.PORT;

const app = express();

app.get("/", (req, res) => {
  res.send({ message: "HEALTH CHECK OK !" });
});
app.get("/favicon.ico", (req, res) => {
  res.status(204);
  res.end();
});

// Enable CORS for client-side
// const cors = (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
//   );
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// };


app.use(express.json());

//API to accept details of movie in the theatre
app.post('/theatres', async (req, res) => {

  try {
    let screen = new Screen(req.body);
    await screen.save();
    res.send();
  } catch (e) {
      res.status(400).send(e);
  }

});

//API to reserve tickets for given seats in a given screen
app.post("/theatres/:movie_name/reserve", async (req, res) => {
  try {
    let screenName = req.params.movie_name;
    let seats = req.body.seats;
    await isAvailable(movie_name, seats);
    res.send("Reservation is successful");
  } catch (e) {
    res.status(400).send(e);
  }
});

/*
API to get the available seats for a given screen
And also
API to get information of available tickets at a given position
Same endpoint will be used for both. We will differentiate from queries.
*/
app.get("/theatres/:movie_name/seats", async (req, res) => {
  try {
    let query = req.query;
    if (query.status && query.status === "unreserved") {
      //to get the available seats for a given screen
      let unreservedSeats = await getUnreservedSeats(req.params.movie_name);
      res.send(unreservedSeats);
    } else if (query.numOfSeats && query.choice) {
      //to get information of available tickets at a given position
      let seatOfChoice = await getSeatAvailableAtChoice(
        req.params.movie_name,
        query.numOfSeats,
        query.choice
      );
      res.send(seatOfChoice);
    } else {
      //return error 404 if any other endpoint is used.
      return res.status(404).send("Page not found");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});


app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};
