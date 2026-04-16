import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { api } from '../api';
import QuestionCard from '../components/QuestionCard';
import AddQuestionForm from '../components/AddQuestionForm';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm]   = useState(false);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.getQuestions()
      .then(data => { if (!data?.error) setQuestions(data); })
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (question) => {
    setQuestions(prev => [question, ...prev]);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this question? It will be removed from all quizlets.')) return;
    const result = await api.deleteQuestion(id);
    if (result?.error) return;
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <>
      {/* Toolbar */}
      <div className="kt-toolbar">
        <div>
          <h1 className="kt-toolbar-title">Questions</h1>
          <div className="kt-breadcrumb">
            <i className="bi bi-house-door" style={{ fontSize: 11 }} />
            <span>Home</span>
            <i className="bi bi-chevron-right" style={{ fontSize: 9 }} />
            <span>Questions</span>
          </div>
        </div>
        <Button
          variant={showForm ? 'light' : 'primary'}
          onClick={() => setShowForm(v => !v)}
        >
          {showForm
            ? <><i className="bi bi-x-lg me-2" />Cancel</>
            : <><i className="bi bi-plus-lg me-2" />Add Question</>}
        </Button>
      </div>

      <div className="kt-content">
        {/* Add question form */}
        {showForm && (
          <AddQuestionForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
        )}

        {/* Question list card */}
        <div className="card">
          <div className="card-header">
            <h5 className="card-header-title">
              <i className="bi bi-collection me-2" style={{ color: 'var(--kt-primary)' }} />
              Question Pool
            </h5>
            <span className="badge" style={{ background: 'var(--kt-primary-light)', color: 'var(--kt-primary)', fontSize: 12 }}>
              {questions.length} {questions.length === 1 ? 'question' : 'questions'}
            </span>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <Spinner animation="border" size="sm" style={{ color: 'var(--kt-primary)' }} />
                <span className="ms-2" style={{ fontSize: 13, color: 'var(--kt-text-muted)' }}>Loading…</span>
              </div>
            ) : questions.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-collection" />
                <p>No questions yet.</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>
                  Click <strong>Add Question</strong> above to create your first question.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {questions.map((q, i) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    index={questions.length - i}
                    onDelete={() => handleDelete(q.id)}
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
