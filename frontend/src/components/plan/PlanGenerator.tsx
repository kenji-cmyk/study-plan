import { monthName } from "../../utils/dates";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Info, Save, Shuffle } from "lucide-react";
import type {
  CreateStudyPlanRequest,
  StudyPlan,
} from "../../types/studyPlanner";
import { planApi } from "../../api/planApi";
import { subjectApi } from "../../api/subjectApi";
import { useResource } from "../../hooks/useResource";
import { ErrorState, LoadingState, PageHeading, type Notify } from "../ui";
import { PlanPreviewCard } from "./PlanPreviewCard";

export function PlanGenerator({
  onNotify,
  visible,
}: {
  onNotify: Notify;
  visible: boolean;
}) {
  const today = new Date();
  const currentYear = today.getFullYear(),
    currentMonth = today.getMonth() + 1;
  const [settings, setSettings] = useState<CreateStudyPlanRequest>({
    year: currentYear,
    month: currentMonth,
    slotsPerDay: 3,
  });
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState<"preview" | "save" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const active = useResource(
    useCallback(
      () => subjectApi.getSubjects(0, 1, "id,asc", { active: true }),
      [],
    ),
  );
  const refreshSubjects = active.refresh;
  useEffect(() => {
    // Keep the random draft while checking any subject edits made on another page.
    if (visible) refreshSubjects();
  }, [visible, refreshSubjects]);
  const count = active.data?.totalElements ?? 0;
  const insufficient = count < settings.slotsPerDay;
  const past =
    settings.year < currentYear ||
    (settings.year === currentYear && settings.month < currentMonth);
  const update = (next: Partial<CreateStudyPlanRequest>) => {
    setSettings((value) => ({ ...value, ...next }));
    setPlan(null);
    setSaved(false);
    setError(null);
    setConflict(false);
  };
  const generate = async (save: boolean) => {
    if (
      busy ||
      past ||
      insufficient ||
      active.loading ||
      active.error ||
      (save && (!plan || saved))
    )
      return;
    setBusy(save ? "save" : "preview");
    setError(null);
    setConflict(false);
    try {
      const result = save
        ? await planApi.savePlan(settings)
        : await planApi.previewPlan(
            settings.year,
            settings.month,
            settings.slotsPerDay,
          );
      if (!mounted.current) return;
      setPlan(result);
      setSaved(save);
      if (save)
        onNotify(
          "success",
          `Your plan for ${monthName(settings.year, settings.month)} is saved.`,
          "Ready when you are",
        );
    } catch (reason) {
      if (!mounted.current) return;
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to generate your plan. Please try again.",
      );
      setConflict(
        !!reason &&
          typeof reason === "object" &&
          "apiError" in reason &&
          (reason.apiError as { status?: number }).status === 409,
      );
    } finally {
      if (mounted.current) setBusy(null);
    }
  };
  return (
    <>
      <PageHeading
        title="Find your study rhythm"
        description="A fresh mix of subjects. A whole month of possibilities."
        back={{ href: "#/plans", label: "Your study plans" }}
      />
      <ol className="planning-steps" aria-label="Planning progress">
        <li className="complete">
          <span>1</span>Set your rhythm
        </li>
        <li className={plan ? "complete" : ""}>
          <span>2</span>Explore the preview
        </li>
        <li className={saved ? "complete" : ""}>
          <span>{saved ? <Check size={14} /> : "3"}</span>Save your month
        </li>
      </ol>
      <section className="generator-settings">
        <div className="generator-intro">
          <h2>A month that fits you.</h2>
          <p>
            Your subjects are balanced by weight, with a fresh mix each day.
          </p>
          <a className="text-link" href="#/subjects">
            Manage subjects
            <ArrowRight size={15} />
          </a>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void generate(false);
          }}
        >
          <fieldset disabled={!!busy}>
            <legend className="sr-only">Plan settings</legend>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="plan-month">
                  Month
                </label>
                <select
                  className="form-select"
                  id="plan-month"
                  value={settings.month}
                  onChange={(e) => update({ month: Number(e.target.value) })}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option
                      value={i + 1}
                      key={i}
                      disabled={
                        settings.year === currentYear && i + 1 < currentMonth
                      }
                    >
                      {new Date(currentYear, i).toLocaleDateString("en", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="plan-year">
                  Year
                </label>
                <select
                  className="form-select"
                  id="plan-year"
                  value={settings.year}
                  onChange={(e) => {
                    const year = Number(e.target.value);
                    update({
                      year,
                      month:
                        year === currentYear
                          ? Math.max(currentMonth, settings.month)
                          : settings.month,
                    });
                  }}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={i}>{currentYear + i}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="plan-slots">
                  Sessions per day
                </label>
                <select
                  className="form-select"
                  id="plan-slots"
                  value={settings.slotsPerDay}
                  onChange={(e) =>
                    update({ slotsPerDay: Number(e.target.value) })
                  }
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option value={i + 1} key={i}>
                      {i + 1} {i === 0 ? "session" : "sessions"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>
          <div className="generator-actions">
            <span className="muted">
              {active.loading
                ? "Checking your subjects…"
                : active.error
                  ? "Subject count unavailable"
                  : `${count} active ${count === 1 ? "subject" : "subjects"} in your mix`}
            </span>
            <button
              className="btn btn-primary"
              disabled={
                !!busy ||
                active.loading ||
                !!active.error ||
                insufficient ||
                past
              }
              type="submit"
            >
              <Shuffle size={17} className={busy === "preview" ? "spin" : ""} />
              {busy === "preview"
                ? "Finding your rhythm…"
                : plan
                  ? "Mix it again"
                  : "Generate preview"}
            </button>
          </div>
        </form>
      </section>
      {active.error && (
        <ErrorState message={active.error} retry={active.refresh} />
      )}
      {!active.loading && !active.error && insufficient && (
        <div className="alert alert-warning" role="status">
          <Info size={19} />
          <div>
            <strong>
              {count === 0
                ? "Start with a few subjects."
                : "Your daily mix needs more subjects."}
            </strong>
            <p>
              {settings.slotsPerDay} daily sessions need at least{" "}
              {settings.slotsPerDay} active subjects.{" "}
              {count > 0
                ? "Choose fewer sessions or add more active subjects."
                : "Add and activate subjects to generate your first plan."}
            </p>
            <a className="text-link" href="#/subjects">
              Go to subjects
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      )}
      {error && (
        <>
          <ErrorState message={error} />
          {conflict && (
            <a
              className="text-link conflict-link"
              href={`#/plans/${settings.year}/${settings.month}`}
            >
              Open the saved plan for this month
              <ArrowRight size={16} />
            </a>
          )}
        </>
      )}
      {busy === "preview" ? (
        <LoadingState />
      ) : plan ? (
        <>
          <PlanPreviewCard
            key={`${settings.year}-${settings.month}-${saved}`}
            plan={plan}
            isSaved={saved}
          />
          <div className={`save-bar ${saved ? "is-saved" : ""}`}>
            <div>
              <strong>
                {saved ? "Your month is ready." : "Happy with the rhythm?"}
              </strong>
              <p>
                {saved
                  ? "This is your saved schedule. Find it any time in Study plans."
                  : "Saving generates a new random arrangement, so your saved schedule may differ from this preview. Only one plan can be saved per month."}
              </p>
            </div>
            {saved ? (
              <a
                className="btn btn-secondary"
                href={`#/plans/${settings.year}/${settings.month}`}
              >
                <Check size={17} />
                View saved plan
              </a>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => void generate(true)}
                disabled={
                  !!busy ||
                  active.loading ||
                  !!active.error ||
                  insufficient ||
                  past
                }
              >
                <Save size={17} />
                {busy === "save" ? "Saving…" : "Save monthly plan"}
              </button>
            )}
          </div>
        </>
      ) : (
        <section className="planner-empty">
          <div className="empty-month" aria-hidden="true">
            <div>
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <span key={i}>{day}</span>
              ))}
            </div>
            <div>
              {Array.from({ length: 28 }, (_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
          </div>
          <div>
            <h2>A little structure starts here.</h2>
            <p>
              Choose your month and daily sessions above. Your preview will
              appear here, ready to explore one day at a time.
            </p>
            <span className="small-note">
              <Info size={16} />
              Preview first. Save when you’re ready.
            </span>
          </div>
        </section>
      )}
    </>
  );
}
