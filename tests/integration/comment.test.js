import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import { newArticle, users, newComment, fakeId } from "../helpers/testData";

import constants from "../../helpers/constants";

let token;
let slug;
let commentId;
const { dummyUser } = users;
const { UNAUTHORIZED, CREATED, BAD_REQUEST, OK, NOT_FOUND } = constants.statusCode;
chai.use(chaiHttp);

describe("Comment on an article", () => {
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
  it("should create the comment and return the success message", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send(newComment)
      .end((err, res) => {
        expect(res.status).equals(CREATED);
        expect(res.body.message).to.contain("Comment created");
        expect(res.body).to.haveOwnProperty("comment");
        expect(res.body.comment).to.haveOwnProperty("createdAt");
        expect(res.body.comment).to.haveOwnProperty("author");
        expect(res.body.comment.author).to.haveOwnProperty("username");
        expect(res.body.comment.author.username).to.contain(dummyUser.username);
        done();
      });
  });

  it("should deny the request if no access-token provided", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/comments`)
      .send(newComment)
      .end((err, res) => {
        expect(res.status).equals(UNAUTHORIZED);
        expect(res.body.message).to.contain(
          "We are sorry but we are not able to authenticate you.You have to login to perform this action."
        );
        done();
      });
  });

  it("should decline creating the article if no body provided", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .end((err, res) => {
        expect(res.status).equals(BAD_REQUEST);
        expect(res.body.message).to.contain('"body" is required');
        done();
      });
  });

  it("should decline creating the comment if provided other properties than {body}", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ ...newComment, name: "pacifique" })
      .end((err, res) => {
        expect(res.status).equals(BAD_REQUEST);
        expect(res.body.message).to.contain('"name" is not allowed');
        done();
      });
  });

  it("should decline creating the comment if article with provided slug doesn't exist", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}s/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send(newComment)
      .end((err, res) => {
        expect(res.status).equals(NOT_FOUND);
        expect(res.body.message).to.contain("The article with this slug");
        done();
      });
  });
  describe("Fetching comments", () => {
    it("should return all comments related to article", done => {
      chai
        .request(app)
        .get(`/api/v1/articles/${slug}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(OK);
          expect(res.body.article.comments).to.be.a("array");
          expect(res.body.article.comments[0]).to.haveOwnProperty("body");
          done();
        });
    });

    it("should return no article error", done => {
      chai
        .request(app)
        .get(`/api/v1/articles/${slug}s/comments`)
        .set("Authorization", `Bearer ${token}`)
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(NOT_FOUND);
          expect(res.body.message).equals("There is no article with that slug");
          done();
        });
    });

    it("should return a particular comment", done => {
      chai
        .request(app)
        .get(`/api/v1/articles/${slug}/comments/${commentId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(OK);
          expect(res.body.comment).to.be.a("object");
          expect(res.body.comment).to.haveOwnProperty("createdAt");
          expect(res.body.comment).to.haveOwnProperty("updatedAt");
          expect(res.body.comment).to.haveOwnProperty("body");
          expect(res.body.comment.body).equals(
            "I like this article however, You should rename the title"
          );
          done();
        });
    });

    it("should return a non-existing comment error", done => {
      chai
        .request(app)
        .get(`/api/v1/articles/${slug}/comments/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(NOT_FOUND);
          expect(res.body.message).to.contain("The comment does not exist");
          done();
        });
    });
  });

  describe("Updating a comment", () => {
    it("should return comment updated successfully", done => {
      chai
        .request(app)
        .put(`/api/v1/articles/${slug}/comments/${commentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ body: "Hello world" })
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(CREATED);
          expect(res.body.message).to.contain("Comment updated successfully");
          expect(res.body.comment).to.have.property("oldVersion");
          expect(res.body.comment).to.have.property("newVersion");
          done();
        });
    });
    it("should return invalid comment", done => {
      chai
        .request(app)
        .put(`/api/v1/articles/${slug}/comments/${commentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ body: " " })
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(BAD_REQUEST);
          expect(res.body.message).to.contain("body should not be empty");
          done();
        });
    });
    it("should return updating non-existing comment", done => {
      chai
        .request(app)
        .put(`/api/v1/articles/${slug}/comments/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ body: "Helllo world" })
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(NOT_FOUND);
          expect(res.body.message).to.contain("The comment does not exist");
          done();
        });
    });
    it("should return unauthorized request", done => {
      chai
        .request(app)
        .put(`/api/v1/articles/${slug}/comments/${commentId}`)
        .set("Authorization", `Bearer ${token}s`)
        .send({ body: "Hello world " })
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(UNAUTHORIZED);
          expect(res.body.message).to.contain(
            "Please provide a token to perform this action"
          );
          done();
        });
    });
  });
  describe("Deleting a comment", () => {
    it("should return comment deleted successfully", done => {
      chai
        .request(app)
        .delete(`/api/v1/articles/${slug}/comments/${commentId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(OK);
          expect(res.body.message).to.contain("Comment deleted successfully");
          expect(res.body.comment).to.have.property("deletedAt");
          done();
        });
    });
    it("should return deleting non-existing comment", done => {
      chai
        .request(app)
        .delete(`/api/v1/articles/${slug}/comments/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(NOT_FOUND);
          expect(res.body.message).to.contain("The comment does not exist");
          done();
        });
    });
    it("should return unauthorized request", done => {
      chai
        .request(app)
        .delete(`/api/v1/articles/${slug}/comments/${commentId}`)
        .set("Authorization", `Bearer ${token}s`)
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(UNAUTHORIZED);
          expect(res.body.message).to.contain(
            "Please provide a token to perform this action"
          );
          done();
        });
    });
  });
});
