import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import constants from "../../helpers/constants";
import { post, token } from "../setups.test";

const { UNAUTHORIZED, CREATED, NOT_FOUND, GONE } = constants.statusCode;
chai.use(chaiHttp);

describe("POST /articles/:slug/bookmark", () => {
  it("should bookmark the article and return the success message", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${post.slug}/bookmark`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).equals(CREATED);
        expect(res.body.message).to.contain("Article bookmarked");
        expect(res.body).to.haveOwnProperty("bookmark");
        expect(res.body.bookmark).to.be.an("object");
        expect(res.body.bookmark).to.haveOwnProperty("createdAt");
        expect(res.body.bookmark.articleId).equals(post.id);
        done();
      });
  });

  it("should deny bookmarking if no access-token provided", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${post.slug}/bookmark`)
      .end((err, res) => {
        expect(res.status).equals(UNAUTHORIZED);
        expect(res.body.message).to.contain("Please provide a token");
        done();
      });
  });

  it("should decline bookmarking the article which doesn't exist", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${post.slug}fs1/bookmark`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).equals(NOT_FOUND);
        expect(res.body.message).to.contain("The article with this slug");
        done();
      });
  });

  it("should delete the bookmark if it existed", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${post.slug}/bookmark`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).equals(GONE);
        expect(res.body.message).to.contain("Bookmark deleted");
        done();
      });
  });
});
