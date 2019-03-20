import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import models from "../../models";
import { token } from "../setups.test";
import constants from "../../helpers/constants";
import { permission, role, testUIID } from "../helpers/testData";

const {
  OK,
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR
} = constants.statusCode;
const { invalidPermission, validPermission, validPermission2 } = permission;
const { noAlphabeticRoleDesc, noAlphabeticRoleName } = role;
const { validRole } = role;
const { invalidUUID } = testUIID;
const { Role } = models;
let roleId, permissionId, rolePermissionId;
describe("permission", () => {
  describe("create()", () => {
    before(async () => {
      const role = await Role.create(validRole);
      roleId = role.id;
    });
    describe("when valid information", () => {
      it("should create a permission", done => {
        chai
          .request(app)
          .post(`/api/v1/permissions`)
          .set("Authorization", `Bearer ${token}`)
          .send(validPermission)
          .end((err, res) => {
            permissionId = res.body.permission.id;
            expect(res.status).equals(CREATED);
            done();
          });
      });
      it("should reply with conflict message", done => {
        chai
          .request(app)
          .post(`/api/v1/permissions`)
          .set("Authorization", `Bearer ${token}`)
          .send(validPermission)
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
          .post(`/api/v1/permissions`)
          .set("Authorization", `Bearer ${token}`)
          .send(invalidPermission)
          .end((err, res) => {
            expect(res.status).equals(BAD_REQUEST);
            expect(res.body.message).equals("Name is required");
            done();
          });
      });
      it("should return alphabetical validation - name", done => {
        chai
          .request(app)
          .post(`/api/v1/permissions`)
          .set("Authorization", `Bearer ${token}`)
          .send(noAlphabeticRoleName)
          .end((err, res) => {
            expect(res.status).equals(BAD_REQUEST);
            done();
          });
      });
      it("should return alphabetical validation - description", done => {
        chai
          .request(app)
          .post(`/api/v1/permissions`)
          .set("Authorization", `Bearer ${token}`)
          .send(noAlphabeticRoleDesc)
          .end((err, res) => {
            expect(res.status).equals(BAD_REQUEST);
            done();
          });
      });
    });
  });
  describe("grantPermission()", () => {
    describe("when user and role is provided", () => {
      it("should create a user role", done => {
        chai
          .request(app)
          .post(`/api/v1/permissions/${permissionId}/role/${roleId}`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            rolePermissionId = res.body.data.id;
            expect(res.status).equals(CREATED);
            done();
          });
      });
      it("should return a conflict message", done => {
        chai
          .request(app)
          .post(`/api/v1/permissions/${permissionId}/role/${roleId}`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            expect(res.status).equals(CONFLICT);
            done();
          });
      });
      it("should return return not found - role", done => {
        chai
          .request(app)
          .post(`/api/v1/permissions/${permissionId}/role/${invalidUUID}`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            expect(res.status).equals(NOT_FOUND);
            done();
          });
      });
      it("should return return not found - permission", done => {
        chai
          .request(app)
          .post(`/api/v1/permissions/${invalidUUID}/role/${roleId}`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            expect(res.status).equals(NOT_FOUND);
            done();
          });
      });
      it("should return internal server error", done => {
        chai
          .request(app)
          .post(`/api/v1/permissions/834098/role/94854`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            expect(res.status).equals(INTERNAL_SERVER_ERROR);
            done();
          });
      });
    });
  });
  describe("getOnePermission()", () => {
    it("should get a permission", done => {
      chai
        .request(app)
        .get(`/api/v1/permissions/${permissionId}`)
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

  describe("getRolePermissions()", () => {
    it("should return array of role permission", done => {
      chai
        .request(app)
        .get(`/api/v1/roles/${roleId}/permissions`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(OK);
          done();
        });
    });
    it("should return not found", done => {
      chai
        .request(app)
        .get(`/api/v1/roles/${invalidUUID}/permissions`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(NOT_FOUND);
          done();
        });
    });
    it("should return internal server error", done => {
      chai
        .request(app)
        .get(`/api/v1/roles/869594/permissions`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(INTERNAL_SERVER_ERROR);
          done();
        });
    });
  });
  describe("revokePermission()", () => {
    it("should internal server error", done => {
      chai
        .request(app)
        .delete(`/api/v1/permissions/${invalidUUID}/revoke`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(NOT_FOUND);
          done();
        });
    });
    it("should remove permission to a user", done => {
      chai
        .request(app)
        .delete(`/api/v1/permissions/${rolePermissionId}/revoke`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(OK);
          done();
        });
    });
    it("should remove permission to a user", done => {
      chai
        .request(app)
        .delete(`/api/v1/permissions/940385/revoke`)
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
        .put(`/api/v1/permissions/${permissionId}`)
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
        .put(`/api/v1/permissions/${permissionId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(validPermission2)
        .end((err, res) => {
          expect(res.status).equals(OK);
          done();
        });
    });
  });
  describe("deletePermission()", () => {
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
