import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import { newArticle, users } from "../helpers/testData";

import constants from "../../helpers/constants";

let token;

const { dummyUser } = users;
const {
  UNAUTHORIZED,
  CREATED,
  BAD_REQUEST,
  OK,
  NOT_FOUND,
  GONE,
  INTERNAL_SERVER_ERROR
} = constants.statusCode;
let validSlug;
chai.use(chaiHttp);

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
  let createdArticle;
  describe("Create a new article", () => {
    it("should create the article and return the success message", done => {
      chai
        .request(app)
        .post("/api/v1/articles")
        .set("Authorization", `Bearer ${token}`)
        .send(newArticle)
        .end((err, res) => {
          createdArticle = res.body;
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
    it("should be report an article", done => {
      chai
        .request(app)
        .put(`/api/v1/article/${validSlug}/report`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "abusive" })
        .end((err, res) => {
          expect(res.status).equals(OK);
          expect(res.body.message).to.contain("Article reported");
          done();
        });
    });
    it("should should throw server error", done => {
      chai
        .request(app)
        .put(`/api/v1/article/${validSlug}/report`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "abusive" })
        .end((err, res) => {
          expect(res.status).equals(INTERNAL_SERVER_ERROR);
          done();
        });
    });
    it("should should ask for description", done => {
      chai
        .request(app)
        .put(`/api/v1/article/${validSlug}/report`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "" })
        .end((err, res) => {
          expect(res.status).equals(BAD_REQUEST);
          expect(res.body.message).to.contain("Please, give a reason");
          done();
        });
    });
    it("should deny the request if no access-token provided", done => {
      chai
        .request(app)
        .put(`/api/v1/article/${validSlug}/report`)
        .end((err, res) => {
          expect(res.status).equals(UNAUTHORIZED);
          done();
        });
    });
    it("should report an article", done => {
      chai
        .request(app)
        .put(`/api/v1/articles/${validArticleId}/report`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "abusive" })
        .end((err, res) => {
          expect(res.status).equals(OK);
          expect(res.body.message).to.contain("Article reported");
          done();
        });
    });
    it("should should throw server error", done => {
      chai
        .request(app)
        .put(`/api/v1/articles/${validArticleId}/report`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "abusive" })
        .end((err, res) => {
          console.log(res.body, "======================okay");
          expect(res.status).equals(INTERNAL_SERVER_ERROR);
          done();
        });
    });
    it("should should ask for description", done => {
      chai
        .request(app)
        .put(`/api/v1/articles/${validArticleId}/report`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "" })
        .end((err, res) => {
          expect(res.status).equals(BAD_REQUEST);
          expect(res.body.message).to.contain("Please, give a reason");
          done();
        });
    });
    it("should deny the request if no access-token provided", done => {
      chai
        .request(app)
        .put(`/api/v1/articles/${validArticleId}/report`)
        .end((err, res) => {
          expect(res.status).equals(UNAUTHORIZED);
          done();
        });
    });
  });

  describe("POST /articles/:slug/bookmark", () => {
    it("should bookmark the article and return the success message", done => {
      const { article } = createdArticle;
      chai
        .request(app)
        .post(`/api/v1/articles/${article.slug}/bookmark`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(CREATED);
          expect(res.body.message).to.contain("Article bookmarked");
          expect(res.body).to.haveOwnProperty("bookmark");
          expect(res.body.bookmark).to.be.an("object");
          expect(res.body.bookmark).to.haveOwnProperty("createdAt");
          expect(res.body.bookmark.articleId).equals(article.id);
          done();
        });
    });

    it("should deny bookmarking if no access-token provided", done => {
      const { article } = createdArticle;
      chai
        .request(app)
        .post(`/api/v1/articles/${article.slug}/bookmark`)
        .end((err, res) => {
          expect(res.status).equals(UNAUTHORIZED);
          expect(res.body.message).to.contain("Please provide a token");
          done();
        });
    });

    it("should decline bookmarking the article which doesn't exist", done => {
      const { article } = createdArticle;
      chai
        .request(app)
        .post(`/api/v1/articles/${article.slug}fs1/bookmark`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(NOT_FOUND);
          expect(res.body.message).to.contain("The article with this slug");
          done();
        });
    });

    it("should delete the bookmark if it existed", done => {
      const { article } = createdArticle;
      chai
        .request(app)
        .post(`/api/v1/articles/${article.slug}/bookmark`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(GONE);
          expect(res.body.message).to.contain("Bookmark deleted");
          done();
        });
    });
  });
});
describe("Share Articles endpoints", () => {
  it("should be ready to be posted on twitter", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${validSlug}/share/twitter`)
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
      .get(`/api/v1/articles/${validSlug}/share/fb`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).equals(OK);
        expect(res.body.message).to.contain(
          "Article ready to be posted on facebook"
        );
        done();
      });
  });
  it("should be ready to be posted on linkedIn", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${validSlug}/share/linkedIn`)
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
      .get(`/api/v1/articles/${validSlug}/share/email`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).equals(OK);
        expect(res.body.message).to.contain("Article ready to be posted on Email");
        done();
      });
  });
});
