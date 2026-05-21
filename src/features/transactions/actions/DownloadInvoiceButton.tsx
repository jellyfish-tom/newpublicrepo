"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { generateInvoice } from "@/lib/api/transactions";
import { triggerDownload } from "@/lib/browser/download";

interface DownloadInvoiceButtonProps {
  transactionId: string;
}

type DownloadState = "idle" | "generating";

export function DownloadInvoiceButton({ transactionId }: DownloadInvoiceButtonProps) {
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");

  const handleDownload = useCallback(async () => {
    if (downloadState === "generating") {
      return;
    }

    setDownloadState("generating");
    try {
      const blob = await generateInvoice(transactionId);

      triggerDownload(blob, `invoice-${transactionId}.pdf`);
      toast.success("Invoice downloaded", {
        description: `${transactionId} is in your downloads folder.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      toast.error("Could not generate invoice", { description: message });
    } finally {
      setDownloadState("idle");
    }
  }, [downloadState, transactionId]);

  const isGenerating = downloadState === "generating";

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleDownload}
      isLoading={isGenerating}
      loadingLabel="Generating invoice"
      aria-label={
        isGenerating
          ? `Generating invoice for ${transactionId}`
          : `Download invoice for ${transactionId}`
      }
    >
      {!isGenerating ? <Icon name="download" size="sm" /> : null}
      {isGenerating ? "Generating…" : "Invoice"}
    </Button>
  );
}
