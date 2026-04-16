import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { api } from '../api';
import QuestionCard from '../components/QuestionCard';

const TYPE_META = {
  multiple_choice: { short: 'MC', badgeClass: 'badge-mc', icon: 'bi-ui-radios'  },
  true_false:      { short: 'TF', badgeClass: 'badge-tf', icon: 'bi-toggle-on'  },
  written:         { short: 'WR', badgeClass: 'badge-wr', icon: 'bi-pencil'     },
};

export default function QuizletDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizlet, setQuizlet]       = useState(null);
  const [questions, setQuestions]   = useState([]);
  const [pool, setPool]             = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      api.getQuizlets(),
      api.getQuizletQuestions(id),
      api.getQuestions(),
    ]).then(([quizlets, qqs, allQs]) => {
      if (quizlets?.error || qqs?.error || allQs?.error) return;
      setQuizlet(quizlets.find(q => q.id === Number(id)) ?? null);
      setQuestions(qqs);
      setPool(allQs);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async (questionId) => {
    const result = await api.addToQuizlet(id, questionId);
    if (!result || result?.error) return;
    const added = pool.find(q => q.id === questionId);
    if (added) setQuestions(prev => [...prev, added]);
  };

  const handleRemove = async (questionId) => {
    const result = await api.removeFromQuizlet(id, questionId);
    if (result?.error) return;
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  if (loading) return (
    <>
      <div className="kt-toolbar">
        <div><h1 className="kt-toolbar-title">Quizlet Detail</h1></div>
      </div>
      <div className="kt-content d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" size="sm" style={{ color: 'var(--kt-primary)' }} />
        <span className="ms-2" style={{ fontSize: 13, color: 'var(--kt-text-muted)' }}>Loading…</span>
      </div>
    </>
  );

  if (!quizlet) return (
    <>
      <div className="kt-toolbar">
        <div><h1 className="kt-toolbar-title">Quizlet Detail</h1></div>
      </div>
      <div className="kt-content">
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <i className="bi bi-journal-x" style={{ color: 'var(--kt-danger)' }} />
              <p style={{ color: 'var(--kt-danger)' }}>Quizlet not found.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const inIds     = new Set(questions.map(q => q.id));
  const available = pool.filter(q => !inIds.has(q.id));

  return (
    <>
      {/* Toolbar */}
      <div className="kt-toolbar">
        <div>
          <h1 className="kt-toolbar-title">{quizlet.title}</h1>
          <div className="kt-breadcrumb">
            <i className="bi bi-house-door" style={{ fontSize: 11 }} />
            <span>Home</span>
            <i className="bi bi-chevron-right" style={{ fontSize: 9 }} />
            <button
              onClick={() => navigate('/quizlets')}
              style={{ background: 'none', border: 'none', padding: 0, color: 'var(--kt-text-muted)', fontSize: 12, cursor: 'pointer' }}
            >
              Quizlets
            </button>
            <i className="bi bi-chevron-right" style={{ fontSize: 9 }} />
            <span>{quizlet.title}</span>
          </div>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant={showPicker ? 'light' : 'primary'}
            onClick={() => setShowPicker(v => !v)}
          >
            {showPicker
              ? <><i className="bi bi-x-lg me-2" />Close</>
              : <><i className="bi bi-plus-lg me-2" />Add Question</>}
          </Button>
          <Button variant="light" onClick={() => navigate('/quizlets')}>
            <i className="bi bi-arrow-left me-2" />Back
          </Button>
        </div>
      </div>

      <div className="kt-content">
        {/* Quizlet info card */}
        <div className="card mb-4 fade-in">
          <div className="card-body">
            <div className="d-flex align-items-start gap-3">
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: 'var(--kt-warning-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <i className="bi bi-journal-bookmark" style={{ color: '#b07d00', fontSize: 22 }} />
              </div>
              <div className="flex-grow-1">
                <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{quizlet.title}</h4>
                {quizlet.description && (
                  <p style={{ fontSize: 13, color: 'var(--kt-text-muted)', marginBottom: 10 }}>
                    {quizlet.description}
                  </p>
                )}
                <div className="d-flex gap-3">
                  <span style={{ fontSize: 12, color: 'var(--kt-text-muted)' }}>
                    <i className="bi bi-collection me-1" />
                    <strong style={{ color: 'var(--kt-text-dark)' }}>{questions.length}</strong>{' '}
                    {questions.length === 1 ? 'question' : 'questions'} in this quizlet
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--kt-text-muted)' }}>
                    <i className="bi bi-database me-1" />
                    <strong style={{ color: 'var(--kt-text-dark)' }}>{pool.length}</strong> in pool
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question picker */}
        {showPicker && (
          <div className="card mb-4 fade-in">
            <div className="card-header">
              <h5 className="card-header-title">
                <i className="bi bi-plus-circle me-2" style={{ color: 'var(--kt-primary)' }} />
                Add from Question Pool
              </h5>
              <span style={{ fontSize: 12, color: 'var(--kt-text-muted)' }}>
                {available.length} available
              </span>
            </div>
            <div className="card-body">
              {available.length === 0 ? (
                <div className="empty-state" style={{ padding: '24px 0' }}>
                  <i className="bi bi-check-circle-fill" style={{ color: 'var(--kt-success)', fontSize: 28 }} />
                  <p>
                    {pool.length === 0
                      ? 'The question pool is empty. Add questions from the Questions page.'
                      : 'All questions have been added to this quizlet.'}
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2" style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {available.map(q => {
                    const tm = TYPE_META[q.type] ?? { short: '?', badgeClass: '', icon: 'bi-question' };
                    return (
                      <div
                        key={q.id}
                        className="d-flex align-items-center justify-content-between gap-3"
                        style={{
                          padding: '10px 14px', border: '1px solid var(--kt-border-color)',
                          borderRadius: 8, background: '#fafafa',
                        }}
                      >
                        <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ minWidth: 0 }}>
                          <span className={`badge ${tm.badgeClass}`} style={{ flexShrink: 0 }}>{tm.short}</span>
                          <span style={{
                            fontSize: 12, color: 'var(--kt-text-dark)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {q.question_text}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAdd(q.id)}
                          style={{
                            background: 'var(--kt-primary-light)', border: 'none',
                            color: 'var(--kt-primary)', padding: '5px 12px',
                            borderRadius: 6, fontSize: 12, fontWeight: 600,
                            cursor: 'pointer', flexShrink: 0,
                            transition: 'background 0.15s, color 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--kt-primary)'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'var(--kt-primary-light)'; e.currentTarget.style.color = 'var(--kt-primary)'; }}
                        >
                          <i className="bi bi-plus me-1" />Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Questions list */}
        <div className="card">
          <div className="card-header">
            <h5 className="card-header-title">
              <i className="bi bi-list-check me-2" style={{ color: 'var(--kt-primary)' }} />
              Questions in this Quizlet
            </h5>
            <span className="badge" style={{ background: 'var(--kt-primary-light)', color: 'var(--kt-primary)', fontSize: 12 }}>
              {questions.length} {questions.length === 1 ? 'question' : 'questions'}
            </span>
          </div>
          <div className="card-body">
            {questions.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-journal-text" />
                <p>No questions added to this quizlet yet.</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>
                  Click <strong>Add Question</strong> to pick from the pool.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {questions.map((q, i) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    index={i + 1}
                    onDelete={() => handleRemove(q.id)}
                    deleteTitle="Remove from quizlet"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
