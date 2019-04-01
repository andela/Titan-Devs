import chai, { expect } from "chai";
import app from "../../index";
import { token, permission, newRole } from "../setups.test";
import constants from "../../helpers/constants";
import {
  permissionObjects,
  testUIID,
  invalidPermissionObject
} from "../helpers/testData";

const {
  OK,
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CREATED
} = constants.statusCode;
const [, , , , , validPermission6] = permissionObjects;
const { invalidPermission, invalidPermission2 } = invalidPermissionObject;
const { invalidUUID } = testUIID;
let permissionId;
describe("permission", () => {
  describe("grantPermission()", () => {
    describe("when valid information", () => {
      it("should create a permission", done => {
        chai
          .request(app)
          .post(`/api/v1/permissions/${newRole.id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ resource: "testd" })
          .end((err, res) => {
            permissionId = res.body.permission.id;
            expect(res.status).equals(CREATED);
            done();
          });
      });
      it("should reply with conflict message", done => {
        chai
          .request(app)
          .post(`/api/v1/permissions/${newRole.id}`)
          .set("Authorization", `Bearer ${token}`)
          .send(validPermission6)
          .end((err, res) => {
            expect(res.status).equals(CONFLICT);
            expect(res.body.message).equals("Permission already exist");
            done();
          });
      });
    });
    describe("when invalid information is given", () => {
      it("shouldn't create a permission", done => {
        chai
          .request(app)
          .post(`/api/v1/permissions/${newRole.id}`)
          .set("Authorization", `Bearer ${token}`)
          .send(invalidPermission)
          .end((err, res) => {
            expect(res.status).equals(BAD_REQUEST);
            expect(res.body.message).equals("Resource is required");
            done();
          });
      });
      it("should return alphabetical validation - resource", done => {
        chai
          .request(app)
          .post(`/api/v1/permissions/${newRole.id}`)
          .set("Authorization", `Bearer ${token}`)
          .send(invalidPermission2)
          .end((err, res) => {
            expect(res.status).equals(BAD_REQUEST);
            done();
          });
      });
    });
  });
  describe("getOnePermission()", () => {
    it("should get a permission", done => {
      chai
        .request(app)
        .get(`/api/v1/permissions/${permission[0].id}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(OK);
          done();
        });
    });
    it("should return not found", done => {
      chai
        .request(app)
        .get(`/api/v1/permissions/${invalidUUID}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(NOT_FOUND);
          done();
        });
    });
    it("should internal server error", done => {
      chai
        .request(app)
        .get(`/api/v1/permissions/9483`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(INTERNAL_SERVER_ERROR);
          done();
        });
    });
  });
  describe("updatePermission()", () => {
    it("should return not found", done => {
      chai
        .request(app)
        .put(`/api/v1/permissions/${invalidUUID}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(NOT_FOUND);
          done();
        });
    });
    it("should return internal server error", done => {
      chai
        .request(app)
        .put(`/api/v1/permissions/0458394`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(INTERNAL_SERVER_ERROR);
          done();
        });
    });
    it("should update permission", done => {
      chai
        .request(app)
        .put(`/api/v1/permissions/${permission[0].id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .end((err, res) => {
          expect(res.status).equals(BAD_REQUEST);
          done();
        });
    });
    it("should update permission", done => {
      chai
        .request(app)
        .put(`/api/v1/permissions/${permission[0].id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ resource: "user" })
        .end((err, res) => {
          expect(res.status).equals(OK);
          done();
        });
    });
  });
  describe("revokePermission()", () => {
    it("should delete permission", done => {
      chai
        .request(app)
        .delete(`/api/v1/permissions/${permissionId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(OK);
          done();
        });
    });
    it("should return internal server error", done => {
      chai
        .request(app)
        .delete(`/api/v1/permissions/940385`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(INTERNAL_SERVER_ERROR);
          done();
        });
    });
    it("should return not found", done => {
      chai
        .request(app)
        .delete(`/api/v1/permissions/${invalidUUID}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(NOT_FOUND);
          done();
        });
    });
  });
  describe("getAll()", () => {
    it("should return permission object", done => {
      chai
        .request(app)
        .get(`/api/v1/permissions`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(OK);
          done();
        });
    });
  });
});
