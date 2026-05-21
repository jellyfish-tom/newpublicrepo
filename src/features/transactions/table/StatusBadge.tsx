import { Badge } from "@/components/ui/Badge";
import type { TransactionStatus } from "../model/types";

interface StatusBadgeProps {
  status: TransactionStatus;
  className?: string;
}

const STATUS_LABELS: Record<TransactionStatus, string> = {
  success: "Success",
  failed: "Failed",
  pending: "Pending",
};

const STATUS_VARIANTS: Record<TransactionStatus, "success" | "danger" | "warning"> = {
  success: "success",
  failed: "danger",
  pending: "warning",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} dot className={className}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
