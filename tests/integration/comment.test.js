import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import { newArticle, users, newComment } from "../helpers/testData";

import constants from "../../helpers/constants";

let token;
let slug;
const commentId = "hello world";
const { dummyUser } = users;
const { UNAUTHORIZED, CREATED, BAD_REQUEST, OK } = constants.statusCode;
chai.use(chaiHttp);

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
                  const { slug: artSlug } = res.body.article;
                  slug = artSlug;
                  done(err || undefined);
                });
            }
          });
      }
    });
});

describe("Comment on an article", () => {
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
        expect(res.body.message).to.contain("Please provide a token");
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
        expect(res.status).equals(BAD_REQUEST);
        expect(res.body.message).to.contain("The article with this slug");
        done();
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
          expect(res.body.comment).to.have.property("body");
          expect(res.body.comment.body).equals("Hello world");
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
          expect(res.body.message).to.contain("'body' should not be empty");
          done();
        });
    });
    it("should return updating non-existing comment", done => {
      chai
        .request(app)
        .put(`/api/v1/articles/${slug}/comments/${commentId}s`)
        .set("Authorization", `Bearer ${token}`)
        .send({ body: "Helllo world" })
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(BAD_REQUEST);
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
          expect(res.body.message).to.contain("Permission denied");
          done();
        });
    });
    it("should return editing for others error", done => {
      chai
        .request(app)
        .put(`/api/v1/articles/${slug}/comments/${commentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ body: "Hello world " })
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(UNAUTHORIZED);
          expect(res.body.message).to.contain("Permission denied");
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
        .delete(`/api/v1/articles/${slug}/comments/${commentId}s`)
        .send({ body: "Helllo world" })
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(BAD_REQUEST);
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
          expect(res.body.message).to.contain("Permission denied");
          done();
        });
    });
    it("should return deleting for others error", done => {
      chai
        .request(app)
        .post(`/api/v1/articles/${slug}/comments/${commentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ body: "Hello world " })
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(UNAUTHORIZED);
          expect(res.body.message).to.contain("Permission denied");
          done();
        });
    });
  });
  describe("Fetching comments", () => {
    it("should return all comments related to article", done => {
      chai
        .request(app)
        .get(`/api/v1/articles/${slug}/comments`)
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(OK);
          expect(res.body.comments).to.be.a("array");
          expect(res.body.comments.length).equals(2);
          done();
        });
    });
    it("should return a particular comment", done => {
      chai
        .request(app)
        .get(`/api/v1/articles/${slug}/comments/${commentId}`)
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(OK);
          expect(res.body.comment).to.be.a("object");
          expect(res.body.comment).to.haveOwnProperty("createdAt");
          expect(res.body.comment).to.haveOwnProperty("updatedAt");
          expect(res.body.comment).to.haveOwnProperty("body");
          expect(res.body.comment.body).equals("This article needs improvement");
          done();
        });
    });
    it("should return a non-existing comment error", done => {
      chai
        .request(app)
        .get(`/api/v1/articles/${slug}/comments/${commentId}s`)
        .end((error, res) => {
          if (error) done(error);
          expect(res.status).equals(BAD_REQUEST);
          expect(res.body.message).to.contain("The comment does not exist");
          done();
        });
    });
  });
});
