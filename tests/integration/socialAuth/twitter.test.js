import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { mockRequest, mockResponse } from "mock-req-res";
import twitterController from "../../../controllers/auth/socials/twitterController";
import { userFound, dummyProfileTwitter } from "../../helpers/socialAuthHelpers";
import constants from "../../../helpers/constants";
import models from "../../../models";

const { INTERNAL_SERVER_ERROR } = constants.statusCode;
const { SERVER_ERROR } = constants.errorMessage;
const { expect } = chai;
const { User } = models;
chai.use(sinonChai);
describe("mocking social authentication with twitter", () => {
  const res = mockResponse();
  const req = mockRequest({ user: dummyProfileTwitter });
  it("should redirect a user to profile page with data", async () => {
    const stubFindOne = sinon.stub(User, "findOrCreate").returns([userFound]);
    await twitterController.twitterLogin(req, res);
    expect(res.redirect).to.have.been.calledWith(
      sinon.match(`/api/v1/profiles/${userFound.username}`)
    );
    sinon.assert.calledOnce(stubFindOne);
    stubFindOne.restore();
    res.redirect.resetHistory();
  });

  it("send an internal server error when an error occurs", async () => {
    const stubFindOne = sinon.stub(User, "findOrCreate").returns(false);
    await twitterController.twitterLogin(req, res);
    expect(res.json).to.have.been.calledWith(sinon.match({ message: SERVER_ERROR }));
    expect(res.status).to.have.been.calledWith(sinon.match(INTERNAL_SERVER_ERROR));
    res.status.resetHistory();
    res.json.resetHistory();
    stubFindOne.restore();
  });
});
