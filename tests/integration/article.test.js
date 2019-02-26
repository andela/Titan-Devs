import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import { newArticle, users } from "../helpers/testData";
import constants from "../../helpers/constants";

let token;

const { dummyUser } = users;
const { UNAUTHORIZED, CREATED, BAD_REQUEST } = constants.statusCode;
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
  });
  describe("Report an article endpoint", () => {
    it("should be report an article", done => {
      chai
        .request(app)
        .put(`/api/v1/articles/${validSlug}/report`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "abusive" })
        .end((err, res) => {
          expect(res.status).equals(OK);
          expect(res.body.message).to.contain("Article reported");
          done();
        });
    });
    it("should report an article", done => {
      chai
        .request(app)
        .put(`/api/v1/articles/${validSlug}/report`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "abusive" })
        .end((err, res) => {
          expect(res.status).equals(CONFLICT);
          expect(res.body.message).to.contain("Article already reported");
          done();
        });
    });
    it("should should ask for description", done => {
      chai
        .request(app)
        .put(`/api/v1/articles/${validSlug}/report`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "" })
        .end((err, res) => {
          expect(res.status).equals(BAD_REQUEST);
          expect(res.body.message).to.contain("Please, give a reason");
          done();
        });
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
