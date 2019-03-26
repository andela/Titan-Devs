import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import { newArticle, users, newComment, fakeId } from "../helpers/testData";

import constants from "../../helpers/constants";

let token;
let slug;
let commentId;
const { dummyUser } = users;
const { UNAUTHORIZED, OK, CREATED, NOT_FOUND } = constants.statusCode;
const { UNAUTHORIZED_MESSAGE } = constants.errorMessage;
chai.use(chaiHttp);

describe("Creating history of a comment", () => {
  before(done => {
    const { email, password } = dummyUser;
    chai
      .request(app)
      .post("/api/v1/users")
      .send(dummyUser)
      .end(error => {
        if (!error) {
          chai
            .request(app)
            .post("/api/v1/users/login")
            .send({ email, password })
            .end((err, res) => {
              if (!err) {
                const { token: accessToken } = res.body;
                token = accessToken;
                chai
                  .request(app)
                  .post("/api/v1/articles")
                  .set("Authorization", `Bearer ${token}`)
                  .send(newArticle)
                  .end((err, res) => {
                    if (error) done(error);
                    const { slug: artSlug } = res.body.article;
                    slug = artSlug;
                    chai
                      .request(app)
                      .post(`/api/v1/articles/${slug}/comments`)
                      .set("Authorization", `Bearer ${token}`)
                      .send(newComment)
                      .end((er, res) => {
                        if (!er) {
                          commentId = res.body.comment.id;
                        }

                        done(er || undefined);
                      });
                  });
              }
            });
        }
      });
  });
  it("should return a history created", done => {
    chai
      .request(app)
      .put(`/api/v1/articles/${slug}/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ body: "Hello world" })
      .end((error, history) => {
        if (error) done(error);
        expect(history.status).equals(CREATED);
        expect(history.body.comment).to.be.an("object");
        expect(history.body.comment.commentId).equals(commentId);
        expect(history.body.comment).to.haveOwnProperty("updatedAt");
        expect(history.body.comment).to.haveOwnProperty("oldVersion");
        expect(history.body.comment).to.haveOwnProperty("newVersion");
        done();
      });
  });
  it("should return an array containing different versions", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${slug}/comments/${commentId}/history`)
      .set("Authorization", `Bearer ${token}`)
      .end((error, history) => {
        if (error) done(error);
        expect(history.status).equals(OK);
        expect(history.body.comment.commentHistory).to.be.an("array");
        expect(history.body.comment.commentHistory[0]).to.haveOwnProperty(
          "createdAt"
        );
        expect(history.body.comment.commentHistory[0]).to.haveOwnProperty(
          "oldVersion"
        );
        expect(history.body.comment.commentHistory[0]).to.haveOwnProperty(
          "newVersion"
        );
        done();
      });
  });
  it("should return fetching history of non-existing comment", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${slug}/comments/${fakeId}/history`)
      .set("Authorization", `Bearer ${token}`)
      .end((error, history) => {
        if (error) done(error);
        expect(history.status).equals(NOT_FOUND);
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
        expect(history.status).equals(UNAUTHORIZED);
        expect(history.body.message).equals(UNAUTHORIZED_MESSAGE);
        done();
      });
  });
});
