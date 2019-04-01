import { expect } from "chai";
import { isEmpty, isEmailValid } from "../../helpers/funcValidators";

describe("isEmpty function validator", () => {
  it("It should return true for empty variables", () => {
    const text = undefined;
    const number = null;
    let name;
    const lastName = "";
    const errors = {};
    expect(isEmpty(number)).eql(true);
    expect(isEmpty(name)).eql(true);
    expect(isEmpty(lastName)).eql(true);
    expect(isEmpty(errors)).eql(true);
    expect(isEmpty(text)).eql(true);
  });

  it("It should return false for non empty variable", () => {
    const name = "Luc";
    const number = 8;
    const lastName = "Jean Luc";
    const errors = {
      email: "Email is required"
    };
    expect(isEmpty(name)).eql(false);
    expect(isEmpty(number)).eql(false);
    expect(isEmpty(lastName)).eql(false);
    expect(isEmpty(errors)).eql(false);
  });
});

describe("Function for checking valid email", () => {
  it("It should return true for valid email", () => {
    const emails = [
      "something@something.com",
      "something@something.com",
      `27846@example.com`
    ];
    expect(isEmailValid(emails[0])).eql(true);
    expect(isEmailValid(emails[1])).eql(true);
    expect(isEmailValid(emails[2])).eql(true);
  });
  it("It should return false for invalid email", () => {
    const emails = [
      "someone@127.0.0.1",
      "wo..oly@example.com",
      `test@@gmail.come.com`,
      `test@@gmail.com.com`,
      `test  @gmail.com`
    ];
    expect(isEmailValid(emails[0])).eql(false);
    expect(isEmailValid(emails[1])).eql(false);
    expect(isEmailValid(emails[2])).eql(false);
    expect(isEmailValid(emails[3])).eql(false);
    expect(isEmailValid(emails[4])).eql(false);
  });
});
