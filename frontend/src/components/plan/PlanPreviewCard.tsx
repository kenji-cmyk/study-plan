import { localDate, monthName } from "../../utils/dates";
import { useId, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  List,
  Search,
} from "lucide-react";
import type { DailySchedule, StudyPlan } from "../../types/studyPlanner";
import { EmptyState } from "../ui";

function DaySchedule({ day }: { day: DailySchedule }) {
  const date = localDate(day.date);
  return (
    <article className="day-card">
      <header className="day-card-header">
        <div className="date-badge">
          <strong>{date.getDate()}</strong>
          <span>{date.toLocaleDateString("en", { weekday: "short" })}</span>
        </div>
        <div>
          <h3>
            {date.toLocaleDateString("en", { month: "long", day: "numeric" })}
          </h3>
          <p>
            {day.slots.length} {day.slots.length === 1 ? "session" : "sessions"}
          </p>
        </div>
      </header>
      <ol className="agenda-slots">
        {day.slots.map((subject, index) => (
          <li key={`${subject.id}-${index}`}>
            <span className="slot-number" aria-label={`Session ${index + 1}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <span className="subject-code">{subject.code}</span>
              <a href={`#/subjects/${subject.id}`}>{subject.name}</a>
              <small>Weight {subject.weight.toFixed(2)}</small>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

export function PlanPreviewCard({
  plan,
  isSaved,
}: {
  plan: StudyPlan;
  isSaved: boolean;
}) {
  const searchId = useId();
  const [view, setView] = useState<"month" | "agenda">(() =>
    window.matchMedia("(max-width: 640px)").matches ? "agenda" : "month",
  );
  const [selected, setSelected] = useState(plan.days[0]?.date ?? "");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const days = useMemo(
    () =>
      plan.days.filter(
        (day) =>
          (!filter || day.date === filter) &&
          (!query ||
            day.slots.some((subject) =>
              `${subject.code} ${subject.name}`
                .toLowerCase()
                .includes(query.toLowerCase().trim()),
            )),
      ),
    [plan, query, filter],
  );
  const selectedDay = days.find((day) => day.date === selected) ?? days[0];
  const selectedIndex = days.findIndex((day) => day.date === selectedDay?.date);
  const offset = (new Date(plan.year, plan.month - 1, 1).getDay() + 6) % 7;
  const length = new Date(plan.year, plan.month, 0).getDate();
  return (
    <section className="plan-results" aria-label="Monthly schedule">
      <div className="schedule-heading">
        <div>
          <h2>{monthName(plan.year, plan.month)}</h2>
          <p>
            {plan.days.length} days ·{" "}
            {plan.days.reduce((sum, day) => sum + day.slots.length, 0)} sessions
            <span
              className={`badge ${isSaved ? "badge-active" : "badge-primary"}`}
            >
              {isSaved ? "Saved plan" : "Preview · not saved"}
            </span>
          </p>
        </div>
        <div className="view-switch" role="group" aria-label="Schedule view">
          <button
            aria-pressed={view === "month"}
            onClick={() => setView("month")}
          >
            <CalendarDays size={16} />
            Month
          </button>
          <button
            aria-pressed={view === "agenda"}
            onClick={() => setView("agenda")}
          >
            <List size={16} />
            Agenda
          </button>
        </div>
      </div>
      <div className="schedule-filters">
        <div className="search-field">
          <Search size={17} />
          <label className="sr-only" htmlFor={searchId}>
            Find a subject in this plan
          </label>
          <input
            id={searchId}
            type="search"
            placeholder="Find a subject in this plan…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <label className="date-filter">
          Day
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All days</option>
            {plan.days.map((day) => (
              <option key={day.date} value={day.date}>
                {localDate(day.date).toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                  weekday: "short",
                })}
              </option>
            ))}
          </select>
        </label>
      </div>
      {!days.length ? (
        <EmptyState
          title="No sessions match"
          action={
            <button
              className="btn btn-secondary"
              onClick={() => {
                setQuery("");
                setFilter("");
              }}
            >
              Clear filters
            </button>
          }
        >
          Try another subject name or choose a different day.
        </EmptyState>
      ) : view === "agenda" ? (
        <div className="days-grid">
          {days.map((day) => (
            <DaySchedule day={day} key={day.date} />
          ))}
        </div>
      ) : (
        <div className="calendar-layout">
          <div className="calendar-panel">
            <div className="calendar-weekdays" aria-hidden="true">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="calendar-grid">
              {Array.from({ length: offset }, (_, i) => (
                <div key={`blank-${i}`} className="calendar-blank" />
              ))}
              {Array.from({ length }, (_, i) => {
                const day = days.find(
                  (item) => Number(item.date.slice(-2)) === i + 1,
                );
                return (
                  <button
                    key={i}
                    className={`calendar-day ${day?.date === selectedDay?.date ? "selected" : ""}`}
                    disabled={!day}
                    aria-pressed={!!day && day.date === selectedDay?.date}
                    aria-label={`${monthName(plan.year, plan.month)}, day ${i + 1}${day ? `, ${day.slots.length} sessions` : ", no matching sessions"}`}
                    onClick={() => day && setSelected(day.date)}
                  >
                    <span className="calendar-day-number">{i + 1}</span>
                    {day && (
                      <>
                        <span className="calendar-codes">
                          {day.slots.slice(0, 2).map((subject) => (
                            <span key={subject.id}>{subject.code}</span>
                          ))}
                          {day.slots.length > 2 && (
                            <small>+{day.slots.length - 2} more</small>
                          )}
                        </span>
                        <span className="mobile-slot-count">
                          {day.slots.length}
                          <span className="sr-only"> sessions</span>
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="calendar-hint">
              Select a day to explore its sessions.
            </p>
          </div>
          {selectedDay && (
            <aside className="selected-day">
              <div className="day-navigation">
                <span>Daily focus</span>
                <div>
                  <button
                    className="btn-icon"
                    aria-label="Previous day"
                    disabled={selectedIndex <= 0}
                    onClick={() => setSelected(days[selectedIndex - 1].date)}
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <button
                    className="btn-icon"
                    aria-label="Next day"
                    disabled={selectedIndex >= days.length - 1}
                    onClick={() => setSelected(days[selectedIndex + 1].date)}
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
              <div aria-live="polite">
                <DaySchedule day={selectedDay} />
              </div>
            </aside>
          )}
        </div>
      )}
    </section>
  );
}
