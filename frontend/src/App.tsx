import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { SettingsModal } from "./components/SettingsModal";
import { SubjectManagement } from "./components/subjects/SubjectManagement";
import { SubjectDetail } from "./components/subjects/SubjectDetail";
import { PlanGenerator } from "./components/plan/PlanGenerator";
import { PlanLibrary, PlanDetail } from "./components/plan/PlanLibrary";
import { Home } from "./components/Home";
import { Toast, type ToastMessage } from "./components/Toast";
import { EmptyState } from "./components/ui";

export function App() {
  const [route, setRoute] = useState(
    () => window.location.hash.slice(1) || "/",
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [plannerVisited, setPlannerVisited] = useState(route === "/create");
  const [connectionRevision, setConnectionRevision] = useState(0);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const navigate = () => {
      const next = window.location.hash.slice(1) || "/";
      setRoute(next);
      if (next === "/create") setPlannerVisited(true);
      window.scrollTo(0, 0);
      main.current?.focus();
    };
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  useEffect(() => {
    document.title = `${route === "/" ? "Home" : route.startsWith("/subjects") ? "Subjects" : route === "/create" ? "Create a plan" : "Study plans"} · StudyPlanner`;
  }, [route]);
  const showToast = (
    type: ToastMessage["type"],
    message: string,
    title?: string,
  ) => setToast({ id: String(Date.now()), type, message, title });
  const subjectMatch = route.match(/^\/subjects\/(\d+)$/);
  const planMatch = route.match(/^\/plans\/(\d{4})\/(\d{1,2})$/);
  return (
    <div className="app-container">
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <Header route={route} onOpenSettings={() => setIsSettingsOpen(true)} />
      <main id="main-content" ref={main} tabIndex={-1} className="main-content">
        <div key={connectionRevision}>
          {route === "/" ? (
            <Home />
          ) : route === "/subjects" ? (
            <SubjectManagement onNotify={showToast} />
          ) : subjectMatch ? (
            <SubjectDetail
              key={subjectMatch[1]}
              id={Number(subjectMatch[1])}
              onNotify={showToast}
            />
          ) : route === "/create" ? null : route === "/plans" ? (
            <PlanLibrary />
          ) : planMatch &&
            Number(planMatch[2]) >= 1 &&
            Number(planMatch[2]) <= 12 ? (
            <PlanDetail
              year={Number(planMatch[1])}
              month={Number(planMatch[2])}
            />
          ) : (
            <EmptyState
              title="This page isn’t here."
              action={
                <a className="btn btn-primary" href="#/">
                  Go home
                </a>
              }
            >
              Let’s get you back to your study plans.
            </EmptyState>
          )}
          {plannerVisited && (
            <div hidden={route !== "/create"}>
              <PlanGenerator
                onNotify={showToast}
                visible={route === "/create"}
              />
            </div>
          )}
        </div>
      </main>
      <footer className="app-footer">
        <span>StudyPlanner</span>
        <span>Your subjects. Your priorities. Your rhythm.</span>
        <a href="#/create">
          Make room for learning <span aria-hidden="true">↗</span>
        </a>
      </footer>
      {isSettingsOpen && (
        <SettingsModal
          isOpen
          onClose={() => setIsSettingsOpen(false)}
          onSave={() => {
            setConnectionRevision((n) => n + 1);
            showToast("success", "Connection settings updated.");
          }}
        />
      )}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
export default App;
