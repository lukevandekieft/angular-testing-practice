import { StrengthPipe } from "./strength.pipe"

describe("StrengthPipe", () => {
  it("should display weak when strength is 5", () => {
    const pipe = new StrengthPipe();

    const result = pipe.transform(5);

    expect(result).toEqual("5 (weak)");
  })

  it("should display strong when strength is 10", () => {
    const pipe = new StrengthPipe();

    const result = pipe.transform(10);

    expect(result).toEqual("10 (strong)");
  })
})