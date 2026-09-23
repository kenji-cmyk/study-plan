import React, { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import type { Subject } from "../../types/studyPlanner";
import { subjectApi } from "../../api/subjectApi";
import { NormalizedApiError } from "../../api/client";
import { Modal } from "../Modal";

interface SubjectDeleteModalProps {
  isOpen: boolean;
  subject: Subject | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const SubjectDeleteModal: React.FC<SubjectDeleteModalProps> = ({
  isOpen,
  subject,
  onClose,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !subject) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await subjectApi.deleteSubject(subject.id);
      onSuccess(
        `Subject "${subject.code} - ${subject.name}" deleted successfully.`,
      );
      onClose();
    } catch (err) {
      if (err instanceof NormalizedApiError) {
        if (err.apiError.status === 404) {
          setError("The subject no longer exists on the server.");
        } else {
          setError(err.apiError.message || "Failed to delete subject.");
        }
      } else {
        setError("An unexpected error occurred while deleting subject.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      initialFocus="#btn-cancel-delete"
      onClose={onClose}
      labelledBy="delete-dialog-title"
      busy={isDeleting}
      id="delete-modal-dialog"
    >
      <div className="modal-header" style={{ borderBottomColor: "#FEE2E2" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "var(--color-error)",
          }}
        >
          <AlertTriangle size={22} />
          <h2
            className="modal-title"
            id="delete-dialog-title"
            style={{ color: "var(--color-error)" }}
          >
            Confirm Subject Deletion
          </h2>
        </div>
        <button
          className="btn-icon"
          onClick={onClose}
          id="btn-close-delete"
          aria-label="Close delete confirmation"
          disabled={isDeleting}
        >
          <X size={20} />
        </button>
      </div>

      <div className="modal-body">
        {error && (
          <div className="alert alert-error" role="alert">
            <div>{error}</div>
          </div>
        )}

        <p
          style={{
            fontSize: "15px",
            color: "var(--color-navy)",
            lineHeight: 1.5,
          }}
        >
          Are you sure you want to delete the subject{" "}
          <strong style={{ color: "var(--color-navy)" }}>
            "{subject.code} — {subject.name}"
          </strong>
          ?
        </p>
        <p
          style={{
            fontSize: "13px",
            color: "var(--color-muted)",
            marginTop: "0.75rem",
          }}
        >
          This action cannot be undone. Once deleted, this subject will no
          longer be available for study plan generation.
        </p>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onClose}
          disabled={isDeleting}
          id="btn-cancel-delete"
          autoFocus
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
          disabled={isDeleting}
          id="btn-confirm-delete"
        >
          {isDeleting ? (
            <span>Deleting...</span>
          ) : (
            <>
              <Trash2 size={16} />
              <span>Delete Subject</span>
            </>
          )}
        </button>
      </div>
    </Modal>
  );
};
