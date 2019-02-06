import express from "express";
import session from "express-session";
import cors from "cors";
import errorHandler from "errorhandler";
import morgan from "morgan";
import methodOverride from "method-override";
import routes from "./routes";

const isProduction = process.env.NODE_ENV === "production";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(methodOverride());

app.use(express.static(`${__dirname}/public`));
app.use(
  session({
    secret: "authorshaven",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (!isProduction) app.use(errorHandler());
app.use(routes);

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res) => {
    // eslint-disable-next-line no-console
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({ errors: { message: err.message, error: err } });
  });
}

// production error handler
// no stackTraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({ errors: { message: err.message, error: {} } });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${server.address().port}`);
});
