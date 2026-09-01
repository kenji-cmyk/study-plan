import React, { useEffect, useState } from 'react';
import { AlertCircle, Calendar, Eye, Info, Save, Sparkles } from 'lucide-react';
import type { CreateStudyPlanRequest, StudyPlan } from '../../types/studyPlanner';
import { planApi } from '../../api/planApi';
import { subjectApi } from '../../api/subjectApi';
import { NormalizedApiError } from '../../api/client';
import { PlanPreviewCard } from './PlanPreviewCard';

interface PlanGeneratorProps {
  onNotify: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
  activeSubjectsCount?: number;
}

export const PlanGenerator: React.FC<PlanGeneratorProps> = ({ onNotify, activeSubjectsCount: externalActiveCount }) => {
  const currentDate = new Date();
  const defaultYear = currentDate.getFullYear();
  const defaultMonth = currentDate.getMonth() + 1; // 1..12

  const [year, setYear] = useState<number>(defaultYear);
  const [month, setMonth] = useState<number>(defaultMonth);
  const [slotsPerDay, setSlotsPerDay] = useState<number>(3);

  const [activeSubjectsCount, setActiveSubjectsCount] = useState<number>(externalActiveCount ?? 0);
  const [isCheckingActive, setIsCheckingActive] = useState<boolean>(false);

  // Preview & Saved state
  const [previewPlan, setPreviewPlan] = useState<StudyPlan | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [previewInputs, setPreviewInputs] = useState<{ year: number; month: number; slotsPerDay: number } | null>(null);

  // Async loading & error state
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch active subject count if not supplied by parent
  useEffect(() => {
    if (externalActiveCount !== undefined) {
      setActiveSubjectsCount(externalActiveCount);
      return;
    }

    const loadActiveCount = async () => {
      setIsCheckingActive(true);
      try {
        const page = await subjectApi.getSubjects(0, 100);
        const active = page.content.filter((s) => s.active).length;
        setActiveSubjectsCount(active);
      } catch {
        // Ignored
      } finally {
        setIsCheckingActive(false);
      }
    };

    loadActiveCount();
  }, [externalActiveCount]);

  // Check if inputs have changed since last preview
  const inputsChanged = Boolean(
    previewInputs &&
      (previewInputs.year !== year ||
        previewInputs.month !== month ||
        previewInputs.slotsPerDay !== slotsPerDay)
  );

  // Invalidate preview if inputs change
  useEffect(() => {
    if (inputsChanged && previewPlan) {
      setPreviewPlan(null);
      setIsSaved(false);
      setPreviewInputs(null);
    }
  }, [inputsChanged, previewPlan]);

  const handlePreview = async () => {
    setError(null);
    setIsPreviewLoading(true);
    try {
      const plan = await planApi.previewPlan(year, month, slotsPerDay);
      setPreviewPlan(plan);
      setIsSaved(false);
      setPreviewInputs({ year, month, slotsPerDay });
      onNotify('info', `Generated schedule preview for ${month}/${year}.`);
    } catch (err) {
      if (err instanceof NormalizedApiError) {
        setError(err.apiError.message || 'Failed to generate preview.');
      } else {
        setError('Unexpected error generating preview. Please try again.');
      }
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleSave = async () => {
    if (!previewPlan || inputsChanged) return;
    setError(null);
    setIsSaveLoading(true);
    try {
      const payload: CreateStudyPlanRequest = { year, month, slotsPerDay };
      const savedPlan = await planApi.savePlan(payload);
      setPreviewPlan(savedPlan);
      setIsSaved(true);
      onNotify('success', `Study plan for ${month}/${year} persisted successfully!`, 'Plan Persisted');
    } catch (err) {
      if (err instanceof NormalizedApiError) {
        const apiErr = err.apiError;
        if (apiErr.status === 409) {
          setError(apiErr.message || `A study plan already exists for ${month}/${year}.`);
          onNotify('error', `A study plan already exists for ${month}/${year}.`, 'Conflict');
        } else {
          setError(apiErr.message || 'Failed to save study plan.');
        }
      } else {
        setError('Unexpected error saving study plan.');
      }
    } finally {
      setIsSaveLoading(false);
    }
  };

  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const yearOptions = Array.from({ length: 5 }, (_, i) => defaultYear + i);

  return (
    <div className="plan-generator-view">
      {/* Disclaimer Banner - Section 5 requirement */}
      <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
        <Info size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Backend Schedule Behavior Notice:</strong> Preview generates a proposal for your chosen settings. Because the backend uses random tie-breaking, saving the plan generates a new schedule independently on the server.
        </div>
      </div>

      {/* Control Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Generate Monthly Study Plan</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
              Select target month, year, and daily study slot count to generate a schedule.
            </p>
          </div>
          <div className="active-subject-badge">
            <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>Active subjects:</span>
            <strong className={`badge ${activeSubjectsCount >= slotsPerDay ? 'badge-active' : 'badge-inactive'}`}>
              {isCheckingActive ? '...' : activeSubjectsCount} active
            </strong>
          </div>
        </div>

        {/* Insufficient active subjects warning */}
        {activeSubjectsCount < slotsPerDay && (
          <div className="alert alert-warning">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>
              You need at least <strong>{slotsPerDay} active subjects</strong> to fulfill {slotsPerDay} slots per day. Currently you have {activeSubjectsCount} active subject(s). Please activate or create more subjects.
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{error}</div>
          </div>
        )}

        {/* Input Form Controls Grid */}
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="plan-year-select">
              <Calendar size={16} /> Target Year *
            </label>
            <select
              id="plan-year-select"
              className="form-select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="plan-month-select">
              <Calendar size={16} /> Target Month *
            </label>
            <select
              id="plan-month-select"
              className="form-select"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label} ({m.value})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="plan-slots-input">
              <Sparkles size={16} /> Slots per Day (1..10) *
            </label>
            <input
              id="plan-slots-input"
              type="number"
              min={1}
              max={10}
              className="form-input"
              value={slotsPerDay}
              onChange={(e) => setSlotsPerDay(Math.max(1, Math.min(10, Number(e.target.value))))}
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="actions-bar">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePreview}
            disabled={isPreviewLoading || isSaveLoading}
            id="btn-preview-plan"
          >
            <Eye size={18} />
            <span>{isPreviewLoading ? 'Generating Preview...' : 'Preview Proposal'}</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!previewPlan || isSaved || inputsChanged || isSaveLoading || isPreviewLoading}
            id="btn-save-plan"
            title={
              !previewPlan
                ? 'Generate a preview proposal first'
                : inputsChanged
                ? 'Settings changed. Generate a new preview first.'
                : isSaved
                ? 'This plan has already been saved'
                : 'Save this monthly study plan'
            }
          >
            <Save size={18} />
            <span>
              {isSaveLoading ? 'Saving Plan...' : isSaved ? 'Plan Saved ✓' : 'Save Plan'}
            </span>
          </button>
        </div>
      </div>

      {/* Render Schedule Preview Card if present */}
      {previewPlan && <PlanPreviewCard plan={previewPlan} isSaved={isSaved} />}

      <style>{`
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .active-subject-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .actions-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--color-border);
        }

        @media (max-width: 640px) {
          .actions-bar {
            flex-direction: column;
          }
          .actions-bar .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
