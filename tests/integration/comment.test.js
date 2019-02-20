import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import { newArticle, users, newComment } from "../helpers/testData";
import constants from "../../helpers/constants";

let token;
let slug;
const { dummyUser } = users;
const { UNAUTHORIZED, CREATED, BAD_REQUEST } = constants.statusCode;
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

describe("# Article's comments endpoints", () => {
  describe("Comment on an article", () => {
    it("should create the comment and return the success message", done => {
      chai
        .request(app)
        .post(`/api/v1/articles/${slug}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment)
        .end((err, res) => {
          console.log(res.body);
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
  });
});
