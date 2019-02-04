const assert = require("chai").assert;
const addTwo = (a, b) => {
  return parseFloat(a) + parseFloat(b);
};

describe("/addTwo", () => {
  it("It should return sum of two number", done => {
    const sum = addTwo(2, 4);
    assert.equal(sum, 6);
    done();
  });
});
