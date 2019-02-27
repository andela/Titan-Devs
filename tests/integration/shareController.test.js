import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import { post, token } from "../setups.test";
import constants from "../../helpers/constants";

const { OK } = constants.statusCode;
chai.use(chaiHttp);

chai.use(chaiHttp);
describe("Share Articles endpoints", () => {
  it("should be ready to be posted on twitter", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${post.slug}/share/twitter`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).equals(OK);
        expect(res.body.message).to.contain("Article ready to be posted on twitter");
        expect(res.body.response.spawnfile).to.equal("open");
        done();
      });
  });
  it("should be ready to be posted on facebook", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${post.slug}/share/fb`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).equals(OK);
        expect(res.body.message).to.contain(
          "Article ready to be posted on facebook"
        );
        expect(res.body.response.spawnfile).to.equal("open");
        done();
      });
  });
  it("should be ready to be posted on linkedIn", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${post.slug}/share/linkedIn`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).equals(OK);
        expect(res.body.message).to.contain(
          "Article ready to be posted on linkedIn"
        );
        expect(res.body.response.spawnfile).to.equal("open");
        done();
      });
  });
  it("should be ready to be posted on email", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${post.slug}/share/email`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).equals(OK);
        expect(res.body.message).to.contain("Article ready to be posted on Email");
        expect(res.body.response.spawnfile).to.equal("open");
        done();
      });
  });
});
