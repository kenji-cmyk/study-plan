import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, X } from 'lucide-react';
import type { CreateSubjectRequest, FieldError, Subject, UpdateSubjectRequest } from '../../types/studyPlanner';
import { subjectApi } from '../../api/subjectApi';
import { NormalizedApiError } from '../../api/client';

interface SubjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  subjectToEdit?: Subject | null;
}

export const SubjectFormModal: React.FC<SubjectFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  subjectToEdit,
}) => {
  const isEditing = Boolean(subjectToEdit);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('1.0');
  const [active, setActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (subjectToEdit) {
      setCode(subjectToEdit.code);
      setName(subjectToEdit.name);
      setWeight(subjectToEdit.weight.toString());
      setActive(subjectToEdit.active);
    } else {
      setCode('');
      setName('');
      setWeight('1.0');
      setActive(true);
    }
    setFormError(null);
    setFieldErrors({});
  }, [subjectToEdit, isOpen]);

  if (!isOpen) return null;

  const validateClient = (): boolean => {
    const errors: Record<string, string> = {};
    const trimmedCode = code.trim();
    const trimmedName = name.trim();
    const parsedWeight = parseFloat(weight);

    if (!trimmedCode) {
      errors.code = 'Subject code is required.';
    } else if (trimmedCode.length !== 6) {
      errors.code = 'Subject code must be exactly 6 characters.';
    }

    if (!trimmedName) {
      errors.name = 'Subject name is required.';
    } else if (trimmedName.length > 255) {
      errors.name = 'Subject name cannot exceed 255 characters.';
    }

    if (isNaN(parsedWeight)) {
      errors.weight = 'Weight must be a valid number.';
    } else if (parsedWeight < 0.01) {
      errors.weight = 'Weight must be at least 0.01.';
    } else if (parsedWeight > 999.99) {
      errors.weight = 'Weight cannot exceed 999.99.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    if (!validateClient()) return;

    setIsSubmitting(true);
    try {
      const payload: CreateSubjectRequest | UpdateSubjectRequest = {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        weight: parseFloat(weight),
        active,
      };

      if (isEditing && subjectToEdit) {
        await subjectApi.updateSubject(subjectToEdit.id, payload);
        onSuccess(`Subject "${payload.code}" updated successfully.`);
      } else {
        await subjectApi.createSubject(payload);
        onSuccess(`Subject "${payload.code}" created successfully.`);
      }
      onClose();
    } catch (err) {
      if (err instanceof NormalizedApiError) {
        const apiErr = err.apiError;
        if (apiErr.status === 409) {
          setFormError(apiErr.message || `Subject code "${code.trim().toUpperCase()}" already exists.`);
        } else if (apiErr.code === 'VALIDATION_FAILED' && apiErr.errors?.length) {
          const mapping: Record<string, string> = {};
          let unmapped = '';
          apiErr.errors.forEach((fe: FieldError) => {
            if (fe.field) {
              mapping[fe.field] = fe.message;
            } else {
              unmapped += (unmapped ? '; ' : '') + fe.message;
            }
          });
          setFieldErrors(mapping);
          if (unmapped || apiErr.message) {
            setFormError(unmapped || apiErr.message);
          }
        } else {
          setFormError(apiErr.message || 'Failed to save subject. Please try again.');
        }
      } else {
        setFormError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="subject-modal-backdrop">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} id="subject-modal-dialog">
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? `Edit Subject (${subjectToEdit?.code})` : 'Add New Subject'}
          </h3>
          <button className="btn-icon" onClick={onClose} id="btn-close-subject-modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {formError && (
              <div className="alert alert-error">
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <div>{formError}</div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="subject-code">
                Subject Code *
              </label>
              <input
                id="subject-code"
                type="text"
                className={`form-input ${fieldErrors.code ? 'has-error' : ''}`}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. SBA301 (6 characters)"
                maxLength={6}
                required
              />
              {fieldErrors.code ? (
                <span className="error-text">
                  <AlertCircle size={14} /> {fieldErrors.code}
                </span>
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                  Must be exactly 6 characters (e.g., PRM393).
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="subject-name">
                Subject Name *
              </label>
              <input
                id="subject-name"
                type="text"
                className={`form-input ${fieldErrors.name ? 'has-error' : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Software Business Applications"
                maxLength={255}
                required
              />
              {fieldErrors.name && (
                <span className="error-text">
                  <AlertCircle size={14} /> {fieldErrors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="subject-weight">
                Study Weight *
              </label>
              <input
                id="subject-weight"
                type="number"
                step="0.01"
                min="0.01"
                max="999.99"
                className={`form-input ${fieldErrors.weight ? 'has-error' : ''}`}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="1.0"
                required
              />
              {fieldErrors.weight ? (
                <span className="error-text">
                  <AlertCircle size={14} /> {fieldErrors.weight}
                </span>
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                  Numeric importance weight between 0.01 and 999.99.
                </span>
              )}
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  id="subject-active"
                />
                <span>Active for Study Plan Generation</span>
              </label>
              <span style={{ fontSize: '12px', color: 'var(--color-muted)', marginLeft: '1.85rem' }}>
                Only active subjects are included when generating study plans.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              disabled={isSubmitting}
              id="btn-cancel-subject"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting}
              id="btn-save-subject"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check size={16} />
                  <span>{isEditing ? 'Update Subject' : 'Create Subject'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
