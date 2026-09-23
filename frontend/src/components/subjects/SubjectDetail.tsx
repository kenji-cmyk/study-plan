import { useCallback, useState } from "react";
import { ArrowRight, Edit2, Trash2 } from "lucide-react";
import { subjectApi } from "../../api/subjectApi";
import { useResource } from "../../hooks/useResource";
import {
  ErrorState,
  LoadingState,
  PageHeading,
  StatusBadge,
  type Notify,
} from "../ui";
import { SubjectFormModal } from "./SubjectFormModal";
import { SubjectDeleteModal } from "./SubjectDeleteModal";

export function SubjectDetail({
  id,
  onNotify,
}: {
  id: number;
  onNotify: Notify;
}) {
  const resource = useResource(
    useCallback(() => subjectApi.getSubject(id), [id]),
  );
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const subject = resource.data;
  return (
    <>
      <PageHeading
        title="Subject details"
        back={{ href: "#/subjects", label: "All subjects" }}
      />
      {resource.loading ? (
        <LoadingState />
      ) : resource.error ? (
        <ErrorState message={resource.error} retry={resource.refresh} />
      ) : (
        subject && (
          <>
            <section className="subject-detail">
              <div className="detail-main">
                <span className="subject-code">{subject.code}</span>
                <h2>{subject.name}</h2>
                <StatusBadge active={subject.active} />
                <p>
                  {subject.active
                    ? "This subject is part of the mix when you generate a study plan."
                    : "This subject is taking a break. Activate it to include it in new study plans."}
                </p>
                <div className="detail-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditing(true)}
                  >
                    <Edit2 size={17} />
                    Edit subject
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setDeleting(true)}
                  >
                    <Trash2 size={17} />
                    Delete subject
                  </button>
                </div>
              </div>
              <aside className="detail-weight">
                <h3>Priority weight</h3>
                <strong className="weight-display">
                  {subject.weight.toFixed(2)}
                </strong>
                <p>
                  Relative to your other active subjects, a higher weight means
                  more sessions in the month.
                </p>
                <p>A subject never appears twice on the same day.</p>
              </aside>
            </section>
            <div className="next-step">
              <div>
                <h2>Put your priorities into practice.</h2>
                <p>Choose a month and discover a new study rhythm.</p>
              </div>
              <a className="text-link" href="#/create">
                Create a study plan
                <ArrowRight size={17} />
              </a>
            </div>
            {editing && (
              <SubjectFormModal
                isOpen
                subjectToEdit={subject}
                onClose={() => setEditing(false)}
                onSuccess={(message) => {
                  onNotify("success", message);
                  resource.refresh();
                }}
              />
            )}
            {deleting && (
              <SubjectDeleteModal
                isOpen
                subject={subject}
                onClose={() => setDeleting(false)}
                onSuccess={(message) => {
                  onNotify("success", message);
                  window.location.hash = "/subjects";
                }}
              />
            )}
          </>
        )
      )}
    </>
  );
}
