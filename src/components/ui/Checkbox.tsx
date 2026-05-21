import {
  useCallback,
  useEffect,
  useRef,
  type InputHTMLAttributes,
  type Ref,
} from "react";
import { cn } from "@/lib/cn";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
  label: string;
  hideLabel?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function Checkbox({
  indeterminate = false,
  label,
  hideLabel = false,
  className,
  id,
  ref: externalRef,
  ...rest
}: CheckboxProps) {
  const innerRef = useRef<HTMLInputElement | null>(null);
  const disabledClassName = rest.disabled ? "cursor-not-allowed opacity-60" : undefined;

  useEffect(() => {
    const node = innerRef.current;

    if (node) {
      node.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof externalRef === "function") {
        externalRef(node);

        return;
      }

      if (externalRef) {
        externalRef.current = node;
      }
    },
    [externalRef],
  );

  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 select-none text-sm",
        disabledClassName,
        className,
      )}
    >
      <input
        ref={setRef}
        id={id}
        type="checkbox"
        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-500 accent-emerald-500 focus:ring-2 focus:ring-emerald-400/60 focus:ring-offset-1 disabled:cursor-not-allowed dark:border-slate-600 dark:accent-emerald-400"
        {...rest}
      />
      <span className={hideLabel ? "sr-only" : undefined}>{label}</span>
    </label>
  );
}
