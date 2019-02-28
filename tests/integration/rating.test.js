import dotenv from "dotenv";
import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import constants from "../../helpers/constants";
import app from "../../index";
import { user, post, token } from "../setups.test";

dotenv.config();
chai.use(chaiHttp);

const {
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  OK,
  UNAUTHORIZED,
  CONFLICT
} = constants.statusCode;

describe("All test related to rating ", () => {
  it("cannot rate if post id is invalid", done => {
    chai
      .request(app)
      .post(`/api/v1/article/espoir-slug-not-found/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 4 })
      .end((err, res) => {
        expect(res.status).to.be.eql(NOT_FOUND);
        expect(res.body.message).to.be.eql("Article was not found");
        done();
      });
  });
  it("cannot rate if rating is undefined", done => {
    chai
      .request(app)
      .post(`/api/v1/article/${post.slug}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: undefined })
      .end((err, res) => {
        expect(res.status).to.be.eql(BAD_REQUEST);
        expect(res.body.message).to.be.eql("Please provide a valid rating");
        done();
      });
  });
  it("cannot rate a post if there is no token", done => {
    chai
      .request(app)
      .post(`/api/v1/article/${post.slug}/rating`)
      .end((err, res) => {
        expect(res.status).equal(UNAUTHORIZED);
        expect(res.body.message).to.be.eql(
          "Please provide a token to perform this action"
        );
        done();
      });
  });
  it("cannot rate if post id is invalid ", done => {
    chai
      .request(app)
      .post(`/api/v1/article/espoir-slug-not-found/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 4 })
      .end((err, res) => {
        expect(res.status).to.be.eql(NOT_FOUND);
        expect(res.body.message).to.be.eql("Article was not found");
        done();
      });
  });
  it("cannot edit rating if post not found ", done => {
    chai
      .request(app)
      .put(`/api/v1/article/${post.slug}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 4 })
      .end((err, res) => {
        expect(res.status).to.be.eql(NOT_FOUND);
        expect(res.body.message).to.be.eql(
          "Rating  you are looking for cannot be found"
        );
        done();
      });
  });
  it("cannot rate if the rating is undefined", done => {
    chai
      .request(app)
      .post(`/api/v1/article/${post.slug}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: undefined })
      .end((err, res) => {
        expect(res.status).to.be.eql(BAD_REQUEST);
        expect(res.body.message).to.be.eql("Please provide a valid rating");
        done();
      });
  });
  it("cannot rate if the rating is less than 1 and more than 5", done => {
    chai
      .request(app)
      .post(`/api/v1/article/${post.slug}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ postId: post.id, rating: 10 })
      .end((err, res) => {
        expect(res.status).to.be.eql(BAD_REQUEST);
        expect(res.body.message).to.be.eql("Please provide a valid rating");
        done();
      });
  });

  it("cannot update rate if the rating is less than 1 and more than 5", done => {
    chai
      .request(app)
      .put(`/api/v1/article/${post.slug}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ postId: post.id, rating: 10 })
      .end((err, res) => {
        expect(res.status).to.be.eql(BAD_REQUEST);
        expect(res.body.message).to.be.eql("Please provide a valid rating");
        done();
      });
  });
  it("can rate", done => {
    chai
      .request(app)
      .post(`/api/v1/article/${post.slug}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: user.id, articleId: post.id, rating: 4 })
      .end((err, res) => {
        expect(res.status).to.be.eql(CREATED);
        expect(res.body.rating).to.not.be.an("undefined");
        expect(res.body.rating).to.have.all.keys([
          "id",
          "userId",
          "rating",
          "updatedAt",
          "createdAt",
          "articleId"
        ]);
        expect(res.body.rating.articleId).to.not.be.an("null");
        expect(res.body.message).to.be.eql("Article rated successfully");
        done();
      });
  });

  it("cannot  rate an article twice", done => {
    chai
      .request(app)
      .post(`/api/v1/article/${post.slug}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: user.id, articleId: post.id, rating: 3 })
      .end((err, res) => {
        expect(res.status).to.be.eql(CONFLICT);
        expect(res.body.message).to.be.eql("Cannot rate an article twice");
        done();
      });
  });
  it("can get all rating ", done => {
    chai
      .request(app)
      .get(`/api/v1/article/${post.slug}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(OK);
        expect(res.body).to.have.property("averageRating");
        expect(res.body)
          .to.have.property("ratings")
          .to.be.an("array");
        done();
      });
  });
  it("can edit rating ", done => {
    chai
      .request(app)
      .put(`/api/v1/article/${post.slug}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: user.id, articleId: post.id, rating: 2 })
      .end((err, res) => {
        expect(res.status).to.be.eql(OK);
        expect(res.body.message).to.be.eql("Article rating edited successfully");
        done();
      });
  });
});
