import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../index";
import constants from "../../helpers/constants";
import { user, token, post } from "../setups.test";
import { newArticle, newComment, fakeId } from "../helpers/testData";

chai.use(chaiHttp);

let token1;
let userId;
let username;
let slug;
let commentId;
let commentId2;
let notificationId;
const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = constants.statusCode;

describe("Notifications", () => {
  before(done => {
    token1 = token;
    ({ username } = user);
    ({ id: userId } = user);
    ({ slug } = post);
    done();
  });

  it("should test following a user ", done => {
    chai
      .request(app)
      .post(`/api/v1/profiles/${username}/follow`)
      .set("Authorization", `Bearer ${token1}`)
      .end(err => {
        if (err) done(err);
        done(err || undefined);
      });
  });

  it("should create an articles", done => {
    chai
      .request(app)
      .post(`/api/v1/articles`)
      .send(newArticle)
      .set(`Authorization`, `Bearer ${token1}`)
      .end((error, result) => {
        if (error) done(error);
        ({ slug } = result.body.article);
      });
    chai
      .request(app)
      .post(`/api/v1/articles`)
      .send(newArticle)
      .set(`Authorization`, `Bearer ${token1}`)
      .end((error, result) => {
        if (error) done(error);
        ({ slug } = result.body.article);
      });
    chai
      .request(app)
      .post(`/api/v1/articles`)
      .send(newArticle)
      .set(`Authorization`, `Bearer ${token1}`)
      .end((error, result) => {
        if (error) done(error);
        ({ slug } = result.body.article);
        done();
      });
  });
  it("should like an article", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/likes`)
      .set("Authorization", `Bearer ${token1}`)
      .end(error => {
        if (error) done(error);
        done();
      });
  });
  it("should create a comment", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/comments`)
      .send(newComment)
      .set(`Authorization`, `Bearer ${token1}`)
      .end((error, outcome) => {
        if (error) done(error);
        ({ id: commentId } = outcome.body.comment);
      });
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/comments`)
      .send(newComment)
      .set(`Authorization`, `Bearer ${token1}`)
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it("should create a comment", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/comments`)
      .send(newComment)
      .set(`Authorization`, `Bearer ${token1}`)
      .end((error, outcome) => {
        if (error) done(error);
        ({ id: commentId } = outcome.body.comment);
      });
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/comments`)
      .send(newComment)
      .set(`Authorization`, `Bearer ${token1}`)
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it("should like a comment with first user", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/comments/${commentId}/likes`)
      .set(`Authorization`, `Bearer ${token1}`)
      .end(error => {
        if (error) done(error);
        done();
      });
  });
  it("should like a comment with first user", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/comments/${commentId}/likes`)
      .set(`Authorization`, `Bearer ${token1}`)
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it("should test updating a profile", done => {
    chai
      .request(app)
      .put(`/api/v1/profiles/${username}`)
      .send({ profile: { allowNotifications: false } })
      .set({ Authorization: `Bearer ${token1}` })
      .end((error, result) => {
        if (error) done(error);
        result.body.profile.should.have.property("allowNotifications").eql(false);
        done();
      });
  });

  it("should create an articles", done => {
    chai
      .request(app)
      .post(`/api/v1/articles`)
      .send(newArticle)
      .set(`Authorization`, `Bearer ${token1}`)
      .end(error => {
        if (error) done(error);
        done();
      });
  });
  it("should create a comment", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/comments`)
      .send(newComment)
      .set(`Authorization`, `Bearer ${token1}`)
      .end((error, outcome) => {
        if (error) done(error);
        ({ id: commentId2 } = outcome.body.comment);
        done();
      });
  });
  it("should like a comment with first user", done => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/comments/${commentId2}/likes`)
      .set(`Authorization`, `Bearer ${token1}`)
      .end(error => {
        if (error) done(error);
        done();
      });
  });
  it("should fetch notifications for a user ", done => {
    chai
      .request(app)
      .get(`/api/v1/users/${userId}/notifications?page=hello`)
      .set("Authorization", `Bearer ${token1}`)
      .end((error, result) => {
        if (error) done(error);
        notificationId = result.body.user.notifications[0].id;
        expect(result.status).equals(OK);
        expect(result.body).to.haveOwnProperty("user");
        expect(result.body.user).to.haveOwnProperty("notifications");
        expect(result.body.user.notifications).to.be.a("array");
        done();
      });
  });

  it("should fetch notifications for a user ", done => {
    chai
      .request(app)
      .get(`/api/v1/users/${userId}/notifications?page=1`)
      .set("Authorization", `Bearer ${token1}`)
      .end((error, result) => {
        if (error) done(error);
        expect(result.status).equals(OK);
        expect(result.body).to.haveOwnProperty("user");
        expect(result.body.user).to.haveOwnProperty("notifications");
        expect(result.body.user.notifications).to.be.a("array");
        done();
      });
  });

  it("should fetch one notification", done => {
    chai
      .request(app)
      .get(`/api/v1/users/${userId}/notifications/${notificationId}`)
      .set("Authorization", `Bearer ${token1}`)
      .end((error, response) => {
        if (error) done(error);
        expect(response.status).equals(OK);
        expect(response.body.user).to.haveOwnProperty("notifications");
        expect(response.body.user.notifications[0]).to.be.a("object");
        expect(response.body.user.notifications[0]).to.haveOwnProperty("message");
        done();
      });
  });

  it("should return no notification found", done => {
    chai
      .request(app)
      .get(`/api/v1/users/${userId}/notifications/${fakeId}`)
      .set("Authorization", `Bearer ${token1}`)
      .end((error, response) => {
        if (error) done(error);
        expect(response.status).equals(NOT_FOUND);
        expect(response.body.message).equals("Not found");
        done(error);
      });
  });

  it("should return wrong id error", done => {
    chai
      .request(app)
      .get(`/api/v1/users/${userId}/notifications/${fakeId}s`)
      .set("Authorization", `Bearer ${token1}`)
      .end((error, response) => {
        if (error) done(error);
        expect(response.status).equals(BAD_REQUEST);
        expect(response.body.message).equals("Invalid request");
      });
    done();
  });

  it("should return unauthorized request", done => {
    chai
      .request(app)
      .get(`/api/v1/users/${userId}/notifications`)
      .set("Authorization", `Bearer ${token1}a`)
      .end((error, response) => {
        if (error) done(error);
        expect(response.status).equals(UNAUTHORIZED);
        expect(response.body.message).equals(
          "We are sorry but we are not able to authenticate you.You have to login to perform this action."
        );
        done();
      });
  });

  it("should return no user found", done => {
    chai
      .request(app)
      .get(`/api/v1/users/${fakeId}/notifications`)
      .set("Authorization", `Bearer ${token1}`)
      .end((error, response) => {
        if (error) done(error);
        expect(response.status).equals(NOT_FOUND);
        expect(response.body.message).equals("Not found");
        done();
      });
  });

  it("should delete one notification", done => {
    chai
      .request(app)
      .delete(`/api/v1/users/${userId}/notifications/${notificationId}`)
      .set("Authorization", `Bearer ${token1}`)
      .end((error, response) => {
        if (error) done(error);
        expect(response.status).equals(OK);
        expect(response.body.notification).equals(1);
        done();
      });
  });

  it("should return no notification found", done => {
    chai
      .request(app)
      .delete(`/api/v1/users/${userId}/notifications/${fakeId}`)
      .set("Authorization", `Bearer ${token1}`)
      .end((error, response) => {
        if (error) done(error);
        expect(response.status).equals(NOT_FOUND);
        expect(response.body.message).equals("Not found");
        done(error);
      });
  });
});
