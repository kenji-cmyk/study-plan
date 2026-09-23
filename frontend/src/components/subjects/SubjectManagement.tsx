import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Edit2,
  Info,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import type { Subject } from "../../types/studyPlanner";
import { subjectApi } from "../../api/subjectApi";
import { useResource } from "../../hooks/useResource";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  Pagination,
  StatusBadge,
  type Notify,
} from "../ui";
import { SubjectFormModal } from "./SubjectFormModal";
import { SubjectDeleteModal } from "./SubjectDeleteModal";

export function SubjectManagement({ onNotify }: { onNotify: Notify }) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [field, setField] = useState<"name" | "code">("name");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("name,asc");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [editor, setEditor] = useState<Subject | "new" | null>(null);
  const [deleting, setDeleting] = useState<Subject | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(0);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);
  const resource = useResource(
    useCallback(
      () =>
        subjectApi.getSubjects(page, size, sort, {
          [field]: query,
          active: status === "all" ? undefined : status === "active",
        }),
      [page, size, sort, field, query, status],
    ),
  );
  const reset = () => {
    setSearch("");
    setQuery("");
    setStatus("all");
    setPage(0);
  };
  const success = (message: string) => {
    onNotify("success", message);
    resource.refresh();
  };
  return (
    <>
      <PageHeading
        title="Your subjects"
        description="A collection of things worth making time for."
      >
        <button className="btn btn-primary" onClick={() => setEditor("new")}>
          <Plus size={18} />
          Add subject
        </button>
      </PageHeading>
      <div className="library-layout">
        <section className="library-main" aria-label="Subject directory">
          <div className="search-toolbar">
            <div className="search-field">
              <Search size={18} />
              <label className="sr-only" htmlFor="subject-search">
                Search subjects
              </label>
              <input
                id="subject-search"
                type="search"
                placeholder={`Search by ${field}…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <label className="sr-only" htmlFor="search-field">
              Search by
            </label>
            <select
              className="form-select search-by"
              id="search-field"
              value={field}
              onChange={(e) => {
                setField(e.target.value as "name" | "code");
                setPage(0);
              }}
            >
              <option value="name">By name</option>
              <option value="code">By code</option>
            </select>
            <button
              className="btn-icon"
              aria-label="Refresh subjects"
              disabled={resource.loading}
              onClick={resource.refresh}
            >
              <RefreshCw size={18} />
            </button>
          </div>
          <div className="filter-toolbar">
            <div
              className="filter-tabs"
              role="group"
              aria-label="Subject status"
            >
              {["all", "active", "inactive"].map((value) => (
                <button
                  key={value}
                  aria-pressed={status === value}
                  onClick={() => {
                    setStatus(value);
                    setPage(0);
                  }}
                >
                  {value === "all"
                    ? "All subjects"
                    : value === "active"
                      ? "Active"
                      : "Inactive"}
                </button>
              ))}
            </div>
            <label className="sort-control">
              Sort
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(0);
                }}
              >
                <option value="name,asc">Name A–Z</option>
                <option value="weight,desc">Highest weight</option>
                <option value="id,desc">Newest first</option>
              </select>
            </label>
          </div>
          {resource.error ? (
            <ErrorState message={resource.error} retry={resource.refresh} />
          ) : resource.loading ? (
            <LoadingState />
          ) : !resource.data?.content.length ? (
            <EmptyState
              title={
                query || status !== "all"
                  ? "No matching subjects"
                  : "Your next chapter starts here."
              }
              action={
                query || status !== "all" ? (
                  <button className="btn btn-secondary" onClick={reset}>
                    Clear filters
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditor("new")}
                  >
                    <Plus size={17} />
                    Add your first subject
                  </button>
                )
              }
            >
              {query || status !== "all"
                ? "Try another search or include all subject statuses."
                : "Add a subject, set its priority, and let your study plan take shape."}
            </EmptyState>
          ) : (
            <div
              className="table-responsive"
              tabIndex={0}
              role="region"
              aria-label="Subjects table"
            >
              <table className="subjects-table">
                <thead>
                  <tr>
                    <th scope="col">Subject</th>
                    <th scope="col">Weight</th>
                    <th scope="col">Status</th>
                    <th scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resource.data.content.map((subject) => (
                    <tr key={subject.id}>
                      <td>
                        <a
                          className="subject-title-link"
                          href={`#/subjects/${subject.id}`}
                        >
                          <span className="subject-code">{subject.code}</span>
                          <strong>{subject.name}</strong>
                          <ArrowUpRight size={15} />
                        </a>
                      </td>
                      <td className="numeric">{subject.weight.toFixed(2)}</td>
                      <td>
                        <StatusBadge active={subject.active} />
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="btn-icon"
                            aria-label={`Edit ${subject.code}`}
                            onClick={() => setEditor(subject)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon danger-icon"
                            aria-label={`Delete ${subject.code}`}
                            onClick={() => setDeleting(subject)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="list-footer">
            <label className="sort-control">
              Per page
              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(0);
                }}
              >
                <option>10</option>
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </label>
            {!resource.loading && !resource.error && resource.data && (
              <Pagination
                page={page}
                total={resource.data.totalElements}
                totalPages={resource.data.totalPages}
                loading={resource.loading}
                onChange={setPage}
              />
            )}
          </div>
        </section>
        <aside className="library-aside">
          <h2>Make your priorities count.</h2>
          <p>
            A higher weight gives a subject a larger share of your monthly
            sessions.
          </p>
          <div
            className="weight-example"
            aria-label="Illustrative priority weights"
          >
            <span>
              Weight 1
              <span className="example-track">
                <i style={{ width: "33.33%" }} />
              </span>
            </span>
            <span>
              Weight 3
              <span className="example-track">
                <i style={{ width: "100%" }} />
              </span>
            </span>
            <small>Example weights, not your schedule</small>
          </div>
          <div className="aside-note">
            <Info size={18} />
            <p>
              Only active subjects are included. You need at least one active
              subject for each daily session.
            </p>
          </div>
          <a href="#/create" className="text-link">
            Ready to make a plan?
            <ArrowUpRight size={16} />
          </a>
        </aside>
      </div>
      {editor && (
        <SubjectFormModal
          isOpen
          onClose={() => setEditor(null)}
          onSuccess={success}
          subjectToEdit={editor === "new" ? null : editor}
        />
      )}
      {deleting && (
        <SubjectDeleteModal
          isOpen
          subject={deleting}
          onClose={() => setDeleting(null)}
          onSuccess={(message) => {
            success(message);
            if (resource.data?.content.length === 1 && page > 0)
              setPage(page - 1);
          }}
        />
      )}
    </>
  );
}
