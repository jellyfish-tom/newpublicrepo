import { z } from "zod";

export const API_ERROR_CODES = {
  INVALID_INPUT: "INVALID_INPUT",
  VALIDATION: "VALIDATION",
  UPSTREAM: "UPSTREAM",
  UNEXPECTED: "UNEXPECTED",
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

export interface ApiErrorBody {
  code: ApiErrorCode;
  message: string;
}

const apiErrorBodySchema = z.object({
  code: z.enum([
    API_ERROR_CODES.INVALID_INPUT,
    API_ERROR_CODES.VALIDATION,
    API_ERROR_CODES.UPSTREAM,
    API_ERROR_CODES.UNEXPECTED,
  ]),
  message: z.string(),
});

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(
    code: ApiErrorCode,
    message: string,
    status: number,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }

  toJSON(): ApiErrorBody {
    return { code: this.code, message: this.message };
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return apiErrorBodySchema.safeParse(value).success;
}

export function toUserMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return "Something went wrong. Please try again.";
  }

  return "Something went wrong. Please try again.";
}

export function logAppError(scope: string, error: unknown): void {
  if (isApiError(error)) {
    console.error(`[${scope}]`, {
      code: error.code,
      status: error.status,
      message: error.message,
      cause: error.cause,
    });

    return;
  }

  console.error(`[${scope}]`, error);
}

export async function apiErrorFromResponse(response: Response): Promise<ApiError> {
  try {
    const body: unknown = await response.json();

    if (isApiErrorBody(body)) {
      return new ApiError(body.code, body.message, response.status);
    }
  } catch {
    /* fall through to generic upstream error */
  }

  return new ApiError(
    API_ERROR_CODES.UPSTREAM,
    "The request could not be completed. Please try again.",
    response.status,
  );
}

export async function runRoute(handler: () => Promise<Response>): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    logAppError("api-route", error);

    if (isApiError(error)) {
      return Response.json(error.toJSON(), { status: error.status });
    }

    const fallback = new ApiError(
      API_ERROR_CODES.UNEXPECTED,
      "Something went wrong. Please try again.",
      500,
      { cause: error },
    );

    return Response.json(fallback.toJSON(), { status: fallback.status });
  }
}
