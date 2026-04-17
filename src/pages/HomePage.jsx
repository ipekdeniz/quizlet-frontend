import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api';
import QuestionStatsChart from '../components/QuestionStatsChart';

export default function HomePage() {
  const [stats, setStats] = useState({ questions: 0, quizlets: 0 });
  const [loaded, setLoaded] = useState(false);
  const [questionStats, setQuestionStats] = useState(null);

  useEffect(() => {
    Promise.all([api.getQuestions(), api.getQuizlets(), api.getQuestionStats()]).then(([qs, qls, typeStats]) => {
      setStats({ questions: qs.length, quizlets: qls.length });
      setQuestionStats(typeStats?.error ? null : typeStats);
      setLoaded(true);
    });
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      {/* Toolbar */}
      <div className="kt-toolbar">
        <div>
          <h1 className="kt-toolbar-title">Dashboard</h1>
          <div className="kt-breadcrumb">
            <i className="bi bi-house-door" style={{ fontSize: 11 }} />
            <span>Home</span>
            <i className="bi bi-chevron-right" style={{ fontSize: 9 }} />
            <span>Dashboard</span>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--kt-text-muted)' }}>
          <i className="bi bi-calendar3 me-1" />
          {today}
        </div>
      </div>

      <div className="kt-content">
        {/* Stats Row */}
        <div className="row g-4 mb-5">
          {/* Questions stat */}
          <div className="col-sm-6 col-xl-4">
            <div className="stat-card fade-in">
              <div className="d-flex align-items-start justify-content-between">
                <div className="flex-grow-1">
                  <div className="stat-label">Total Questions</div>
                  <div className="stat-value">{loaded ? stats.questions : '–'}</div>
                  <div className="stat-desc">Questions available in the pool</div>
                </div>
                <div className="stat-icon" style={{ background: 'var(--kt-primary-light)', color: 'var(--kt-primary)' }}>
                  <i className="bi bi-collection" />
                </div>
              </div>
              <div className="separator" />
              <Link to="/questions" style={{ fontSize: 12, color: 'var(--kt-primary)', textDecoration: 'none', fontWeight: 500 }}>
                View Questions <i className="bi bi-arrow-right ms-1" />
              </Link>
            </div>
          </div>

          {/* Quizlets stat */}
          <div className="col-sm-6 col-xl-4">
            <div className="stat-card fade-in">
              <div className="d-flex align-items-start justify-content-between">
                <div className="flex-grow-1">
                  <div className="stat-label">Total Quizlets</div>
                  <div className="stat-value">{loaded ? stats.quizlets : '–'}</div>
                  <div className="stat-desc">Quiz collections created</div>
                </div>
                <div className="stat-icon" style={{ background: 'var(--kt-warning-light)', color: 'var(--kt-warning)' }}>
                  <i className="bi bi-journal-bookmark" />
                </div>
              </div>
              <div className="separator" />
              <Link to="/quizlets" style={{ fontSize: 12, color: 'var(--kt-primary)', textDecoration: 'none', fontWeight: 500 }}>
                View Quizlets <i className="bi bi-arrow-right ms-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h5 className="card-header-title">
              <i className="bi bi-lightning-charge me-2" style={{ color: 'var(--kt-warning)' }} />
              Quick Actions
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-sm-6 col-md-4">
                <Link to="/questions" className="btn btn-primary w-100" style={{ padding: '12px 16px' }}>
                  <i className="bi bi-plus-circle me-2" />
                  Add Question
                </Link>
              </div>
              <div className="col-sm-6 col-md-4">
                <Link to="/quizlets" className="btn btn-light w-100" style={{ padding: '12px 16px' }}>
                  <i className="bi bi-journal-plus me-2" />
                  Create Quizlet
                </Link>
              </div>
            </div>
          </div>
        </div>

        <QuestionStatsChart stats={questionStats} />
      </div>
    </>
  );
}
