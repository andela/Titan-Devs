import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import errorhandler from "errorhandler";
import dotenv from "dotenv";
import methodOverride from "method-override";
import morgan from "morgan";
import routers from "./routes";

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(methodOverride());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use(express.static(`${__dirname}/public`));

app.use(
  session({
    secret: process.env.SECRET_OR_KEY,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (!isProduction) {
  app.use(errorhandler());
}

app.use("/api/v1/", routers);

// catch 404 and forward to error handler
app.use(next => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, res) => {
    // eslint-disable-next-line no-console
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, res) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${server.address().port}`);
});

// expose the app for testing
export default app;
