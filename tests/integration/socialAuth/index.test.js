import chai from "chai";
import { dummyProfileGoogle } from "../../helpers/socialAuthHelpers";
import createUserFromSocial from "../../../controllers/auth/socials/createUserFromSocial";

const { expect } = chai;

it("check if social login callback is workings", async () => {
  const user = await createUserFromSocial(dummyProfileGoogle);
  expect(user).to.not.be.equals(false);
  expect(user.email).to.be.eqls(dummyProfileGoogle.emails[0].value);
  expect(user.username).to.have.string(dummyProfileGoogle.username);
  expect(user.socialId).to.be.eqls(dummyProfileGoogle.id);
});
