import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import { post, token } from "../setups.test";
import constants from "../../helpers/constants";

const { BAD_REQUEST, OK, CONFLICT } = constants.statusCode;

chai.use(chaiHttp);
describe("Report an article endpoint", () => {
  it("should be report an article", done => {
    chai
      .request(app)
      .put(`/api/v1/articles/${post.slug}/report`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "abusive" })
      .end((err, res) => {
        expect(res.status).equals(OK);
        expect(res.body.message).to.contain("reported");
        done();
      });
  });
  it("should report an article", done => {
    chai
      .request(app)
      .put(`/api/v1/articles/${post.slug}/report`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "abusive" })
      .end((err, res) => {
        expect(res.status).equals(CONFLICT);
        expect(res.body.message).to.contain("Article already reported");
        done();
      });
  });
  it("should should ask for description", done => {
    chai
      .request(app)
      .put(`/api/v1/articles/${post.slug}/report`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "" })
      .end((err, res) => {
        expect(res.status).equals(BAD_REQUEST);
        expect(res.body.message).to.contain("Please, give a reason");
        done();
      });
  });
});
