import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import { newArticle, users } from "../helpers/testData";
import constants from "../../helpers/constants";
import { token, post, post3, token3 } from "../setups.test";

chai.use(chaiHttp);
const { dummyUser } = users;
const { username } = dummyUser;
const { UNAUTHORIZED, CREATED, BAD_REQUEST, OK, NOT_FOUND } = constants.statusCode;
describe("# Articles endpoints", () => {
  describe("Create a new article", () => {
    it("should create the article and return the success message", done => {
      chai
        .request(app)
        .post("/api/v1/articles")
        .set("Authorization", `Bearer ${token}`)
        .send(newArticle)
        .end((err, res) => {
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
          expect(res.body.message).to.equals(
            "We are sorry but we are not able to authenticate you.You have to login to perform this action."
          );
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
  describe("Get a single article", () => {
    it("should allow unauthenticated user to read a specific article", done => {
      chai
        .request(app)
        .get(`/api/v1/articles/${post.slug}`)
        .end((err, res) => {
          expect(res.status).to.equal(OK);
          expect(res.body.article).to.have.any.keys(
            "slug",
            "title",
            "description",
            "body",
            "tagsList",
            "liked",
            "author"
          );
          expect(res.body.article.tagsList).to.be.an("array");
          expect(res.body.article.likesCount).to.be.a("number");
          expect(res.body.article.liked).to.be.a("boolean");
          return expect(res.body.article.author)
            .to.be.an("object")
            .to.haveOwnProperty("username")
            .to.be.a("string");
        });
      done();
    });

    it("should allow authenticated user to read a specific article", done => {
      chai
        .request(app)
        .get(`/api/v1/articles/${post.slug}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(OK);
          expect(res.body.article).to.have.any.keys(
            "slug",
            "title",
            "description",
            "body",
            "tagsList",
            "liked",
            "author"
          );
          expect(res.body.article.tagsList).to.be.an("array");
          expect(res.body.article.likesCount).to.be.a("number");
          expect(res.body.article.liked).to.be.a("boolean");
          return expect(res.body.article.author)
            .to.be.an("object")
            .to.haveOwnProperty("username")
            .to.be.a("string");
        });
      done();
    });

    it("should return a not found error when passed an invalid slug", done => {
      chai
        .request(app)
        .get(`/api/v1/articles/${post.slug}cdsg`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(NOT_FOUND);
          expect(res.body.message)
            .to.be.a("string")
            .contain("No article matching with");
        });
      done();
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
          expect(res.body.message).to.contain("successful");
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
              "liked",
              "likesCount",
              "author"
            );
            expect(article.tagsList).to.be.an("array");
            expect(article.likesCount).to.be.a("number");
            expect(article.liked).to.be.a("boolean");
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
          expect(res.body.message).to.contain("successful");
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
              "liked",
              "likesCount",
              "author"
            );
            expect(article.tagsList).to.be.an("array");
            expect(article.likesCount).to.be.a("number");
            expect(article.liked).to.be.a("boolean");
            return expect(article.author)
              .to.be.an("object")
              .to.haveOwnProperty("username")
              .to.be.a("string");
          });
          done();
        });

      describe("Pagination (limit the number of articles to be returned)", () => {
        it("should return the exact number of articles specified by the limit param", done => {
          chai
            .request(app)
            .get(`/api/v1/articles?limit=2`)
            .end((err, res) => {
              expect(res.status).equals(OK);
              expect(res.body.message).to.contain("successful");
              expect(res.body)
                .to.haveOwnProperty("articles")
                .to.be.an("array");
              expect(res.body)
                .to.haveOwnProperty("articlesCount")
                .to.be.a("number");
              expect(res.body.articles.length).not.to.be.greaterThan(2);
              expect(res.body.articlesCount).not.to.be.greaterThan(2);
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
                  expect(page1.body.message).to.contain("successful");
                  expect(page1.body)
                    .to.haveOwnProperty("articles")
                    .to.be.an("array");
                  expect(page1.body)
                    .to.haveOwnProperty("articlesCount")
                    .to.be.a("number");
                  expect(page1.body.articles.length).not.to.be.greaterThan(2);
                  expect(page1.body.articlesCount).not.to.be.greaterThan(2);
                  expect(page2.status).equals(OK);
                  expect(page2.body.message).to.contain("successful");
                  expect(page2.body)
                    .to.haveOwnProperty("articles")
                    .to.be.an("array");
                  expect(page2.body)
                    .to.haveOwnProperty("articlesCount")
                    .to.be.a("number");
                  expect(page2.body.articles.length).not.to.be.greaterThan(2);
                  expect(page2.body.articlesCount).not.to.be.greaterThan(2);
                  expect(page1.body.articles).not.to.equal(page2.body.articles);
                  done();
                });
            });
        });
      });
    });
    describe("Filtering (filter articles by [author, favorited, tag])", () => {
      it(`should only return the article authored by "${username}"`, done => {
        chai
          .request(app)
          .get(`/api/v1/articles?author=${username}`)
          .end((err, res) => {
            expect(res.status).equals(OK);
            expect(res.body.message).to.contain("successful");
            expect(res.body)
              .to.haveOwnProperty("articles")
              .to.be.an("array");
            expect(res.body)
              .to.haveOwnProperty("articlesCount")
              .to.be.a("number");
            res.body.articles.forEach(article =>
              expect(article.author.username).to.equal(username)
            );
            done();
          });
      });

      it(`should only return the article with " ${
        newArticle.tagsList[0]
      }" tag`, done => {
        chai
          .request(app)
          .get(`/api/v1/articles?tag=${newArticle.tagsList[0]}`)
          .end((err, res) => {
            expect(res.status).equals(OK);
            expect(res.body.message).to.contain("successful");
            expect(res.body)
              .to.haveOwnProperty("articles")
              .to.be.an("array");
            expect(res.body)
              .to.haveOwnProperty("articlesCount")
              .to.be.a("number");
            res.body.articles.forEach(article =>
              expect(article.tagsList).to.contain(newArticle.tagsList[0])
            );
            done();
          });
      });
    });

    it(`should only return the articles favorited by "${username}" user`, async () => {
      await chai
        .request(app)
        .post(`/api/v1/articles/${post.slug}/likes`)
        .set({ Authorization: `Bearer ${token}` });
      const response = await chai
        .request(app)
        .get(`/api/v1/articles?favorited=${username}`);
      expect(response.status).equals(OK);
      expect(response.body.message).to.contain("successful");
      expect(response.body)
        .to.haveOwnProperty("articles")
        .to.be.an("array");
      expect(response.body)
        .to.haveOwnProperty("articlesCount")
        .to.be.a("number");
      response.body.articles.forEach(article =>
        expect(article.likes.map(l => l.username)).to.include(username)
      );
    });

    it(`should only return the articles favorited by "${username}" user`, async () => {
      await chai
        .request(app)
        .post(`/api/v1/articles/${post.slug}/likes`)
        .set({ Authorization: `Bearer ${token}` });
      const response = await chai
        .request(app)
        .get(`/api/v1/articles?favorited=${username}`);
      expect(response.status).equals(OK);
      expect(response.body.message).to.contain("successful");
      expect(response.body)
        .to.haveOwnProperty("articles")
        .to.be.an("array");
      expect(response.body)
        .to.haveOwnProperty("articlesCount")
        .to.be.a("number");
      response.body.articles.forEach(article => {
        expect(article.tagsList).to.contain(newArticle.tagsList[0]);
        expect(article.author.username).to.equal(username);
        expect(article.likes.map(l => l.username)).to.include(username);
      });
    });

    it(`should only return the articles authored by "${username}", favorited by "${username}", and tagged "${
      newArticle.tagsList[0]
    }" tag`, done => {
      chai
        .request(app)
        .get(
          `/api/v1/articles?author=${username}&favorited=${username}&tag=${
            newArticle.tagsList[0]
          }`
        )
        .end((err, response) => {
          expect(response.status).equals(OK);
          expect(response.body.message).to.contain("successful");
          expect(response.body)
            .to.haveOwnProperty("articles")
            .to.be.an("array");
          expect(response.body)
            .to.haveOwnProperty("articlesCount")
            .to.be.a("number");
          response.body.articles.forEach(article => {
            expect(article.tagsList).to.contain(newArticle.tagsList[0]);
            expect(article.author.username).to.equal(username);
            expect(article.likes).to.include(username);
          });
          done();
        });
    });
  });

  describe("Updating and deleting a specific article", () => {
    describe("Updating a specific article", () => {
      it("should add the new tags on an article", done => {
        chai
          .request(app)
          .put(`/api/v1/articles/${post.slug}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ tagsList: ["politics", "music", "love"] })
          .end((err, res) => {
            expect(res.status).equals(CREATED);
            expect(res.body.message).to.contain("updated");
            expect(res.body)
              .to.haveOwnProperty("article")
              .to.be.an("object");
            done();
          });
      });

      it("should throw the error if the current user is not the author of that article", done => {
        chai
          .request(app)
          .put(`/api/v1/articles/${post.slug}`)
          .set("Authorization", `Bearer ${token3}`)
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
          .put(`/api/v1/articles/${post.slug}`)
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
          .delete(`/api/v1/articles/${post.slug}`)
          .set("Authorization", `Bearer ${token3}`)
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
          .delete(`/api/v1/articles/${post.slug}3`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            expect(res.status).equals(NOT_FOUND);
            expect(res.body.message).contains("article not found");
            done();
          });
      });

      it(`should delete the article with slug`, done => {
        chai
          .request(app)
          .delete(`/api/v1/articles/${post3.slug}`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            expect(res.status).equals(OK);
            expect(res.body.message).to.contain("deleted");
            done();
          });
      });
    });
  });
});
