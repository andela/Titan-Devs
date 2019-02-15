import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import errorhandler from "errorhandler";
import dotenv from "dotenv";
import methodOverride from "method-override";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import routers from "./routes";
import swaggerDocument from "./swagger.json";
import passport from "passport";
import passportConfig from "./middlewares/passport";

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
app.use(passport.initialize());
passportConfig(passport);

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1/", routers);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});

export default app;
