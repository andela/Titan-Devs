import chaiHttp from "chai-http";
import chai, { expect, should } from "chai";
import models from "../../models";
import app from "../../index";
import { newArticle, newComment } from "../helpers/testData";
import constants from "../../helpers/constants";

let token;
let slug;
let commentId;

const newUser = {
  email: "yves.iraguha@gmail.com",
  password: "password",
  username: "Nick2019"
};

const { User } = models;
const { UNAUTHORIZED, CREATED, BAD_REQUEST } = constants.statusCode;
chai.use(chaiHttp);

describe("Liking a comment", () => {
  const { email, password } = newUser;
  before("Create a user, article, and comment", done => {
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
                ({ token } = res.body);
                chai
                  .request(app)
                  .post("/api/v1/articles")
                  .set("Authorization", `Bearer ${token}`)
                  .send(newArticle)
                  .end((err, res) => {
                    const { slug: artSlug } = res.body.article;
                    slug = artSlug;
                    chai
                      .request(app)
                      .post(`/api/v1/articles/${slug}/comments`)
                      .set("Authorization", `Bearer ${token}`)
                      .send({ body: "hello there " })
                      .end((err, res) => {
                        if (!err) commentId = res.body.comment.id;
                        done(err || undefined);
                      });
                  });
              }
            });
        }
      });
  });

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
          expect(res.body.likeComment).to.haveOwnProperty("commentId");
          expect(res.body.likeComment).to.haveOwnProperty("createdAt");
          expect(res.body.likeComment).to.haveOwnProperty("userId");
          done();
        });
    });

    it("should unlike the comment and return the comment unliked message", done => {
      chai
        .request(app)
        .post(`/api/v1/articles/${slug}/comments/${commentId}/likes`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).equals(201);
          expect(res.body.message).to.contain("Comment unliked");
          done();
        });
    });
  });

  it("should throw an error of liking a non-existing", done => {
    chai
      .request(app)
      .post(
        `/api/v1/articles/${slug}/comments/192c2ff1-5622-419f-aa4b-6a4d7ad89dd4/likes`
      )
      .set("Authorization", `Bearer ${token}`)
      .end((error, res) => {
        if (error) done(error);
        expect(res.status).equals(400);
        expect(res.body.message).to.contain("You are liking a non-existing comment");
        done();
      });
  });

  it("should throw an unauthorized error", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/comments/${commentId}/likes`)
      .set("Authorization", `Bearer hellopeople`)
      .end((error, res) => {
        if (error) done(error);
        expect(res.status).equals(UNAUTHORIZED);
        expect(res.body.message).to.contain(
          "Please provide a token to perform this action"
        );
        done();
      });
  });

  it("should fetch all users who liked a comment in form of array", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${slug}/comments/${commentId}/likes`)
      .set("Authorization", `Bearer ${token}`)
      .end((error, res) => {
        if (error) done(error);
        expect(res.status).equals(200);
        expect(res.body.comment.likedBy).to.be.an("array");
        done();
      });
  });
});
