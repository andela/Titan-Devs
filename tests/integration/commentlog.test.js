import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import models from "../../models";
import app from "../../index";

import constants from "../../helpers/constants";

chai.use(chaiHttp);
const commentId = "hello world";
const slug = "hello world";
const token = "";
const fakeToken = "";
const { Commentlog } = models;

const { OK, CREATED, BAD_REQUEST, UNAUTHORIZED } = constants;

describe("Fetching history of a comment", () => {
  it("should return an array containing different versions", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${slug}/comments/${commentId}/history`)
      .set("Authorization", `Bearer ${token}`)
      .end((error, history) => {
        if (error) done(error);
        expect(history.body.status).equals(OK);
        expect(history.body.commentHistory).to.be.a("array");
        expect(history.body.commentHistory[0].commentId).equals(commentId);
        expect(history.body.commentHistory[0]).to.haveOwnProperty("updatedAt");
        expect(history.body.commentHistory[0]).to.haveOwnProperty(
          "previous_version"
        );
        expect(history.body.commentHistory[0]).to.haveOwnProperty("new_version");
        done();
      });
  });
  it("should return fetching history of non-existing comment", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${slug}/comments/${commentId}s/history`)
      .set("Authorization", `Bearer ${token}`)
      .end((error, history) => {
        if (error) done(error);
        expect(history.body.status).equals(BAD_REQUEST);
        expect(history.body.message).equals("The comment doesn't exist");
        done();
      });
  });
  it("should return unauthorized request (wrong token)", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${slug}/comments/${commentId}/history`)
      .set("Authorization", `Bearer ${token}s`)
      .end((error, history) => {
        if (error) done(error);
        expect(history.body.status).equals(UNAUTHORIZED);
        expect(history.body.message).equals("Access denied");
        done();
      });
  });
  it("should return unauthorized request (correct token)", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${slug}/comments/${commentId}/history`)
      .set("Authorization", `Bearer ${fakeToken}`)
      .end((error, history) => {
        if (error) done(error);
        expect(history.body.status).equals(UNAUTHORIZED);
        expect(history.body.message).equals("Access denied");
        done();
      });
  });
});

describe("Creating history of a comment", () => {
  it("should return a history created", done => {
    chai
      .request(app)
      .put(`/api/v1/articles/${slug}/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ body: "Hello world" })
      .end((error, res) => {
        if (error) done(error);
        Commentlog.findOne({ where: { id: commentId } }).then((err, history) => {
          if (err) done(err);
          expect(res.body.status).equals(OK);
          expect(history.body.commentHistory).to.be.a("array");
          expect(history.body.commentHistory[0].commentId).equals(commentId);
          expect(history.body.commentHistory[0]).to.haveOwnProperty("updatedAt");
          expect(history.body.commentHistory[0]).to.haveOwnProperty(
            "previous_version"
          );
          expect(history.body.commentHistory[0]).to.haveOwnProperty("new_version");
          done();
        });
      });
  });
});
