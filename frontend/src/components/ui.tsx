import type { ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

export type Notify = (
  type: "success" | "error" | "info" | "warning",
  message: string,
  title?: string,
) => void;

export function PageHeading({
  title,
  description,
  children,
  back,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="page-heading">
      {back && (
        <a className="text-link back-link" href={back.href}>
          <ArrowLeft size={16} />
          {back.label}
        </a>
      )}
      <div className="heading-row">
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {children && <div className="heading-actions">{children}</div>}
      </div>
    </div>
  );
}
export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="alert alert-error" role="alert">
      <AlertCircle size={20} />
      <div>
        <strong>We couldn’t load this.</strong>
        <p>{message}</p>
        {retry && (
          <button className="text-link" onClick={retry}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <Search size={28} aria-hidden="true" />
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </div>
  );
}
export function LoadingState() {
  return (
    <div role="status" aria-label="Loading" className="loading-state">
      <span className="sr-only">Loading…</span>
      {[0, 1, 2].map((n) => (
        <div key={n} className="skeleton" />
      ))}
    </div>
  );
}
export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`badge ${active ? "badge-active" : "badge-inactive"}`}>
      {active && <CheckCircle2 size={13} />}
      {active ? "Active" : "Inactive"}
    </span>
  );
}
export function Pagination({
  page,
  totalPages,
  total,
  loading,
  onChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  onChange: (page: number) => void;
}) {
  if (!total) return null;
  return (
    <div className="pagination-bar">
      <span>
        {total} {total === 1 ? "result" : "results"}
      </span>
      <div className="pagination-controls">
        <button
          className="btn-icon"
          aria-label="Previous page"
          disabled={page <= 0 || loading}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft size={18} />
        </button>
        <span>
          Page {page + 1} of {Math.max(1, totalPages)}
        </span>
        <button
          className="btn-icon"
          aria-label="Next page"
          disabled={page >= totalPages - 1 || loading}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
