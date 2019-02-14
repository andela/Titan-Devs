import chai from "chai";
import { dummyUser } from "../../helpers/socialAuthHelpers";
import createUserFromSocial from "../../../controllers/auth/socials/createUserFromSocial";

const { expect } = chai;

it("check if social login callback is workings", async () => {
  const user = await createUserFromSocial(dummyUser);
  expect(user).to.not.be.equals(false);
  expect(user.email).to.be.eqls(dummyUser.emails[0].value);
  expect(user.username).to.have.string(dummyUser.username);
  expect(user.socialId).to.be.eqls(dummyUser.id);
});
