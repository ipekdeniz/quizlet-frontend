import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddQuestionForm from '../components/AddQuestionForm';
import { api } from '../api';

vi.mock('../api', () => ({
  api: {
    createQuestion: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AddQuestionForm', () => {
  it('starts with multiple_choice type selected by default', () => {
    render(<AddQuestionForm onAdd={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'MC' })).toHaveClass('active');
  });

  it('renders 4 option input fields for multiple_choice type', () => {
    render(<AddQuestionForm onAdd={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getAllByPlaceholderText(/Option \d/)).toHaveLength(4);
  });

  it('shows written answer field when WR type button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddQuestionForm onAdd={vi.fn()} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'WR' }));

    expect(screen.getByPlaceholderText('Enter the correct answer…')).toBeInTheDocument();
  });

  it('does not call api.createQuestion when question text is empty', async () => {
    const user = userEvent.setup();
    render(<AddQuestionForm onAdd={vi.fn()} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /Add Question/ }));

    expect(api.createQuestion).not.toHaveBeenCalled();
  });

  it('submits written form with correct payload and calls onAdd with result', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const created = { id: 1, type: 'written', question_text: 'Q?', answer_text: 'A' };
    api.createQuestion.mockResolvedValue(created);

    render(<AddQuestionForm onAdd={onAdd} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'WR' }));
    await user.type(screen.getByPlaceholderText('Enter the question text…'), 'Q?');
    await user.type(screen.getByPlaceholderText('Enter the correct answer…'), 'A');
    await user.click(screen.getByRole('button', { name: /Add Question/ }));

    await waitFor(() => {
      expect(api.createQuestion).toHaveBeenCalledWith({
        type: 'written',
        question_text: 'Q?',
        answer_text: 'A',
      });
      expect(onAdd).toHaveBeenCalledWith(created);
    });
  });
});
