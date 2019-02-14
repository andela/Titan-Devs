import express from "express";
import session from "express-session";
import cors from "cors";
import errorhandler from "errorhandler";
import dotenv from "dotenv";
import passport from "passport";
import methodOverride from "method-override";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import restify from "restify";
import routers from "./routes";
import swaggerDocument from "./swagger.json";
import joiValidator from "./middlewares/joiValidator";
import passportConfig from "./middlewares/passport";
import constants from "./helpers/constants";

const { NOT_FOUND, INTERNAL_SERVER_ERROR } = constants.statusCode;

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

const app = express();
app.use(restify.plugins.queryParser({ mapParams: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(methodOverride());

app.use(express.static(`${__dirname}/public`));
app.use(passport.initialize());
passportConfig(passport);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());

if (!isProduction) {
  app.use(errorhandler());
}

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1", routers);
app.use(joiValidator());
app.use((req, resp, next) => {
  const err = new Error(
    "We are sorry we cannot find the page you are looking for , Please check the url and retry"
  );
  err.status = NOT_FOUND;
  next(err);
});

if (!isProduction) {
  // eslint-disable-next-line no-console
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || INTERNAL_SERVER_ERROR);

    res.json({
      message: err.message
    });
  });
}
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || INTERNAL_SERVER_ERROR);
  res.json({
    message: err.message
  });
});
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});

export default app;
