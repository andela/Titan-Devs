import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import { fakeId } from "../helpers/testData";
import constants from "../../helpers/constants";
import { token, post, newComment } from "../setups.test";

const { UNAUTHORIZED, CREATED, OK, NOT_FOUND } = constants.statusCode;
chai.use(chaiHttp);
describe("Liking a comment", () => {
  describe("POST /articles/:slug/comments/commentId", () => {
    it("should like the comment and return the comment liked message", done => {
      chai
        .request(app)
        .post(`/api/v1/articles/${post.slug}/comments/${newComment.id}/likes`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).equals(CREATED);
          expect(res.body.message).to.contain("Comment liked");
          expect(res.body.likeComment).to.haveOwnProperty("commentId");
          expect(res.body.likeComment).to.haveOwnProperty("createdAt");
          expect(res.body.likeComment).to.haveOwnProperty("userId");
          done();
        });
    });

    it("should unlike the comment and return the comment Disliked message", done => {
      chai
        .request(app)
        .post(`/api/v1/articles/${post.slug}/comments/${newComment.id}/likes`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).equals(CREATED);
          expect(res.body.message).to.contain("Comment Disliked");
          done();
        });
    });
  });

  it("should throw an error of liking a non-existing comment", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${post.slug}/comments/${fakeId}/likes`)
      .set("Authorization", `Bearer ${token}`)
      .end((error, res) => {

        if (error) done(error);
        expect(res.status).equals(NOT_FOUND);
        expect(res.body.message).to.contain("You are liking a non-existing comment");
        done();
      });
  });

  it("should throw an unauthorized error", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${post.slug}/comments/${newComment.id}/likes`)
      .set("Authorization", `Bearer hellopeople`)
      .end((error, res) => {
        if (error) done(error);
        expect(res.status).equals(UNAUTHORIZED);
        expect(res.body.message).to.contain(
          "We are sorry but we are not able to authenticate you.You have to login to perform this action."
        );
        done();
      });
  });

  it("should fetch all users who liked a comment in form of array", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${post.slug}/comments/${newComment.id}/likes`)
      .set("Authorization", `Bearer ${token}`)
      .end((error, res) => {
        if (error) done(error);
        expect(res.status).equals(OK);
        expect(res.body.comment.likes).to.be.an("array");
        done();
      });
  });

  it("should return error of non-existing comment", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${post.slug}/comments/${fakeId}/likes`)
      .set("Authorization", `Bearer ${token}`)
      .end((error, res) => {
        if (error) done(error);
        expect(res.status).equals(NOT_FOUND);
        expect(res.body.message).eql("There is no comment with that id");
        done();
      });
  });
});
