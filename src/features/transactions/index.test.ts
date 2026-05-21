import { describe, expect, it } from "vitest";
import * as publicApi from "./index";

describe("features/transactions public API", () => {
  it("exports exactly TransactionsView and nothing else", () => {
    expect(Object.keys(publicApi).sort()).toEqual(["TransactionsView"]);
  });
});
