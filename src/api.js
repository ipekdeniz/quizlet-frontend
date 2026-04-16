const BASE = '/api';

async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE}${path}`, options);
    if (res.status === 204) return null;
    const data = await res.json();
    if (!res.ok) return { error: data?.error ?? `Request failed (${res.status})` };
    return data;
  } catch {
    return { error: 'Network error. Please check your connection.' };
  }
}

const json = (data) => ({
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

export const api = {
  // Question pool
  getQuestions: () => request('/questions'),
  createQuestion: (data) => request('/questions', { method: 'POST', ...json(data) }),
  deleteQuestion: (id) => request(`/questions/${id}`, { method: 'DELETE' }),

  // Quizlets
  getQuizlets: () => request('/quizlets'),
  createQuizlet: (data) => request('/quizlets', { method: 'POST', ...json(data) }),
  deleteQuizlet: (id) => request(`/quizlets/${id}`, { method: 'DELETE' }),

  // Questions inside a quizlet
  getQuizletQuestions: (quizletId) => request(`/quizlets/${quizletId}/questions`),
  addToQuizlet: (quizletId, questionId) =>
    request(`/quizlets/${quizletId}/questions`, { method: 'POST', ...json({ question_id: questionId }) }),
  removeFromQuizlet: (quizletId, questionId) =>
    request(`/quizlets/${quizletId}/questions/${questionId}`, { method: 'DELETE' }),
};
