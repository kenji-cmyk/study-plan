import { useEffect, useRef, type ReactNode } from "react";

export function Modal({
  children,
  onClose,
  labelledBy,
  busy = false,
  id,
  initialFocus,
}: {
  children: ReactNode;
  onClose: () => void;
  labelledBy: string;
  busy?: boolean;
  id?: string;
  initialFocus: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    dialog?.showModal();
    dialog?.querySelector<HTMLElement>(initialFocus)?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [initialFocus]);
  return (
    <dialog
      ref={ref}
      id={id}
      className="modal-dialog"
      aria-labelledby={labelledBy}
      aria-busy={busy}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) {
          const box = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < box.left ||
            e.clientX > box.right ||
            e.clientY < box.top ||
            e.clientY > box.bottom
          )
            onClose();
        }
      }}
    >
      {children}
    </dialog>
  );
}
