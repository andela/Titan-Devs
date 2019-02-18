import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import models from "../models";
import app from "../index";
import { article, data } from "../helpers/data";
chai.use(chaiHttp);
const { dummyUser } = data;
describe("ArticleLike Controller", () => {
  let articleSlug;
  let token;
  before(done => {
    chai
      .request(app)
      .post("/api/v1/articles")
      .send({ ...article })
      .end((err, response) => {
        if (err) {
          return done(err);
        }
        articleSlug = response.body.article.slug;
        done();
      });
  });

  describe("Like", () => {
    it("should allow  user to like an article", async () => {
      chai
        .request(app)
        .post(`/api/v1/articles/${articleSlug}/likes`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, response) => {
          if (err) {
            return done(err);
          }
          expect(response.status).eql(201);
          expect(response.body).to.an("object");
          expect(response.body).to.have.property("message");
          expect(response.body.message).to.be.eql("Article liked");
          done();
        });
    });
    it("should fail on non existing slug", done => {
      chai
        .request(app)
        .post(`/api/v1/articles/${articleSlug}i97` / likes)
        .set({
          Authorization: `Bearer ${token}`
        })
        .end((err, response) => {
          if (err) {
            return done(err);
          }
          expect(response.status).eql(404);
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
        .post(`/api/v1/articles/${articleSlug}/likes`)
        .set({ Authorization: `Bear ${token}yi` })
        .end((err, response) => {
          if (err) {
            return done(err);
          }
          expect(response.status).eql(401);
        });
    });
  });

  describe("Unlike", () => {
    it("should allow  user to unlike an article", async () => {
      chai
        .request(app)
        .delete(`/api/v1/articles/${articleSlug}/likes`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, response) => {
          if (err) {
            return done(err);
          }
          expect(response.status).eql(201);
          expect(response.body).to.an("object");
          expect(response.body).to.have.property("message");
          expect(response.body.message).to.be.eql("Article unlike successfully");
          done();
        });
    });
    it("should fail on non existing slug", done => {
      chai
        .request(app)
        .delete(`/api/v1/articles/${articleSlug}i97` / likes)
        .set({
          Authorization: `Bearer ${token}`
        })
        .end((err, response) => {
          if (err) {
            return done(err);
          }
          expect(response.status).eql(404);
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
        .delete(`/api/v1/articles/${articleSlug}/likes`)
        .set({ Authorization: `Bear ${token}yi` })
        .end((err, response) => {
          if (err) {
            return done(err);
          }
          expect(response.status).eql(401);
        });
    });
  });
  describe("Unlike", () => {
    it("should allow  user to unlike an article", async () => {
      chai
        .request(app)
        .get(`/api/v1/articles/${articleSlug}/likes`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, response) => {
          if (err) {
            return done(err);
          }
          expect(response.status).eql(201);
          expect(response.body).to.an("object");
          expect(response.body).to.have.property("id");
          expect(response.body).to.have.property("title");
          expect(response.body).to.have.property("body");
          expect(response.body).to.have.property("likes");
          expect(response.body.likes)
            .to.be.an("array")
            .length(0);
          done();
        });
    });
    it("should fail on non existing slug", done => {
      chai
        .request(app)
        .get(`/api/v1/articles/${articleSlug}i97` / likes)
        .set({
          Authorization: `Bearer ${token}`
        })
        .end((err, response) => {
          if (err) {
            return done(err);
          }
          expect(response.status).eql(404);
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
        .get(`/api/v1/articles/${articleSlug}/likes`)
        .set({ Authorization: `Bear ${token}yi` })
        .end((err, response) => {
          if (err) {
            return done(err);
          }
          expect(response.status).eql(401);
        });
    });
  });
});
