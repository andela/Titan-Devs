
const secret = require("../config/index").secret;
const equal = require("chai").assert.equal;
const addTwo = (a, b) => {
  return parseFloat(a) + parseFloat(b);
};

describe("/addTwo", () => {
  it("It should return sum of two number", done => {
    const sum = addTwo(2, 4);
    equal(sum, 6);
    done();
  });
  it("It should return secret", done => {
    equal(secret, "secret");
    done();
  });
});
