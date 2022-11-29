describe("My first test", () => {
  let sut;

  beforeEach(() => {
    sut = {};
  })

  it("Should be true if true", () => {
    sut.a = false;

    sut.a = true;

    expect(sut.a).toBe(true);
  })
})