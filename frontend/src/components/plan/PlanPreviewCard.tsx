import React from 'react';
import { Clock, Sparkles } from 'lucide-react';
import type { StudyPlan } from '../../types/studyPlanner';

interface PlanPreviewCardProps {
  plan: StudyPlan;
  isSaved?: boolean;
}

export const PlanPreviewCard: React.FC<PlanPreviewCardProps> = ({ plan, isSaved = false }) => {
  const getMonthName = (month: number) => {
    const date = new Date(2026, month - 1, 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  const formatDateLabel = (dateString: string) => {
    try {
      const [y, m, d] = dateString.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return {
        weekday: date.toLocaleString('default', { weekday: 'short' }),
        day: d,
        monthYear: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
      };
    } catch {
      return { weekday: '', day: dateString, monthYear: '' };
    }
  };

  return (
    <div className="plan-results">
      {/* Plan Header Bar */}
      <div className="plan-header-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="plan-badge-icon">
            <Sparkles size={24} color="#FFFFFF" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy)' }}>
              Study Schedule for {getMonthName(plan.month)} {plan.year}
            </h3>
            <span style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
              {plan.days.length} Days Allocated • {isSaved ? 'Persisted Monthly Plan' : 'Generated Proposal Preview'}
            </span>
          </div>
        </div>

        <div>
          <span className={`badge ${isSaved ? 'badge-active' : 'badge-primary'}`} style={{ padding: '0.4rem 1rem', fontSize: '14px' }}>
            {isSaved ? 'Saved Plan' : 'Preview Proposal'}
          </span>
        </div>
      </div>

      {/* Grid of Daily Schedules */}
      <div className="days-grid">
        {plan.days.map((dayItem) => {
          const formatted = formatDateLabel(dayItem.date);
          return (
            <div className="day-card" key={dayItem.date} id={`day-card-${dayItem.date}`}>
              <div className="day-card-header">
                <div className="date-badge">
                  <span className="date-day">{formatted.day}</span>
                  <span className="date-month">{formatted.weekday}</span>
                </div>
                <div className="date-meta">
                  <span className="full-date-string">{dayItem.date}</span>
                  <span className="slot-count">{dayItem.slots.length} Slots</span>
                </div>
              </div>

              <div className="slots-list">
                {dayItem.slots.map((subject, slotIdx) => (
                  <div className="slot-item" key={`${dayItem.date}-slot-${slotIdx}`}>
                    <div className="slot-pill">
                      <Clock size={12} /> Slot {slotIdx + 1}
                    </div>
                    <div className="slot-subject-info">
                      <span className="slot-subject-code">{subject.code}</span>
                      <span className="slot-subject-name">{subject.name}</span>
                    </div>
                    <span className="slot-subject-weight" title="Weight">
                      w: {subject.weight.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .plan-results {
          margin-top: 2rem;
          animation: fadeIn 0.3s ease-out;
        }

        .plan-header-banner {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
        }

        .plan-badge-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .day-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-normal), box-shadow var(--transition-normal);
        }

        .day-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: rgba(3, 147, 244, 0.3);
        }

        .day-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--color-border);
        }

        .date-badge {
          width: 46px;
          height: 48px;
          background: var(--color-primary-light);
          border: 1px solid rgba(3, 147, 244, 0.2);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .date-day {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-primary-hover);
          line-height: 1;
        }

        .date-month {
          font-size: 11px;
          font-weight: 600;
          color: var(--color-muted);
          text-transform: uppercase;
        }

        .date-meta {
          display: flex;
          flex-direction: column;
        }

        .full-date-string {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-navy);
        }

        .slot-count {
          font-size: 12px;
          color: var(--color-muted);
        }

        .slots-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .slot-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.65rem 0.85rem;
        }

        .slot-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 11px;
          font-weight: 700;
          color: var(--color-primary-hover);
          background: #FFFFFF;
          border: 1px solid rgba(3, 147, 244, 0.3);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-pill);
          white-space: nowrap;
        }

        .slot-subject-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .slot-subject-code {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-navy);
        }

        .slot-subject-name {
          font-size: 12px;
          color: var(--color-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .slot-subject-weight {
          font-size: 11px;
          font-weight: 600;
          color: var(--color-muted);
          background: #FFFFFF;
          padding: 0.15rem 0.4rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
        }
      `}</style>
    </div>
  );
};
