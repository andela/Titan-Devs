import dotenv from "dotenv";
import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import constants from "../../helpers/constants";
import app from "../../index";
import { user, post, token } from "../setups.test";

dotenv.config();
chai.use(chaiHttp);

const { CREATED, NOT_FOUND, BAD_REQUEST, OK, UNAUTHORIZED } = constants.statusCode;
let highlight;

describe(" create highlight tests", () => {
  it("cannot highlight if not logged in ", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${post.slug}/highlights`)
      .end((err, res) => {
        if (!err) {
          expect(res.status).to.be.eql(UNAUTHORIZED);
          expect(res.body.message).to.be.eql(
            "We are sorry but we are not able to authenticate you.You have to login to perform this action."
          );
          done();
        } else {
          done(err);
        }
      });
  });
  it("cannot highlight if article does not exist", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/slug-not-found-article/highlights`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (!err) {
          expect(res.status).to.be.eql(NOT_FOUND);
          expect(res.body.message).to.be.eql(
            "We are sorry we cannot find the article you are looking for , Please check the id and retry"
          );
          done();
        } else {
          done(err);
        }
      });
  });

  it("cannot highlight if the start index is not an integer", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${post.slug}/highlights?start=espoir&end=3`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (!err) {
          expect(res.status).to.be.eql(BAD_REQUEST);
          expect(res.body.message).to.be.eql("Please provide a valid start index");
          done();
        } else {
          done(err);
        }
      });
  });

  it("cannot highlight if the end index is not an integer", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${post.slug}/highlights?start=3&end=espoir`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (!err) {
          expect(res.status).to.be.eql(BAD_REQUEST);
          expect(res.body.message).to.be.eql("Please provide a valid end index");
          done();
        } else {
          done(err);
        }
      });
  });

  it("cannot highlight if the end index is less than the start index", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${post.slug}/highlights?start=3&end=2`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (!err) {
          expect(res.status).to.be.eql(BAD_REQUEST);
          expect(res.body.message).to.be.eql("Please provide a valid end index");
          done();
        } else {
          done(err);
        }
      });
  });

  it("cannot highlight if we can't find the portion in article body", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${post.slug}/highlights?start=3&end=1000000000`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (!err) {
          expect(res.status).to.be.eql(BAD_REQUEST);
          expect(res.body.message).to.be.eql("Please provide a valid end index");
          done();
        } else {
          done(err);
        }
      });
  });

  it("can highlight", done => {
    const startIndex = 2;
    const endIndex = 5;
    chai
      .request(app)
      .post(
        `/api/v1/articles/${
          post.slug
        }/highlights?start=${startIndex}&end=${endIndex}`
      )
      .set("Authorization", `Bearer ${token}`)
      .send({ comment: "this is a comment on an article" })
      .end((err, res) => {
        if (!err) {
          expect(res.status).to.be.eql(CREATED);
          expect(res.body.message).to.be.eql(
            "The article has successfully been highlighted"
          );
          expect(res.body).to.haveOwnProperty("highlight");
          expect(res.body.highlight).to.have.all.keys([
            "id",
            "userId",
            "startIndex",
            "endIndex",
            "createdAt",
            "deletedAt",
            "articleId",
            "updatedAt",
            "commentId",
            "comment",
            "highlightedText"
          ]);
          expect(res.body.highlight.startIndex).to.be.eqls(startIndex);
          expect(res.body.highlight.endIndex).to.be.eqls(endIndex);
          if (res.body.highlight.comment) {
            expect(res.body.highlight.comment).to.be.an("object");
          }
          // eslint-disable-next-line prefer-destructuring
          highlight = res.body.highlight;
          expect(res.body.highlight.highlightedText).to.not.equal(null);
          expect(res.body.highlight.highlightedText.length).to.be.equal(
            endIndex - startIndex
          );
          done();
        } else {
          done(err);
        }
      });
  });
});

describe("edit highlight tests", () => {
  it("Should update an entry of highlight and comment on an Article", done => {
    chai
      .request(app)
      .put(`/api/v1/articles/${post.slug}/highlights/${highlight.id}?start=3&end=10`)
      .set("Authorization", `Bearer ${token}`)
      .send({ comment: "Testing highlight" })
      .end((err, res) => {
        if (!err) {
          expect(res).to.have.status(OK);
          expect(res.body).to.haveOwnProperty("highlight");
          expect(res.body.message).to.eql(
            "Your highlight has been updated successfully"
          );
          expect(res.body.highlight.highlightedText).to.not.equal(null);
          done();
        } else {
          done(err);
        }
      });
  });

  it("Should return error when no article Id", done => {
    chai
      .request(app)
      .put(`/api/v1/articles/ /highlights/${highlight.id}?start=3&end=10`)
      .set("Authorization", `Bearer ${token}`)
      .send({ comment: "Testing highlight" })
      .end((err, res) => {
        if (!err) {
          expect(res).to.have.status(NOT_FOUND);
          expect(res.body.message).to.eql(
            "We are sorry we cannot find the article you are looking for , Please check the id and retry"
          );
          done();
        } else {
          done(err);
        }
      });
  });

  it("Should return error when no highlight Id", done => {
    chai
      .request(app)
      .put(`/api/v1/articles/${post.slug}/highlights/ ?start=3&end=10`)
      .set("Authorization", `Bearer ${token}`)
      .send({ comment: "Testing highlight" })
      .end((err, res) => {
        if (!err) {
          expect(res).to.have.status(BAD_REQUEST);
          expect(res.body.message).to.eql("Please provide a valid highlight id");
          done();
        } else {
          done(err);
        }
      });
  });

  it("Should return error when if cannot find highlight id", done => {
    chai
      .request(app)
      .put(
        `/api/v1/articles/${
          post.slug
        }/highlights/00000000-000d-0d00-a0bb-0a0000000b00?start=3&end=10`
      )
      .set("Authorization", `Bearer ${token}`)
      .send({ comment: "Testing highlight" })
      .end((err, res) => {
        if (!err) {
          expect(res).to.have.status(NOT_FOUND);
          expect(res.body.message).to.eql(
            "The highlight you are looking for cannot be found"
          );
          done();
        } else {
          done(err);
        }
      });
  });
});

describe("can get highlight test", () => {
  it("should return not found if cannot find by highlight", done => {
    chai
      .request(app)
      .get(
        `/api/v1/articles/${
          post.slug
        }/highlights/00000000-000d-0d00-a0bb-0a0000000b00`
      )
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (!err) {
          expect(res).to.have.status(NOT_FOUND);
          expect(res.body.message).to.eql(
            "The highlight you are looking for cannot be found"
          );
          done();
        } else {
          done(err);
        }
      });
  });

  it("should return a highlight if the id is correct", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${post.slug}/highlights/${highlight.id}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (!err) {
          expect(res).to.have.status(OK);
          expect(res.body.message).to.eql("The highlight has been retrieved");
          expect(res.body).to.haveOwnProperty("highlight");
          expect(res.body.highlight).to.have.all.keys([
            "id",
            "startIndex",
            "endIndex",
            "createdAt",
            "updatedAt",
            "comment"
          ]);
          done();
        } else {
          done(err);
        }
      });
  });

  it("should return all the highlights", done => {
    chai
      .request(app)
      .get(`/api/v1/articles/${post.slug}/highlights`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (!err) {
          expect(res).to.have.status(OK);
          expect(res.body.message).to.eql("The highlights have been retrieved");
          expect(res.body)
            .to.have.property("highlights")
            .to.be.an("array");
          if (res.body.highlights) {
            res.body.highlights.map(aHighlight =>
              expect(aHighlight.userId).to.be.eql(user.id)
            );
          }
          done();
        } else {
          done(err);
        }
      });
  });
});

describe("can delete a highlight test ", () => {
  it("cannot delete if invalid highlight Id", done => {
    chai
      .request(app)
      .delete(
        `/api/v1/articles/${
          post.slug
        }/highlights/00000000-000d-0d00-a0bb-0a0000000b00`
      )
      .set("Authorization", `Bearer ${token}`)
      .send({ comment: "Testing highlight" })
      .end((err, res) => {
        if (!err) {
          expect(res).to.have.status(NOT_FOUND);
          expect(res.body.message).to.eql(
            "The highlight you are looking for cannot be found"
          );
          done();
        } else {
          done(err);
        }
      });
  });

  it("can delete", done => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${post.slug}/highlights/${highlight.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ comment: "Testing highlight" })
      .end((err, res) => {
        if (!err) {
          expect(res).to.have.status(OK);
          expect(res.body).to.haveOwnProperty("highlight");
          expect(res.body.message).to.eql("Your highlight has been deleted");
          done();
        } else {
          done(err);
        }
      });
  });
});
