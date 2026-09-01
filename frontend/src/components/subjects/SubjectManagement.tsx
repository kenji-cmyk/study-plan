import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Edit2, Info, Plus, RefreshCw, Trash2, XCircle } from 'lucide-react';
import type { Subject, SubjectPage } from '../../types/studyPlanner';
import { subjectApi } from '../../api/subjectApi';
import { NormalizedApiError } from '../../api/client';
import { SubjectFormModal } from './SubjectFormModal';
import { SubjectDeleteModal } from './SubjectDeleteModal';

interface SubjectManagementProps {
  onNotify: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
  onActiveSubjectsChange?: (count: number) => void;
}

export const SubjectManagement: React.FC<SubjectManagementProps> = ({ onNotify, onActiveSubjectsChange }) => {
  const [pageData, setPageData] = useState<SubjectPage | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  const fetchSubjects = useCallback(async (page: number, size: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await subjectApi.getSubjects(page, size, 'id,asc');
      setPageData(data);
      setCurrentPage(data.number);

      // Count active subjects for plan generator checks
      const activeCount = data.content.filter((s) => s.active).length;
      if (onActiveSubjectsChange) {
        onActiveSubjectsChange(activeCount);
      }
    } catch (err) {
      if (err instanceof NormalizedApiError) {
        setError(err.apiError.message || 'Failed to load subjects.');
      } else {
        setError('Could not connect to backend server. Please verify settings.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [onActiveSubjectsChange]);

  useEffect(() => {
    fetchSubjects(currentPage, pageSize);
  }, [currentPage, pageSize, fetchSubjects]);

  const handleCreateNew = () => {
    setSubjectToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (subject: Subject) => {
    setSubjectToEdit(subject);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (subject: Subject) => {
    setSubjectToDelete(subject);
    setIsDeleteOpen(true);
  };

  const handleFormSuccess = (msg: string) => {
    onNotify('success', msg);
    fetchSubjects(currentPage, pageSize);
  };

  const handleDeleteSuccess = (msg: string) => {
    onNotify('success', msg);
    // Page recalculation check: if last item on current page > 0, decrement page
    if (pageData && pageData.content.length === 1 && currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    } else {
      fetchSubjects(currentPage, pageSize);
    }
  };

  return (
    <div className="subjects-view">
      {/* Top Banner Notice */}
      <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
        <Info size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Active Subjects Note:</strong> The study plan generator uses <em>only active subjects</em> to allocate study slots. Ensure you have enough active subjects before generating a monthly plan.
        </div>
      </div>

      {/* Main Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Subjects Directory</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
              Manage curriculum subjects, weights, and active status.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => fetchSubjects(currentPage, pageSize)}
              disabled={isLoading}
              title="Refresh list"
              id="btn-refresh-subjects"
            >
              <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleCreateNew}
              id="btn-add-subject"
            >
              <Plus size={18} />
              <span>Add Subject</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{error}</div>
            <button className="btn btn-secondary btn-sm" onClick={() => fetchSubjects(currentPage, pageSize)}>
              Retry
            </button>
          </div>
        )}

        {/* Table Content */}
        <div className="table-responsive">
          <table className="subjects-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th>Weight</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (!pageData || pageData.content.length === 0) ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={5}>
                      <div className="skeleton" style={{ height: '36px', width: '100%' }}></div>
                    </td>
                  </tr>
                ))
              ) : !pageData || pageData.content.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ color: 'var(--color-muted)', fontSize: '15px' }}>
                      No subjects found. Click <strong>Add Subject</strong> to create your first subject.
                    </div>
                  </td>
                </tr>
              ) : (
                pageData.content.map((subject) => (
                  <tr key={subject.id} id={`subject-row-${subject.id}`}>
                    <td>
                      <span className="code-badge">{subject.code}</span>
                    </td>
                    <td>
                      <span className="subject-name">{subject.name}</span>
                    </td>
                    <td>
                      <span className="weight-value">{subject.weight.toFixed(2)}</span>
                    </td>
                    <td>
                      {subject.active ? (
                        <span className="badge badge-active">
                          <CheckCircle2 size={13} /> Active
                        </span>
                      ) : (
                        <span className="badge badge-inactive">
                          <XCircle size={13} /> Inactive
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(subject)}
                          title="Edit subject"
                          id={`btn-edit-${subject.id}`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDeleteClick(subject)}
                          title="Delete subject"
                          style={{ color: 'var(--color-error)' }}
                          id={`btn-delete-${subject.id}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pageData && pageData.totalPages > 0 && (
          <div className="pagination-bar">
            <div className="pagination-info">
              Showing {pageData.number * pageData.size + (pageData.empty ? 0 : 1)} to{' '}
              {Math.min((pageData.number + 1) * pageData.size, pageData.totalElements)} of{' '}
              {pageData.totalElements} subjects
            </div>

            <div className="pagination-controls">
              <div className="page-size-selector">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(0);
                  }}
                  className="form-select"
                  style={{ width: '75px', height: '36px', padding: '0 0.5rem' }}
                  id="select-page-size"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="pagination-buttons">
                <button
                  className="btn btn-secondary btn-sm btn-icon"
                  disabled={pageData.first || isLoading}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  id="btn-prev-page"
                  title="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="page-number-indicator">
                  Page {pageData.number + 1} of {pageData.totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm btn-icon"
                  disabled={pageData.last || isLoading}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  id="btn-next-page"
                  title="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <SubjectFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        subjectToEdit={subjectToEdit}
      />

      <SubjectDeleteModal
        isOpen={isDeleteOpen}
        subject={subjectToDelete}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={handleDeleteSuccess}
      />

      <style>{`
        .table-responsive {
          overflow-x: auto;
        }

        .subjects-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .subjects-table th {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.85rem 1rem;
          border-bottom: 2px solid var(--color-border);
        }

        .subjects-table td {
          padding: 1.1rem 1rem;
          border-bottom: 1px solid var(--color-border);
          vertical-align: middle;
        }

        .subjects-table tbody tr {
          transition: background-color var(--transition-fast);
        }

        .subjects-table tbody tr:hover {
          background-color: var(--color-primary-light);
        }

        .code-badge {
          display: inline-block;
          font-family: monospace;
          font-size: 14px;
          font-weight: 700;
          color: var(--color-primary-hover);
          background: var(--color-primary-light);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(3, 147, 244, 0.2);
        }

        .subject-name {
          font-weight: 600;
          color: var(--color-navy);
        }

        .weight-value {
          font-weight: 600;
          color: var(--color-navy);
        }

        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--color-border);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .pagination-info {
          font-size: 14px;
          color: var(--color-muted);
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .page-size-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 14px;
          color: var(--color-muted);
        }

        .pagination-buttons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .page-number-indicator {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-navy);
          padding: 0 0.5rem;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
