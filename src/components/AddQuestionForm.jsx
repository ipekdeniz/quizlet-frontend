import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { api } from '../api';

const TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice', short: 'MC' },
  { value: 'true_false',      label: 'True / False',    short: 'TF' },
  { value: 'written',         label: 'Written Answer',  short: 'WR' },
];

const EMPTY_OPTIONS = [
  { option_text: '', is_correct: true  },
  { option_text: '', is_correct: false },
  { option_text: '', is_correct: false },
  { option_text: '', is_correct: false },
];

function MultipleChoiceFields({ options, onChange }) {
  const setOptionText = (i, text) =>
    onChange(options.map((o, idx) => (idx === i ? { ...o, option_text: text } : o)));
  const setCorrect = (i) =>
    onChange(options.map((o, idx) => ({ ...o, is_correct: idx === i })));

  return (
    <div>
      <Form.Label>
        Options <span style={{ color: 'var(--kt-text-muted)', fontWeight: 400 }}>(mark the correct answer)</span>
      </Form.Label>
      <div className="d-flex flex-column gap-2">
        {options.map((opt, i) => (
          <div key={i} className="mc-option">
            <button
              type="button"
              className={`mc-check ${opt.is_correct ? 'checked' : ''}`}
              onClick={() => setCorrect(i)}
              title="Mark as correct answer"
            >
              {opt.is_correct ? '✓' : ''}
            </button>
            <Form.Control
              type="text"
              value={opt.option_text}
              onChange={e => setOptionText(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AddQuestionForm({ onAdd, onCancel }) {
  const [type, setType]             = useState('multiple_choice');
  const [questionText, setQt]       = useState('');
  const [options, setOptions]       = useState(EMPTY_OPTIONS);
  const [tfAnswer, setTfAnswer]     = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [error, setError]           = useState('');
  const [submitting, setSubmitting] = useState(false);

  const switchType = (t) => { setType(t); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!questionText.trim()) { setError('Question text is required.'); return; }

    const payload = { type, question_text: questionText };
    if (type === 'multiple_choice') {
      if (options.some(o => !o.option_text.trim())) { setError('All 4 options must be filled in.'); return; }
      payload.options = options;
    } else if (type === 'true_false') {
      payload.correct_answer = tfAnswer;
    } else {
      if (!answerText.trim()) { setError('Answer text is required.'); return; }
      payload.answer_text = answerText;
    }

    setSubmitting(true);
    try {
      const result = await api.createQuestion(payload);
      if (result?.error) setError(result.error);
      else onAdd(result);
    } catch {
      setError('Failed to add question. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card mb-4 fade-in">
      <div className="card-header">
        <h5 className="card-header-title">
          <i className="bi bi-plus-circle me-2" style={{ color: 'var(--kt-primary)' }} />
          New Question
        </h5>
        {/* Type selector */}
        <div className="d-flex gap-2">
          {TYPES.map(t => (
            <button
              key={t.value}
              type="button"
              className={`type-btn ${type === t.value ? 'active' : ''}`}
              onClick={() => switchType(t.value)}
            >
              {t.short}
            </button>
          ))}
        </div>
      </div>

      <div className="card-body">
        <Form onSubmit={handleSubmit}>
          {/* Question text */}
          <Form.Group className="mb-4">
            <Form.Label>Question Text <span style={{ color: 'var(--kt-danger)' }}>*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={questionText}
              onChange={e => setQt(e.target.value)}
              placeholder="Enter the question text…"
              autoFocus
            />
          </Form.Group>

          {/* Type-specific fields */}
          {type === 'multiple_choice' && (
            <div className="mb-4">
              <MultipleChoiceFields options={options} onChange={setOptions} />
            </div>
          )}

          {type === 'true_false' && (
            <Form.Group className="mb-4">
              <Form.Label>Correct Answer</Form.Label>
              <div className="d-flex gap-3">
                {[true, false].map(val => (
                  <button
                    key={String(val)}
                    type="button"
                    className={`type-btn ${tfAnswer === val ? 'active' : ''}`}
                    onClick={() => setTfAnswer(val)}
                    style={{ minWidth: 80 }}
                  >
                    <i className={`bi bi-${val ? 'check-circle' : 'x-circle'} me-1`} />
                    {val ? 'True' : 'False'}
                  </button>
                ))}
              </div>
            </Form.Group>
          )}

          {type === 'written' && (
            <Form.Group className="mb-4">
              <Form.Label>Answer Text <span style={{ color: 'var(--kt-danger)' }}>*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={answerText}
                onChange={e => setAnswerText(e.target.value)}
                placeholder="Enter the correct answer…"
              />
            </Form.Group>
          )}

          {error && (
            <Alert variant="danger" style={{ fontSize: 12, padding: '10px 14px', borderRadius: 8 }}>
              <i className="bi bi-exclamation-triangle me-2" />
              {error}
            </Alert>
          )}

          <div className="d-flex gap-2 pt-2" style={{ borderTop: '1px solid var(--kt-border-color)' }}>
            <Button type="submit" variant="primary" disabled={submitting} style={{ marginTop: 12 }}>
              {submitting
                ? <><i className="bi bi-hourglass-split me-1" />Adding…</>
                : <><i className="bi bi-check2 me-1" />Add Question</>}
            </Button>
            <Button type="button" variant="light" onClick={onCancel} style={{ marginTop: 12 }}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
