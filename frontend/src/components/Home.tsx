import { monthName } from "../utils/dates";
import { useCallback } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Plus,
  Shuffle,
} from "lucide-react";
import { subjectApi } from "../api/subjectApi";
import { planApi } from "../api/planApi";
import { useResource } from "../hooks/useResource";
import { ErrorState, LoadingState, StatusBadge } from "./ui";

export function Home() {
  const now = new Date();
  const year = new Date().getFullYear(),
    month = new Date().getMonth() + 1;
  const subjects = useResource(
    useCallback(
      () => subjectApi.getSubjects(0, 4, "weight,desc", { active: true }),
      [],
    ),
  );
  const plans = useResource(
    useCallback(() => planApi.getPlans(0, { year, month }, 1), [year, month]),
  );
  const plan = plans.data?.content[0];
  const today = plan?.days.find(
    (day) => Number(day.date.slice(-2)) === now.getDate(),
  );
  return (
    <div className="home-view">
      <section className="home-intro">
        <div className="intro-copy">
          <h1>
            A fresh month.
            <br />
            <span>A rhythm that’s yours.</span>
          </h1>
          <p>
            Bring your subjects. Set your priorities.
            <br className="desktop-break" /> Make a little room for learning,
            every day.
          </p>
          <div className="intro-actions">
            <a href="#/create" className="btn btn-primary">
              <Shuffle size={18} />
              Create a study plan
              <ArrowRight size={17} />
            </a>
            <a href="#/subjects" className="text-link">
              Explore your subjects
            </a>
          </div>
          <div className="intro-note">
            <CalendarDays size={17} />
            <span>{monthName(year, month)} · One day at a time</span>
          </div>
        </div>
        <section className="home-agenda" aria-labelledby="agenda-title">
          <div className="section-heading">
            <h2 id="agenda-title">Your month, at a glance</h2>
            <CalendarDays size={20} />
          </div>
          <div className="agenda-date">
            <span>{String(now.getDate()).padStart(2, "0")}</span>
            <div>
              <strong>
                {now.toLocaleDateString("en", { weekday: "long" })}
              </strong>
              <p>{monthName(year, month)}</p>
            </div>
          </div>
          {plans.loading ? (
            <LoadingState />
          ) : plans.error ? (
            <ErrorState message={plans.error} retry={plans.refresh} />
          ) : today ? (
            <>
              <ol className="agenda-slots">
                {today.slots.map((subject, i) => (
                  <li key={subject.id}>
                    <span className="slot-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <span className="subject-code">{subject.code}</span>
                      <a href={`#/subjects/${subject.id}`}>{subject.name}</a>
                    </div>
                  </li>
                ))}
              </ol>
              <a className="text-link" href={`#/plans/${year}/${month}`}>
                Open your month
                <ArrowRight size={16} />
              </a>
            </>
          ) : (
            <div className="agenda-empty">
              <h3>A little space for what’s next.</h3>
              <p>
                {plan
                  ? "No sessions are scheduled for today. Your monthly plan is ready to explore."
                  : "No plan for this month yet. Your next learning rhythm starts with a few subjects."}
              </p>
              <a
                className="text-link"
                href={plan ? `#/plans/${year}/${month}` : "#/create"}
              >
                {plan ? "Open your month" : "Plan this month"}
                <ArrowRight size={16} />
              </a>
            </div>
          )}
        </section>
      </section>
      <section className="home-lower">
        <div className="home-subjects">
          <div className="section-heading">
            <div>
              <h2>Your active subjects</h2>
              <p>
                {subjects.data
                  ? `${subjects.data.totalElements} ready for your next plan`
                  : "The starting point for your study rhythm"}
              </p>
            </div>
            <a className="text-link" href="#/subjects">
              View all
              <ArrowRight size={16} />
            </a>
          </div>
          {subjects.loading ? (
            <LoadingState />
          ) : subjects.error ? (
            <ErrorState message={subjects.error} retry={subjects.refresh} />
          ) : subjects.data?.content.length ? (
            <div className="subject-list">
              {subjects.data.content.map((subject) => (
                <a
                  className="subject-list-row"
                  href={`#/subjects/${subject.id}`}
                  key={subject.id}
                >
                  <span className="subject-code">{subject.code}</span>
                  <strong>{subject.name}</strong>
                  <span className="weight-inline">Weight {subject.weight}</span>
                  <ArrowRight size={16} />
                </a>
              ))}
            </div>
          ) : (
            <div className="first-subject">
              <BookOpen size={25} />
              <div>
                <h3>What would you like to learn?</h3>
                <p>Add your subjects and give each one a priority weight.</p>
                <a href="#/subjects" className="text-link">
                  <Plus size={16} />
                  Add your first subject
                </a>
              </div>
            </div>
          )}
        </div>
        <aside className="how-it-works">
          <h2>
            A little random.
            <br /> A lot of intention.
          </h2>
          <p>Every plan starts with your priorities.</p>
          <ol>
            <li>
              <strong>Add your subjects</strong>
              <span>Keep the ones you want to study active.</span>
            </li>
            <li>
              <strong>Set your rhythm</strong>
              <span>Choose a month and 1–10 sessions a day.</span>
            </li>
            <li>
              <strong>Find your flow</strong>
              <span>Preview the mix, then save your month.</span>
            </li>
          </ol>
          <div className="small-note">
            <StatusBadge active /> Only active subjects join the mix.
          </div>
        </aside>
      </section>
    </div>
  );
}
