import { api } from '../api';

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getQuestions', () => {
  it('sends GET to /api/questions and returns parsed JSON', async () => {
    const data = [{ id: 1, type: 'written', question_text: 'Q?' }];
    global.fetch.mockResolvedValue({
      status: 200,
      json: vi.fn().mockResolvedValue(data),
    });

    const result = await api.getQuestions();

    expect(fetch).toHaveBeenCalledWith('/api/questions', {});
    expect(result).toEqual(data);
  });

  it('returns null when response status is 204', async () => {
    global.fetch.mockResolvedValue({ status: 204 });

    const result = await api.getQuestions();

    expect(result).toBeNull();
  });
});

describe('createQuestion', () => {
  it('sends POST with JSON body and correct Content-Type header', async () => {
    const payload = { type: 'written', question_text: 'Q?', answer_text: 'A' };
    const created = { id: 1, ...payload };
    global.fetch.mockResolvedValue({
      status: 201,
      json: vi.fn().mockResolvedValue(created),
    });

    const result = await api.createQuestion(payload);

    expect(fetch).toHaveBeenCalledWith('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(created);
  });
});

describe('getQuestionStats', () => {
  it('sends GET to /api/questions/stats and returns parsed JSON', async () => {
    const data = { multiple_choice: 2, true_false: 1, written: 3, total: 6 };
    global.fetch.mockResolvedValue({
      status: 200,
      json: vi.fn().mockResolvedValue(data),
    });

    const result = await api.getQuestionStats();

    expect(fetch).toHaveBeenCalledWith('/api/questions/stats', {});
    expect(result).toEqual(data);
  });
});

describe('deleteQuestion', () => {
  it('sends DELETE to /api/questions/:id and returns null', async () => {
    global.fetch.mockResolvedValue({ status: 204 });

    const result = await api.deleteQuestion(42);

    expect(fetch).toHaveBeenCalledWith('/api/questions/42', { method: 'DELETE' });
    expect(result).toBeNull();
  });
});
