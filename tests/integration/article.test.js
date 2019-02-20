import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import { newArticle, user } from "../helpers/testData";
import constants from "../../helpers/constants";

let token;
let validArticleId;
const { UNAUTHORIZED, CREATED, BAD_REQUEST, OK } = constants.statusCode;
chai.use(chaiHttp);

before(done => {
  const { email, password } = user;
  chai
    .request(app)
    .post("/api/v1/users")
    .send(user)
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
  describe("POST /articles", () => {
    it("should create the article and return the success message", done => {
      chai
        .request(app)
        .post("/api/v1/articles")
        .set("Authorization", `Bearer ${token}`)
        .send(newArticle)
        .end((err, res) => {
          validArticleId = res.body.article.id;
          expect(res.status).equals(CREATED);
          expect(res.body.message).to.contain("Article created");
          expect(res.body).to.haveOwnProperty("article");
          expect(res.body.article).to.haveOwnProperty("createdAt");
          expect(res.body.article).to.haveOwnProperty("title");
          expect(res.body.article.title).to.contain(newArticle.title);
          done();
        });
    });
    it("should deny the request if no access-token provided", done => {
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
});
describe("Share Articles endpoints", () => {
  it("should be ready to be posted on twitter", done => {
    chai
      .request(app)
      .get(`/api/v1/article/${validArticleId}/share/twitter`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).equals(OK);
        expect(res.body.message).to.contain("Article ready to be posted on twitter");
        done();
      });
  });
  it("should be ready to be posted on facebook", done => {
    chai
      .request(app)
      .get(`/api/v1/article/${validArticleId}/share/fb`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).equals(OK);
        expect(res.body.message).to.contain(
          "Article ready to be posted on facebook"
        );
        done();
      });
  });
  it("should be ready to be posted on facebook", done => {
    chai
      .request(app)
      .get(`/api/v1/article/${validArticleId}/share/linkedIn`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).equals(OK);
        expect(res.body.message).to.contain(
          "Article ready to be posted on linkedIn"
        );
        done();
      });
  });
  it("should be ready to be posted on email", done => {
    chai
      .request(app)
      .get(`/api/v1/article/${validArticleId}/share/email`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).equals(OK);
        expect(res.body.message).to.contain("Article ready to be posted on Email");
        done();
      });
  });
});
