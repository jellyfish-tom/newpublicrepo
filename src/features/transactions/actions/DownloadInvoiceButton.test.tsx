import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { transactionsApiMswPatterns } from "@/lib/api/transactions.routes";
import { mswServer } from "@/test/msw/server";

const triggerDownloadMock = vi.fn();
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();

vi.mock("@/lib/browser/download", () => ({
  triggerDownload: (...args: unknown[]) => triggerDownloadMock(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

import { DownloadInvoiceButton } from "./DownloadInvoiceButton";

describe("DownloadInvoiceButton", () => {
  beforeEach(() => {
    triggerDownloadMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("downloads the invoice blob from the API and emits a success toast", async () => {
    const user = userEvent.setup();

    render(<DownloadInvoiceButton transactionId="TX-1" />);
    await user.click(screen.getByRole("button", { name: /download invoice for TX-1/i }));

    await vi.waitFor(() => {
      expect(triggerDownloadMock).toHaveBeenCalledTimes(1);
    });

    const [blob, filename] = triggerDownloadMock.mock.calls[0] ?? [];
    const blobLike = blob as { type: string; size: number };

    expect(blobLike.type).toBe("application/pdf");
    expect(blobLike.size).toBeGreaterThan(0);
    expect(filename).toBe("invoice-TX-1.pdf");
    expect(toastSuccessMock).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: /download invoice for TX-1/i }),
    ).not.toHaveAttribute("aria-busy");
  });

  it("emits an error toast when the invoice endpoint fails", async () => {
    const user = userEvent.setup();

    mswServer.use(
      http.get(transactionsApiMswPatterns.invoice, () => HttpResponse.error()),
    );

    render(<DownloadInvoiceButton transactionId="TX-2" />);
    await user.click(screen.getByRole("button", { name: /download invoice for TX-2/i }));

    await vi.waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalled();
    });
    expect(triggerDownloadMock).not.toHaveBeenCalled();
  });
});
