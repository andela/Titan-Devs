import chaiHttp from "chai-http";
import chai, { expect, should } from "chai";
import app from "../../index";
import models from "../../models";
const { User } = models;

import { newArticle, user } from "../testData";
import constants from "../../helpers/constants";

let token;

const { UNAUTHORIZED, CREATED, BAD_REQUEST } = constants.statusCode;
chai.use(chaiHttp);
after("Destroy the database ", done => {
  try {
    const database = User.destroy({
      where: {},
      truncate: true,
      cascade: true
    });
    if (database) {
      done();
    }
  } catch (error) {
    done(error);
  }
});
before("Create a user and login to return a token", done => {
  const user = {
    email: "luc.bay@gmail.com",
    password: "password",
    username: "luc2018"
  };
  chai
    .request(app)
    .post("/api/v1/users")
    .send(user)
    .end((error, res) => {
      if (error) done(error.message);
      done();
    });
});
before("Create a user and login to return a token", done => {
  const user = {
    email: "luc.bay@gmail.com",
    password: "password"
  };
  chai
    .request(app)
    .post("/api/v1/users/login")
    .send(user)
    .end((error, res) => {
      if (error) done(error.message);
      token = res.body.token;
      done();
    });
});

describe("# Articles endpoints", () => {
  before("Create a user and login to return a token", done => {
    const user = {
      email: "luc.bay@gmail.com",
      password: "password",
      username: "luc2018"
    };
    chai
      .request(app)
      .post("/api/v1/users")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        done();
      });
  });
  before("Create a user and login to return a token", done => {
    const user = {
      email: "luc.bay@gmail.com",
      password: "password"
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        token = res.body.token;
        done();
      });
  });
  describe("POST /articles", () => {
    it("should create the article and return the success message", done => {
      chai
        .request(app)
        .post("/api/v1/articles")
        .set("Authorization", `Bearer ${token}`)
        .send(newArticle)
        .end((err, res) => {
          // console.log("=======>RESPONSE:", res);
          expect(res.status).equals(CREATED);
          expect(res.body.message).to.contain("Article created");
          done();
        });
    });
    it("should deny the request if no access-token provided", done => {
      chai
        .request(app)
        .post("/api/v1/articles")
        .send(newArticle)
        .end((err, res) => {
          expect(res.status).equals(UNAUTHORIZED);
          expect(res.body.message).to.contain("Access denied");
          done();
        });
    });

    it("should decline creating the article and return a bad-request error", done => {
      const { description, ...rest } = newArticle;
      chai
        .request(app)
        .post("/api/v1/articles")
        .set("Authorization", `Bearer ${token}`)
        .send(rest)
        .end((err, res) => {
          expect(res.status).equals(BAD_REQUEST);
          expect(res.body.message).to.contain('"description" is required');
          done();
        });
    });
  });
});
