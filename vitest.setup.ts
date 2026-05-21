import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { __resetFormattersForTest } from "@/lib/format";
import { mswServer } from "@/test/msw/server";

beforeAll(() => {
  mswServer.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  __resetFormattersForTest();
  mswServer.resetHandlers();
});

afterAll(() => {
  mswServer.close();
});
