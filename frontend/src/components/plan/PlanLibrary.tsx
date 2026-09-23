import { monthName } from "../../utils/dates";
import { useCallback, useState } from "react";
import { ArrowRight, CalendarDays, Plus, Search } from "lucide-react";
import { planApi } from "../../api/planApi";
import { useResource } from "../../hooks/useResource";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  Pagination,
} from "../ui";
import { PlanPreviewCard } from "./PlanPreviewCard";

export function PlanLibrary() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [filters, setFilters] = useState<{ year?: number; month?: number }>({});
  const [page, setPage] = useState(0);
  const resource = useResource(
    useCallback(() => planApi.getPlans(page, filters), [page, filters]),
  );
  const filtered = filters.year !== undefined || filters.month !== undefined;
  return (
    <>
      <PageHeading
        title="Your study plans"
        description="A place for every month you’ve made room to learn."
      >
        <a href="#/create" className="btn btn-primary">
          <Plus size={18} />
          Create a plan
        </a>
      </PageHeading>
      <form
        className="plan-search"
        onSubmit={(e) => {
          e.preventDefault();
          setFilters({
            year: year ? Number(year) : undefined,
            month: month ? Number(month) : undefined,
          });
          setPage(0);
        }}
      >
        <div>
          <label htmlFor="find-month" className="form-label">
            Month
          </label>
          <select
            id="find-month"
            className="form-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">Any month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {new Date(2026, i).toLocaleDateString("en", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="find-year" className="form-label">
            Year
          </label>
          <input
            id="find-year"
            className="form-input"
            inputMode="numeric"
            type="number"
            min="1900"
            max="9999"
            placeholder="Any year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary" type="submit">
          <Search size={17} />
          Find plans
        </button>
        {filtered && (
          <button
            className="text-link"
            type="button"
            onClick={() => {
              setMonth("");
              setYear("");
              setFilters({});
              setPage(0);
            }}
          >
            Clear filters
          </button>
        )}
      </form>
      {resource.loading ? (
        <LoadingState />
      ) : resource.error ? (
        <ErrorState message={resource.error} retry={resource.refresh} />
      ) : !resource.data?.content.length ? (
        <EmptyState
          title={
            filtered
              ? "No plans for this period"
              : "Your next month is an open page."
          }
          action={
            <a href="#/create" className="btn btn-primary">
              Create a study plan
              <ArrowRight size={17} />
            </a>
          }
        >
          {filtered
            ? "Try a different month or year, or create a new study plan."
            : "Turn your active subjects into a monthly rhythm. Preview your plan before saving it here."}
        </EmptyState>
      ) : (
        <>
          <div className="section-heading">
            <h2>{filtered ? "Matching plans" : "Saved plans"}</h2>
            <span className="muted">
              {resource.data.totalElements}{" "}
              {resource.data.totalElements === 1 ? "month" : "months"}
            </span>
          </div>
          <div className="plan-library">
            {resource.data.content.map((plan) => (
              <a
                key={`${plan.year}-${plan.month}`}
                className="saved-plan"
                href={`#/plans/${plan.year}/${plan.month}`}
              >
                <div className="saved-plan-top">
                  <CalendarDays size={23} />
                  <span className="badge badge-active">Saved</span>
                </div>
                <h2>{monthName(plan.year, plan.month)}</h2>
                <p>
                  {plan.days.length} days ·{" "}
                  {plan.days.reduce((sum, day) => sum + day.slots.length, 0)}{" "}
                  sessions
                </p>
                <div className="mini-month" aria-hidden="true">
                  {Array.from(
                    { length: new Date(plan.year, plan.month, 0).getDate() },
                    (_, i) => (
                      <span
                        key={i}
                        className={
                          plan.days.some(
                            (day) => Number(day.date.slice(-2)) === i + 1,
                          )
                            ? "scheduled"
                            : ""
                        }
                      >
                        {i + 1}
                      </span>
                    ),
                  )}
                </div>
                <div className="saved-plan-bottom">
                  <span>Explore this month</span>
                  <ArrowRight size={18} />
                </div>
              </a>
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={resource.data.totalPages}
            total={resource.data.totalElements}
            loading={resource.loading}
            onChange={setPage}
          />
        </>
      )}
    </>
  );
}

export function PlanDetail({ year, month }: { year: number; month: number }) {
  const resource = useResource(
    useCallback(() => planApi.getPlans(0, { year, month }, 1), [year, month]),
  );
  return (
    <>
      <PageHeading
        title={monthName(year, month)}
        description="Your month of learning, one day at a time."
        back={{ href: "#/plans", label: "All study plans" }}
      >
        <a href="#/create" className="btn btn-secondary">
          <Plus size={17} />
          Create another plan
        </a>
      </PageHeading>
      {resource.loading ? (
        <LoadingState />
      ) : resource.error ? (
        <ErrorState message={resource.error} retry={resource.refresh} />
      ) : resource.data?.content[0] ? (
        <PlanPreviewCard
          key={`${year}-${month}`}
          plan={resource.data.content[0]}
          isSaved
        />
      ) : (
        <EmptyState
          title="No saved plan for this month"
          action={
            <a href="#/create" className="btn btn-primary">
              Create a plan
            </a>
          }
        >
          Choose a different month in your library, or make a new plan.
        </EmptyState>
      )}
    </>
  );
}
