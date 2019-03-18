import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import { newArticle, users } from "../helpers/testData";
import constants from "../../helpers/constants";

let token;
let fakeToken;
let validSlug;

const { dummyUser } = users;
const { UNAUTHORIZED, CREATED, BAD_REQUEST, OK, NOT_FOUND } = constants.statusCode;

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
            if (!err) ({ token } = res.body);
            done(err || undefined);
          });
      }
    });
});

describe("# Articles endpoints", () => {
  describe("Create a new article", () => {
    it("should create the article and return the success message", done => {
      chai
        .request(app)
        .post("/api/v1/articles")
        .set("Authorization", `Bearer ${token}`)
        .send(newArticle)
        .end((err, res) => {
          validSlug = res.body.article.slug;
          expect(res.status).equals(CREATED);
          expect(res.body.message).to.contain("Article created");
          expect(res.body).to.haveOwnProperty("article");
          expect(res.body.article).to.haveOwnProperty("createdAt");
          expect(res.body.article).to.haveOwnProperty("title");
          expect(res.body.article.title).to.contain(newArticle.title);
          expect(res.body.article.readTime).equals(1);
          done();
        });
    });

    it("should deny the request if no access-token provided ", done => {
      chai
        .request(app)
        .post("/api/v1/articles")
        .send(newArticle)
        .end((err, res) => {
          expect(res.status).equals(UNAUTHORIZED);
          expect(res.body.message).to.contain("Please provide a token");
          done();
        });
    });

    it("should decline creating the article if no title provided", done => {
      const { title, ...rest } = newArticle;
      chai
        .request(app)
        .post("/api/v1/articles")
        .set("Authorization", `Bearer ${token}`)
        .send(rest)
        .end((err, res) => {
          expect(res.status).equals(BAD_REQUEST);
          expect(res.body.message).to.contain('"title" is required');
          done();
        });
    });

    it("should decline creating the article if no body provided", done => {
      const { body, ...rest } = newArticle;
      chai
        .request(app)
        .post("/api/v1/articles")
        .set("Authorization", `Bearer ${token}`)
        .send(rest)
        .end((err, res) => {
          expect(res.status).equals(BAD_REQUEST);
          expect(res.body.message).to.contain('"body" is required');
          done();
        });
    });

    it("should decline creating the article if no description provided", done => {
      const { description, ...rest } = newArticle;
      chai
        .request(app)
        .post("/api/v1/articles")
        .set("Authorization", `Bearer ${token}`)
        .send(rest)
        .end((err, res) => {
          expect(res.status).equals(BAD_REQUEST);
          expect(res.body.message).to.contain('"description" is required');
          done();
        });
    });

    it("should create an article with no tagsList", done => {
      const { tagsList, ...rest } = newArticle;
      chai
        .request(app)
        .post("/api/v1/articles")
        .set("Authorization", `Bearer ${token}`)
        .send(rest)
        .end((err, res) => {
          expect(res.status).equals(CREATED);
          expect(res.body.message).to.contain("Article created");
          expect(res.body).to.haveOwnProperty("article");
          expect(res.body.article).to.haveOwnProperty("createdAt");
          expect(res.body.article).to.haveOwnProperty("title");
          expect(res.body.article.title).to.contain(newArticle.title);
          done();
        });
    });
  });

  describe("Fetching all articles", () => {
    it("should return a list of all created articles", done => {
      chai
        .request(app)
        .get(`/api/v1/articles`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(OK);
          expect(res.body.message).to.contain("Successful");
          expect(res.body)
            .to.haveOwnProperty("articles")
            .to.be.an("array");
          expect(res.body)
            .to.haveOwnProperty("articlesCount")
            .to.be.a("number");
          res.body.articles.map(article => {
            expect(article).to.have.any.keys(
              "slug",
              "title",
              "description",
              "body",
              "tagsList",
              "favorited",
              "favoritesCount",
              "author"
            );
            expect(article.tagsList).to.be.an("array");
            expect(article.favoritesCount).to.be.a("number");
            expect(article.favorited).to.be.a("boolean");
            return expect(article.author)
              .to.be.an("object")
              .to.haveOwnProperty("username")
              .to.be.a("string");
          });
          done();
        });
    });

    it("should return a list of all created articles even when no token provided", done => {
      chai
        .request(app)
        .get(`/api/v1/articles`)
        .end((err, res) => {
          expect(res.status).equals(OK);
          expect(res.body.message).to.contain("Successful");
          expect(res.body)
            .to.haveOwnProperty("articles")
            .to.be.an("array");
          expect(res.body)
            .to.haveOwnProperty("articlesCount")
            .to.be.a("number");

          res.body.articles.map(article => {
            expect(article).to.have.any.keys(
              "slug",
              "title",
              "description",
              "body",
              "tagsList",
              "favorited",
              "favoritesCount",
              "author"
            );
            expect(article.tagsList).to.be.an("array");
            expect(article.favoritesCount).to.be.a("number");
            expect(article.favorited).to.be.a("boolean");
            return expect(article.author)
              .to.be.an("object")
              .to.haveOwnProperty("username")
              .to.be.a("string");
          });
          done();
        });
    });

    describe("Pagination (limit the number of articles to be returned)", () => {
      it("should return the exact number of articles specified by the limit param", done => {
        chai
          .request(app)
          .get(`/api/v1/articles?limit=2`)
          .end((err, res) => {
            expect(res.status).equals(OK);
            expect(res.body.message).to.contain("Successful");
            expect(res.body)
              .to.haveOwnProperty("articles")
              .to.be.an("array");
            expect(res.body)
              .to.haveOwnProperty("articlesCount")
              .to.be.a("number");
            expect(res.body.articles.length).to.equal(2);
            expect(res.body.articlesCount).to.equal(2);
            done();
          });
      });

      it("should return (x) articles for the first page, and y articles for the second page", done => {
        chai
          .request(app)
          .get(`/api/v1/articles?limit=1&page=1`)
          .end((err, page1) => {
            chai
              .request(app)
              .get(`/api/v1/articles?limit=2&page=2`)
              .end((error, page2) => {
                expect(page1.status).equals(OK);
                expect(page1.body.message).to.contain("Successful");
                expect(page1.body)
                  .to.haveOwnProperty("articles")
                  .to.be.an("array");
                expect(page1.body)
                  .to.haveOwnProperty("articlesCount")
                  .to.be.a("number");
                expect(page1.body.articles.length).to.equal(1);
                expect(page1.body.articlesCount).to.equal(1);
                expect(page2.status).equals(OK);
                expect(page2.body.message).to.contain("Successful");
                expect(page2.body)
                  .to.haveOwnProperty("articles")
                  .to.be.an("array");
                expect(page2.body)
                  .to.haveOwnProperty("articlesCount")
                  .to.be.a("number");
                expect(page2.body.articles.length).to.equal(2);
                expect(page2.body.articlesCount).to.equal(2);
                expect(page1.body.articles).not.to.equal(page2.body.articles);
                done();
              });
          });
      });
    });
  });

  describe("Updating and deleting a specific article", () => {
    before(done => {
      chai
        .request(app)
        .post("/api/v1/users")
        .send({
          email: "fake@email.com",
          username: "fake",
          password: "243hjgudsgdgh"
        })
        .end(error => {
          if (!error) {
            chai
              .request(app)
              .post("/api/v1/users/login")
              .send({ email: "fake@email.com", password: "243hjgudsgdgh" })
              .end((err, res) => {
                if (!err) fakeToken = res.body.token;
                done(err || undefined);
              });
          }
        });
    });
  });

  describe("Updating and deleting a specific article", () => {
    before(done => {
      chai
        .request(app)
        .post("/api/v1/users")
        .send({
          email: "fake@email.com",
          username: "fake",
          password: "243hjgudsgdgh"
        })
        .end(error => {
          if (!error) {
            chai
              .request(app)
              .post("/api/v1/users/login")
              .send({ email: "fake@email.com", password: "243hjgudsgdgh" })
              .end((err, res) => {
                if (!err) fakeToken = res.body.token;
                done(err || undefined);
              });
          }
        });
    });

    describe("Updating a specific article", () => {
      it("should add the new tags on an article", done => {
        chai
          .request(app)
          .put(`/api/v1/articles/${validSlug}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ tagsList: ["politics", "music", "love"] })
          .end((err, res) => {
            expect(res.status).equals(CREATED);
            expect(res.body.message).to.contain("Updated");
            expect(res.body)
              .to.haveOwnProperty("article")
              .to.be.an("object");
            done();
          });
      });

      it("should throw the error if the current user is not the author of that article", done => {
        chai
          .request(app)
          .put(`/api/v1/articles/${validSlug}`)
          .set("Authorization", `Bearer ${fakeToken}`)
          .end((err, res) => {
            expect(res.status).equals(UNAUTHORIZED);
            expect(res.body.message).to.contain(
              "You can only update the article you authored"
            );
            done();
          });
      });

      it("should throw the bad request error if the description is invalid", done => {
        chai
          .request(app)
          .put(`/api/v1/articles/${validSlug}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ description: "Love" })
          .end((err, res) => {
            expect(res.status).equals(BAD_REQUEST);
            expect(res.body.message).to.contain(
              '"description" length must be at least 10 characters long'
            );
            done();
          });
      });
    });

    describe("Deleting a specific article", () => {
      it("should throw the error if the current user is not the author of that article", done => {
        chai
          .request(app)
          .delete(`/api/v1/articles/${validSlug}`)
          .set("Authorization", `Bearer ${fakeToken}`)
          .end((err, res) => {
            expect(res.status).equals(UNAUTHORIZED);
            expect(res.body.message).to.contain(
              "You can only delete the article you authored"
            );
            done();
          });
      });

      it(`should throw an error if passed an invalid slug`, done => {
        chai
          .request(app)
          .delete(`/api/v1/articles/${validSlug}3`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            expect(res.status).equals(NOT_FOUND);
            expect(res.body.message).to.contain("article not found");
            done();
          });
      });

      it(`should delete the article with slug ${validSlug}`, done => {
        chai
          .request(app)
          .delete(`/api/v1/articles/${validSlug}`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            expect(res.status).equals(OK);
            expect(res.body.message).to.contain("Deleted");
            done();
          });
      });
    });
  });
});
