<<<<<<< HEAD
import { assert } from "chai";
import config from "../config/index";

const { equal } = assert;
=======
//sample test
const secret = require("../config/index").secret;
const assert = require("chai").assert;
>>>>>>> [ch-integrate-coveralls-code-#163518680]Add code coverage and coverage reporter
const addTwo = (a, b) => {
  return parseFloat(a) + parseFloat(b);
};

<<<<<<< HEAD
describe("/addTwo ", () => {
  it("It should return sum of two number", done => {
    const sum = addTwo(2, 4);
    equal(sum, 6);
    done();
  });
  it("It should return secret", done => {
    equal(config.secret, "secret");
=======
describe("/addTwo", () => {
  it("It should return sum of two number", done => {
    const sum = addTwo(2, 4);
    assert.equal(sum, 6);
    done();
  });
  it("It should return secret", done => {
    assert.equal(secret, "secret");
>>>>>>> [ch-integrate-coveralls-code-#163518680]Add code coverage and coverage reporter
    done();
  });
});
