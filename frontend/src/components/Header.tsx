import { BookOpen, CalendarDays, House, Settings } from "lucide-react";

export function Header({
  route,
  onOpenSettings,
}: {
  route: string;
  onOpenSettings: () => void;
}) {
  return (
    <header className="header-bar">
      <div className="header-content">
        <a className="brand-logo" href="#/" aria-label="StudyPlanner home">
          <BookOpen size={28} strokeWidth={2} />
          <span>
            StudyPlanner
            <span className="brand-subtitle">
              A little structure. More possibility.
            </span>
          </span>
        </a>
        <nav className="nav-tabs" aria-label="Main navigation">
          {[
            { path: "/", label: "Home", icon: House },
            { path: "/subjects", label: "Subjects", icon: BookOpen },
            { path: "/plans", label: "Study plans", icon: CalendarDays },
          ].map(({ path, label, icon: Icon }) => {
            const active =
              path === "/"
                ? route === "/"
                : path === "/plans"
                  ? route.startsWith("/plans") || route === "/create"
                  : route.startsWith(path);
            return (
              <a
                key={path}
                href={`#${path}`}
                className={`nav-tab ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={17} />
                <span>{label}</span>
              </a>
            );
          })}
        </nav>
        <button
          className="btn-icon settings-button"
          onClick={onOpenSettings}
          aria-label="Settings"
          title="Settings"
        >
          <Settings size={21} />
        </button>
      </div>
    </header>
  );
}
