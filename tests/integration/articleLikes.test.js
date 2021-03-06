import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../index";
import constants from "../../helpers/constants";
import { token, post } from "../setups.test";

const { OK, CREATED, NOT_FOUND, UNAUTHORIZED } = constants.statusCode;
chai.use(chaiHttp);
describe("ArticleLike Controller", () => {
  describe("article fetch and like", () => {
    describe("Like", () => {
      it("should allow  user to like an article", done => {
        chai
          .request(app)
          .post(`/api/v1/articles/${post.slug}/likes`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, response) => {
            if (err) {
              return done(err);
            }
            expect(response.status).eql(CREATED);
            expect(response.body).to.an("object");
            expect(response.body).to.have.property("message");
            expect(response.body.message).to.be.eql("Successfully liked");

            done();
          });
      });

      it("should remove like when user try to like article twice", done => {
        chai
          .request(app)
          .post(`/api/v1/articles/${post.slug}/likes`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, response) => {
            if (err) {
              return done(err);
            }
            expect(response.status).eql(OK);
            expect(response.body).to.an("object");
            expect(response.body).to.have.property("message");
            expect(response.body.message).to.be.eql("Disliked successfully");

            done();
          });
      });

      it("should fail on non existing post.slug", done => {
        chai
          .request(app)
          .post(`/api/v1/articles/${post.slug}i97/likes`)
          .set({
            Authorization: `Bearer ${token}`
          })
          .end((err, response) => {
            if (err) {
              return done(err);
            }
            expect(response.status).eql(NOT_FOUND);
            expect(response.body).to.an("object");
            expect(response.body)
              .to.have.property("message")
              .eql("Article not found");
            done();
          });
      });

      it("should if user is not authenticated", done => {
        chai
          .request(app)
          .post(`/api/v1/articles/${post.slug}/likes`)
          .set({ Authorization: `Bear ${token}yi` })
          .end((err, response) => {
            if (err) {
              return done(err);
            }
            expect(response.status).eql(UNAUTHORIZED);
            done();
          });
      });
    });

    describe("Dislike", () => {
      it("should allow  user to dislike an article", done => {
        chai
          .request(app)
          .post(`/api/v1/articles/${post.slug}/dislikes`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, response) => {
            if (err) {
              return done(err);
            }
            expect(response.status).eql(CREATED);
            expect(response.body).to.an("object");
            expect(response.body).to.have.property("message");
            expect(response.body.message).to.be.eql("Successfully disliked");
            done();
          });
      });

      it("should remove dislike if user try to hit dislike twice", done => {
        chai
          .request(app)
          .post(`/api/v1/articles/${post.slug}/dislikes`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, response) => {
            if (err) {
              return done(err);
            }
            expect(response.status).eql(OK);
            expect(response.body).to.an("object");
            expect(response.body).to.have.property("message");
            expect(response.body.message).to.be.eql("Successfully removed dislike");
            done();
          });
      });

      it("should fail on non existing post.slug", done => {
        chai
          .request(app)
          .post(`/api/v1/articles/${post.slug}i97/dislikes`)
          .set({
            Authorization: `Bearer ${token}`
          })
          .end((err, response) => {
            if (err) {
              return done(err);
            }
            expect(response.status).eql(NOT_FOUND);
            expect(response.body).to.an("object");
            expect(response.body)
              .to.have.property("message")
              .eql("Article not found");
            done();
          });
      });

      it("should if user is not authenticated", done => {
        chai
          .request(app)
          .post(`/api/v1/articles/${post.slug}/dislikes`)
          .set({ Authorization: `Bear ${token}yi` })
          .end((err, response) => {
            if (err) {
              return done(err);
            }
            expect(response.status).eql(UNAUTHORIZED);
            done();
          });
      });
    });

    describe("Article likes fetch", () => {
      it("should retrieve article with likes", done => {
        chai
          .request(app)
          .get(`/api/v1/articles/${post.slug}/likes`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, response) => {
            if (err) {
              return done(err);
            }
            expect(response.status).eql(OK);
            expect(response.body).to.an("object");
            expect(response.body).to.have.property("article");
            expect(response.body.article).to.have.property("id");
            expect(response.body.article).to.have.property("title");
            expect(response.body.article).to.have.property("body");
            expect(response.body.article).to.have.property("likes");
            expect(response.body.article.likes)
              .to.be.an("array")
              .length(0);
            done();
          });
      });

      it("should return not found on non existing post.slug", done => {
        chai
          .request(app)
          .get(`/api/v1/articles/${post.slug}i97/likes`)
          .set({
            Authorization: `Bearer ${token}`
          })
          .end((err, response) => {
            if (err) {
              return done(err);
            }
            expect(response.status).eql(NOT_FOUND);
            expect(response.body).to.an("object");
            expect(response.body).to.have.property("message");
            expect(response.body.message).eql("Article not found");
            done();
          });
      });

      it("should if user is not authenticated", done => {
        chai
          .request(app)
          .get(`/api/v1/articles/${post.slug}/likes`)
          .set({ Authorization: `Bear ${token}lkajdf` })
          .end((err, response) => {
            if (err) {
              return done(err);
            }
            expect(response.status).eql(UNAUTHORIZED);
            done();
          });
      });
    });
  });
});
