/*
Configuration class to setup port and mongodb url for development purpose.
For production these values are setup through config variable of heroku.
*/

var env = process.env.NODE_ENV || 'development';

if (env === "development") {
  process.env.PORT = 5000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/MovieTicketapi";
} 
