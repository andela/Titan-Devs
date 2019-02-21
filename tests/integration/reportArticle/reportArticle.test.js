import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../../index";
import constants from "../../../helpers/constants";
import { token, validArticleId } from "../article.test";

const {
  UNAUTHORIZED,
  BAD_REQUEST,
  OK,
  INTERNAL_SERVER_ERROR
} = constants.statusCode;
chai.use(chaiHttp);

describe("", () => {
  it("should be report an article", done => {
    chai
      .request(app)
      .put(`/api/v1/articles/${validArticleId}/report`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "abusive" })
      .end((err, res) => {
        expect(res.status).equals(OK);
        expect(res.body.message).to.contain("Article reported");
        done();
      });
  });
  it("should should throw server error", done => {
    chai
      .request(app)
      .put(`/api/v1/articles/${validArticleId}/report`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "abusive" })
      .end((err, res) => {
        expect(res.status).equals(INTERNAL_SERVER_ERROR);
        done();
      });
  });
  it("should should ask for description", done => {
    chai
      .request(app)
      .put(`/api/v1/articles/${validArticleId}/report`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "" })
      .end((err, res) => {
        expect(res.status).equals(BAD_REQUEST);
        expect(res.body.message).to.contain("Please, give a reason");
        done();
      });
  });
  it("should deny the request if no access-token provided", done => {
    chai
      .request(app)
      .put(`/api/v1/articles/${validArticleId}/report`)
      .end((err, res) => {
        expect(res.status).equals(UNAUTHORIZED);
        done();
      });
  });
});
