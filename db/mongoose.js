const mongoose = require("mongoose");
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose.connect(process.env.MONGODB_URI, options);

mongoose.connection.on("connected", () => {
  console.log("Mongoose connection Ok");
});

mongoose.connection.on("error", (err) => {
  console.log(`Mongoose connection has occured ${err} error`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection is disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(
      "Mongoose connection is disconnected due to application termination"
    );
    process.exit(0);
  });
});
