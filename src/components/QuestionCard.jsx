const TYPE_META = {
  multiple_choice: { label: 'Multiple Choice', short: 'MC', badgeClass: 'badge-mc', icon: 'bi-ui-radios' },
  true_false:      { label: 'True / False',    short: 'TF', badgeClass: 'badge-tf', icon: 'bi-toggle-on' },
  written:         { label: 'Written',          short: 'WR', badgeClass: 'badge-wr', icon: 'bi-pencil'    },
};

export default function QuestionCard({ question, index, onDelete, deleteTitle = 'Delete question' }) {
  const meta = TYPE_META[question.type] ?? { label: question.type, short: '?', badgeClass: '', icon: 'bi-question' };

  return (
    <div className="question-item fade-in">
      <div className="d-flex align-items-start gap-3">
        {/* Index number */}
        <div style={{
          minWidth: 32, height: 32, borderRadius: 8,
          background: '#f5f8fa', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: 'var(--kt-text-muted)',
          flexShrink: 0, marginTop: 1,
        }}>
          {String(index).padStart(2, '0')}
        </div>

        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          {/* Type badge */}
          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
            <span className={`badge ${meta.badgeClass}`}>
              <i className={`bi ${meta.icon} me-1`} style={{ fontSize: 10 }} />
              {meta.label}
            </span>
          </div>

          {/* Question text */}
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--kt-text-dark)', marginBottom: 10, lineHeight: 1.5 }}>
            {question.question_text}
          </p>

          {/* Answer section */}
          <div style={{ borderTop: '1px solid var(--kt-border-color)', paddingTop: 10 }}>
            {question.type === 'multiple_choice' && (
              <div className="d-flex flex-column gap-1">
                {question.options?.map((opt, i) => (
                  <div key={i} className="d-flex align-items-center gap-2">
                    <span style={{
                      width: 16, height: 16, borderRadius: 4,
                      border: opt.is_correct ? '1px solid var(--kt-success)' : '1px solid #d9d9e3',
                      background: opt.is_correct ? 'var(--kt-success-light)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, color: opt.is_correct ? 'var(--kt-success)' : 'transparent',
                      flexShrink: 0,
                    }}>
                      {opt.is_correct ? '✓' : ''}
                    </span>
                    <span style={{
                      fontSize: 12,
                      color: opt.is_correct ? 'var(--kt-success)' : 'var(--kt-text-muted)',
                      fontWeight: opt.is_correct ? 600 : 400,
                    }}>
                      {opt.option_text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'true_false' && (
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: 12, color: 'var(--kt-text-muted)' }}>Answer:</span>
                <span className={`badge ${question.correct_answer ? 'badge-wr' : 'badge-tf'}`}>
                  {question.correct_answer ? '✓ True' : '✗ False'}
                </span>
              </div>
            )}

            {question.type === 'written' && (
              <div className="d-flex align-items-start gap-2">
                <span style={{ fontSize: 12, color: 'var(--kt-text-muted)', flexShrink: 0 }}>Answer:</span>
                <span style={{ fontSize: 12, color: 'var(--kt-text-dark)', fontStyle: 'italic' }}>
                  {question.answer_text}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={onDelete}
          title={deleteTitle}
          style={{
            background: 'none', border: 'none', padding: '4px 8px',
            cursor: 'pointer', borderRadius: 6, color: 'var(--kt-text-muted)',
            fontSize: 16, lineHeight: 1, flexShrink: 0,
            transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--kt-danger)'; e.currentTarget.style.background = 'var(--kt-danger-light)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--kt-text-muted)'; e.currentTarget.style.background = 'none'; }}
        >
          <i className="bi bi-trash3" style={{ fontSize: 14 }} />
        </button>
      </div>
    </div>
  );
}
