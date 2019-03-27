import chai from "chai";
import sinon from "sinon";
import models from "../../../models";
import sinonChai from "sinon-chai";
import { mockRequest, mockResponse } from "mock-req-res";
import twitterController from "../../../controllers/auth/socials/twitterController";
import { userFound, dummyProfileTwitter } from "../../helpers/socialAuthHelpers";

const { expect } = chai;
const { User } = models;
chai.use(sinonChai);
describe("mocking social authentication with twitter", () => {
  it("should redirect a user to profile page with data", async () => {
    const res = mockResponse();
    const req = mockRequest({ user: dummyProfileTwitter });
    const stubFindOne = sinon.stub(User, "findOrCreate").returns([userFound]);
    await twitterController.twitterLogin(req, res);
    expect(res.redirect).to.have.been.calledWith(
      sinon.match(`/api/v1/profiles/${userFound.username}`)
    );
    sinon.assert.calledOnce(stubFindOne);
    stubFindOne.restore();
    res.redirect.resetHistory();
  });
});
