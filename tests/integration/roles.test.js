import chai, { expect } from "chai";
import app from "../../index";
import { token, newRole, user, newRole2 } from "../setups.test";
import constants from "../../helpers/constants";
import { roleTestData, testUIID } from "../helpers/testData";

const {
  OK,
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} = constants.statusCode;
const {
  invalidRole,
  validRole2,
  validRoleAdmin,
  noAlphabeticRoleDesc,
  noAlphabeticRoleName
} = roleTestData;
const { invalidUUID } = testUIID;
describe("role", () => {
  describe("create()", () => {
    describe("when valid information is given", () => {
      it("should create a role", done => {
        chai
          .request(app)
          .post(`/api/v1/roles`)
          .set("Authorization", `Bearer ${token}`)
          .send(validRoleAdmin)
          .end((err, res) => {
            expect(res.status).equals(CREATED);
            done();
          });
      });
      it("should reply with conflict message", done => {
        chai
          .request(app)
          .post(`/api/v1/roles`)
          .set("Authorization", `Bearer ${token}`)
          .send(validRoleAdmin)
          .end((err, res) => {
            expect(res.status).equals(CONFLICT);
            done();
          });
      });
    });
    describe("when invalid information is given", () => {
      it("shouldn't create a role", done => {
        chai
          .request(app)
          .post(`/api/v1/roles`)
          .set("Authorization", `Bearer ${token}`)
          .send(invalidRole)
          .end((err, res) => {
            expect(res.status).equals(BAD_REQUEST);
            done();
          });
      });
      it("should return alphabetic characters validation on role name", done => {
        chai
          .request(app)
          .post(`/api/v1/roles`)
          .set("Authorization", `Bearer ${token}`)
          .send(noAlphabeticRoleName)
          .end((err, res) => {
            expect(res.status).equals(BAD_REQUEST);
            done();
          });
      });
      it("should return alphabetic characters validation on role description", done => {
        chai
          .request(app)
          .post(`/api/v1/roles`)
          .set("Authorization", `Bearer ${token}`)
          .send(noAlphabeticRoleDesc)
          .end((err, res) => {
            expect(res.status).equals(BAD_REQUEST);
            done();
          });
      });
    });
  });
  describe("getOneRole()", () => {
    it("should return not found", done => {
      chai
        .request(app)
        .get(`/api/v1/roles/${invalidUUID}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(NOT_FOUND);
          done();
        });
    });
    it("should return internal server error", done => {
      chai
        .request(app)
        .get(`/api/v1/roles/09583`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(INTERNAL_SERVER_ERROR);
          done();
        });
    });
  });
  describe("getAll()", () => {
    it("should get array of roles", done => {
      chai
        .request(app)
        .get(`/api/v1/roles`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(OK);
          done();
        });
    });
  });
  describe("updateRole()", () => {
    it("should return role not found", done => {
      chai
        .request(app)
        .put(`/api/v1/roles/${invalidUUID}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(NOT_FOUND);
          done();
        });
    });
    it("should return internal server error", done => {
      chai
        .request(app)
        .put(`/api/v1/roles/94887573`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(INTERNAL_SERVER_ERROR);
          done();
        });
    });
    it("should return name is required", done => {
      chai
        .request(app)
        .put(`/api/v1/roles/${newRole.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .end((err, res) => {
          expect(res.status).equals(BAD_REQUEST);
          done();
        });
    });
    it("should return alphabetical validation error - name", done => {
      chai
        .request(app)
        .put(`/api/v1/roles/${newRole.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(noAlphabeticRoleName)
        .end((err, res) => {
          expect(res.status).equals(BAD_REQUEST);
          expect(res.body.message).equals(
            `{${noAlphabeticRoleName.name}} and {${
              noAlphabeticRoleName.description
            }} can only be alphabetic characters`
          );
          done();
        });
    });
    it("should return alphabetical validation error - description", done => {
      chai
        .request(app)
        .put(`/api/v1/roles/${newRole.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ noAlphabeticRoleDesc })
        .end((err, res) => {
          expect(res.status).equals(BAD_REQUEST);
          done();
        });
    });
    it("should update role object", done => {
      chai
        .request(app)
        .put(`/api/v1/roles/${newRole.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(validRole2)
        .end((err, res) => {
          expect(res.status).equals(OK);
          done();
        });
    });
  });
  describe("getRolePermissions()", () => {
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
    it("should return list of permission found", done => {
      chai
        .request(app)
        .get(`/api/v1/roles/${newRole.id}/permissions`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(OK);
          done();
        });
    });
  });
  describe("assignRole()", () => {
    it("should assign role", done => {
      chai
        .request(app)
        .put(`/api/v1/users/${user.username}/roles/${newRole.id}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(OK);
          done();
        });
    });
  });
  describe("deleteRole()", () => {
    it("should delete role", done => {
      chai
        .request(app)
        .delete(`/api/v1/roles/${newRole2.id}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(OK);
          done();
        });
    });
    it("should return not found", done => {
      chai
        .request(app)
        .delete(`/api/v1/roles/${invalidUUID}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(NOT_FOUND);
          done();
        });
    });
    it("should return internal validation error", done => {
      chai
        .request(app)
        .delete(`/api/v1/roles/KJ099593`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(INTERNAL_SERVER_ERROR);
          done();
        });
    });
  });
});
