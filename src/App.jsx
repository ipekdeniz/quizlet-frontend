import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import QuestionsPage from './pages/QuestionsPage';
import QuizletsPage from './pages/QuizletsPage';
import QuizletDetailPage from './pages/QuizletDetailPage';

export default function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="kt-wrapper">
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/questions"    element={<QuestionsPage />} />
          <Route path="/quizlets"     element={<QuizletsPage />} />
          <Route path="/quizlets/:id" element={<QuizletDetailPage />} />
        </Routes>
      </div>
    </div>
  );
}
