import chaiHttp from "chai-http";
import chai, { expect, should } from "chai";
import app from "../../index";
import { newArticle, newUser, newComment } from "../testData";
import constants from "../../helpers/constants";

let token;
let slug;
let commentId;

const { UNAUTHORIZED, CREATED, BAD_REQUEST } = constants.statusCode;
chai.use(chaiHttp);

before(done => {
  const { email, password } = newUser;
  chai
    .request(app)
    .post("/api/v1/users")
    .send(newUser)
    .end((error, result) => {
      if (!error) {
        chai
          .request(app)
          .post("/api/v1/users/login")
          .send({ email, password })
          .end((err, res) => {
            if (!err) {
              token = res.body.token;
              chai
                .request(app)
                .post("/api/v1/articles")
                .set("Authorization", `Bearer ${token}`)
                .send(newArticle)
                .end((err, res) => {
                  if (!err) {
                  }
                  const { slug: artSlug } = res.body.article;
                  slug = artSlug;
                  chai
                    .request(app)
                    .post(`/api/v1/articles/${slug}/comments`)
                    .set("Authorization", `Bearer ${token}`)
                    .send({ body: "Hello people" })
                    .end((err, res) => {
                      if (!err) commentId = res.body.comment.id;
                      done(err ? err : undefined);
                    });
                });
            }
          });
      }
    });
});

describe("# Comment's liking endpoint", () => {
  describe("POST /articles/:slug/comments/:commentId", () => {
    it("should like the comment and return the comment liked message", done => {
      chai
        .request(app)
        .post(`/api/v1/articles/${slug}/comments/${commentId}/likes`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).equals(CREATED);
          expect(res.body.message).to.contain("Comment liked");
          expect(res.body).to.haveOwnProperty("commentId");
          expect(res.body.comment).to.haveOwnProperty("createdAt");
          expect(res.body.comment).to.haveOwnProperty("userId");
          done();
        });
    });
    it("should unlike the comment and return the comment unliked message", done => {
      chai
        .request(app)
        .post(`/api/v1/articles/${slug}/comments/${commentId}/likes`)
        .set("Authorization", `Bear ${token}`)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).equals(200);
          expect(res.body.message).to.contain("Comment unliked");
          expect(res.body.comment.likes).equals(0);
          done();
        });
    });
  });

  it("should throw an error of liking a non-exising", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/comments/agdhjadghahd/likes`)
      .set("Authorization", `Bearer ${token}`)
      .end((error, res) => {
        if (error) done(error);
        expect(res.status).equals(400);
        expect(res.body.message).to.contain("You are liking a non-existing comment");
        done();
      });
  });
  it("should throw an unauthorized error", done => {
    (token = "hahahdha"),
      chai
        .request(app)
        .post(`/api/v1/articles/${slug}/comments/${commendId}/likes`)
        .set("Authorization", `Bearer ${token}`)
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(401);
          expect(res.body.message).to.contain(
            "Please provide a token to perform this action"
          );
          done();
        });
  });
  it("should fetch all users who liked a comment in form of array", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${slag}/comments/${commentId}/likes`)
      .end((error, res) => {
        if (error) done(error);
        expect(res.status).equals(200);
        expect(res.body.likedBy).to.be.an("array");
        done();
      });
  });
});
