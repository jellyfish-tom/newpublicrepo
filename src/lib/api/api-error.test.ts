import { describe, expect, it } from "vitest";
import {
  API_ERROR_CODES,
  ApiError,
  apiErrorFromResponse,
  isApiError,
  toUserMessage,
} from "./api-error";

describe("ApiError", () => {
  it("serializes to a stable JSON body", () => {
    const error = new ApiError(
      API_ERROR_CODES.INVALID_INPUT,
      "Invalid transaction id.",
      400,
    );

    expect(error.toJSON()).toEqual({
      code: "INVALID_INPUT",
      message: "Invalid transaction id.",
    });
  });

  it("maps unknown errors to a safe user message", () => {
    expect(
      toUserMessage(new ApiError(API_ERROR_CODES.UPSTREAM, "Service unavailable.", 503)),
    ).toBe("Service unavailable.");
    expect(toUserMessage(new Error("database exploded"))).toBe(
      "Something went wrong. Please try again.",
    );
    expect(toUserMessage("nope")).toBe("Something went wrong. Please try again.");
  });

  it("parses structured error bodies from failed responses", async () => {
    const response = new Response(
      JSON.stringify({
        code: API_ERROR_CODES.INVALID_INPUT,
        message: "Invalid transaction id.",
      }),
      { status: 400 },
    );

    const error = await apiErrorFromResponse(response);

    expect(isApiError(error)).toBe(true);
    expect(error.status).toBe(400);
    expect(error.code).toBe("INVALID_INPUT");
    expect(error.message).toBe("Invalid transaction id.");
  });

  it("falls back when error responses are not structured", async () => {
    const response = new Response("Internal Server Error", { status: 500 });

    const error = await apiErrorFromResponse(response);

    expect(error.code).toBe("UPSTREAM");
    expect(error.status).toBe(500);
    expect(error.message).toBe("The request could not be completed. Please try again.");
  });

  it("wraps route handlers into structured JSON errors", async () => {
    const { runRoute } = await import("./api-error");

    const response = await runRoute(async () => {
      throw new ApiError(API_ERROR_CODES.INVALID_INPUT, "Invalid transaction id.", 400);
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      code: "INVALID_INPUT",
      message: "Invalid transaction id.",
    });
  });
});
