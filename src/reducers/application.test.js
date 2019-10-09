import reducer from "reducers/application";

import { cleanup } from "@testing-library/react";

afterEach(cleanup);

describe("Application Reducer", () => {
  it("throws an error with an unsupported type", () => {
    expect(() => reducer({}, { type: null })).toThrowError(
      /tried to reduce with unsupported action type/i
    );
  });
});
