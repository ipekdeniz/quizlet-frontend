import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Spinner, Alert } from 'react-bootstrap';
import { api } from '../api';

export default function QuizletsPage() {
  const [quizlets, setQuizlets]   = useState([]);
  const [showForm, setShowForm]   = useState(false);
  const [title, setTitle]         = useState('');
  const [description, setDesc]    = useState('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.getQuizlets()
      .then(data => { if (!data?.error) setQuizlets(data); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const result = await api.createQuizlet({ title, description });
    if (result?.error) { setError(result.error); return; }
    setQuizlets(prev => [{ ...result, question_count: 0 }, ...prev]);
    setTitle(''); setDesc(''); setShowForm(false); setError('');
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this quizlet?')) return;
    const result = await api.deleteQuizlet(id);
    if (result?.error) return;
    setQuizlets(prev => prev.filter(q => q.id !== id));
  };

  return (
    <>
      {/* Toolbar */}
      <div className="kt-toolbar">
        <div>
          <h1 className="kt-toolbar-title">Quizlets</h1>
          <div className="kt-breadcrumb">
            <i className="bi bi-house-door" style={{ fontSize: 11 }} />
            <span>Home</span>
            <i className="bi bi-chevron-right" style={{ fontSize: 9 }} />
            <span>Quizlets</span>
          </div>
        </div>
        <Button
          variant={showForm ? 'light' : 'primary'}
          onClick={() => { setShowForm(v => !v); setError(''); }}
        >
          {showForm
            ? <><i className="bi bi-x-lg me-2" />Cancel</>
            : <><i className="bi bi-plus-lg me-2" />New Quizlet</>}
        </Button>
      </div>

      <div className="kt-content">
        {/* Create form */}
        {showForm && (
          <div className="card mb-4 fade-in">
            <div className="card-header">
              <h5 className="card-header-title">
                <i className="bi bi-journal-plus me-2" style={{ color: 'var(--kt-primary)' }} />
                Create New Quizlet
              </h5>
            </div>
            <div className="card-body">
              <Form onSubmit={handleCreate}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Title <span style={{ color: 'var(--kt-danger)' }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Quizlet title…"
                    autoFocus
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>
                    Description{' '}
                    <span style={{ fontSize: 11, color: 'var(--kt-text-muted)', fontWeight: 400 }}>(optional)</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={description}
                    onChange={e => setDesc(e.target.value)}
                    placeholder="Add a short description…"
                  />
                </Form.Group>
                {error && (
                  <Alert variant="danger" style={{ fontSize: 12, padding: '10px 14px', borderRadius: 8 }}>
                    <i className="bi bi-exclamation-triangle me-2" />
                    {error}
                  </Alert>
                )}
                <div className="d-flex gap-2 pt-2" style={{ borderTop: '1px solid var(--kt-border-color)' }}>
                  <Button type="submit" variant="primary" style={{ marginTop: 12 }}>
                    <i className="bi bi-check2 me-2" />Create
                  </Button>
                  <Button
                    type="button"
                    variant="light"
                    style={{ marginTop: 12 }}
                    onClick={() => { setShowForm(false); setError(''); }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        )}

        {/* Quizlet list card */}
        <div className="card">
          <div className="card-header">
            <h5 className="card-header-title">
              <i className="bi bi-journal-bookmark me-2" style={{ color: 'var(--kt-warning)' }} />
              Collections
            </h5>
            <span className="badge" style={{ background: 'var(--kt-warning-light)', color: '#b07d00', fontSize: 12 }}>
              {quizlets.length} {quizlets.length === 1 ? 'quizlet' : 'quizlets'}
            </span>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <Spinner animation="border" size="sm" style={{ color: 'var(--kt-primary)' }} />
                <span className="ms-2" style={{ fontSize: 13, color: 'var(--kt-text-muted)' }}>Loading…</span>
              </div>
            ) : quizlets.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-journal-bookmark" />
                <p>No quizlets yet.</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>
                  Click <strong>New Quizlet</strong> to create your first collection.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {quizlets.map((quizlet) => (
                  <div
                    key={quizlet.id}
                    className="quizlet-item fade-in"
                    onClick={() => navigate(`/quizlets/${quizlet.id}`)}
                  >
                    <div className="d-flex align-items-start gap-3">
                      {/* Icon */}
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: 'var(--kt-warning-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <i className="bi bi-journal-bookmark" style={{ color: '#b07d00', fontSize: 17 }} />
                      </div>

                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <h6 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--kt-text-dark)' }}>
                            {quizlet.title}
                          </h6>
                          <button
                            onClick={e => handleDelete(quizlet.id, e)}
                            title="Delete"
                            style={{
                              background: 'none', border: 'none', padding: '4px 8px',
                              cursor: 'pointer', borderRadius: 6, color: 'var(--kt-text-muted)',
                              fontSize: 14, lineHeight: 1, flexShrink: 0,
                              transition: 'color 0.15s, background 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--kt-danger)'; e.currentTarget.style.background = 'var(--kt-danger-light)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--kt-text-muted)'; e.currentTarget.style.background = 'none'; }}
                          >
                            <i className="bi bi-trash3" />
                          </button>
                        </div>
                        {quizlet.description && (
                          <p style={{ fontSize: 12, color: 'var(--kt-text-muted)', margin: '3px 0 6px', lineHeight: 1.4 }}>
                            {quizlet.description}
                          </p>
                        )}
                        <div className="d-flex align-items-center gap-3">
                          <span style={{ fontSize: 12, color: 'var(--kt-text-muted)' }}>
                            <i className="bi bi-collection me-1" />
                            {quizlet.question_count} {quizlet.question_count === 1 ? 'question' : 'questions'}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--kt-primary)' }}>
                            View <i className="bi bi-arrow-right ms-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
