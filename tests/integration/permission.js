import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import { token } from "../setups.test";
import constants from "../../helpers/constants";
import { permission } from "../helpers/testData";

const { OK, BAD_REQUEST, CONFLICT } = constants.statusCode;
const { invalidPermission, validPermission } = permission;
// create new role
let roleId;
describe("create()", () => {
  describe("when valid information", () => {
    it("should create a permission", done => {
      chai
        .request(app)
        .post(`/api/v1/permission`)
        .set("Authorization", `Bearer ${token}`)
        .send(validPermission)
        .end((err, res) => {
          expect(res.status).equals(OK);
          done();
        });
    });
    it("should reply with conflict message", done => {
      chai
        .request(app)
        .post(`/api/v1/permission`)
        .set("Authorization", `Bearer ${token}`)
        .send(validPermission)
        .end((err, res) => {
          expect(res.status).equals(CONFLICT);
          expect(res.message).equals("permission already exist");
          done();
        });
    });
  });
  describe("when invalid information is given", () => {
    it("shouldn't create a permission", done => {
      chai
        .request(app)
        .post(`/api/v1/permission`)
        .set("Authorization", `Bearer ${token}`)
        .send(invalidPermission)
        .end((err, res) => {
          expect(res.status).equals(BAD_REQUEST);
          expect(res.message).equals("Name is required");
          done();
        });
    });
  });
  describe("createRolePermission()", () => {
    describe("when user and role is provided", () => {
      it("should create a user role", done => {
        chai
          .request(app)
          .post(`/api/v1/permission/${permissionId}/role/${roleId}`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            expect(res.status).equals(CREATED);
            done();
          });
      });
      it("should return a conflict message", () => {
        chai
          .request(app)
          .post(`/api/v1/permission/${permissionId}/role/${roleId}`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            expect(res.status).equals(CONFLICT);
            done();
          });
      });
    });
  });
  describe("getOnePermission()", () => {
    it("should get a permission", () => {
      chai
        .request(app)
        .post(`/api/v1/permission/${permissionId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(OK);
          done();
        });
    });
  });
});
