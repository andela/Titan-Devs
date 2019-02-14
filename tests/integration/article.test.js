import chaiHttp from "chai-http";
import chai, { expect, should } from "chai";
import app from "../../index";
import { newArticle, user } from "../testData";
import constants from "../../helpers/constants";

let token;

const { UNAUTHORIZED, CREATED, BAD_REQUEST } = constants.statusCode;
chai.use(chaiHttp);

before(done => {
  const { email, password } = user;
  chai
    .request(app)
    .post("/api/v1/users")
    .send(user)
    .end((error, result) => {
      if (!error) {
        chai
          .request(app)
          .post("/api/v1/users/login")
          .send({ email, password })
          .end((err, res) => {
            if (!err) token = res.body.token;
            done(err ? err : undefined);
          });
      }
    });
});

describe("# Articles endpoints", () => {
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
