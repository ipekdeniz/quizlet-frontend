import { render, screen, fireEvent } from '@testing-library/react';
import QuestionCard from '../components/QuestionCard';

const writtenQuestion = {
  id: 1,
  type: 'written',
  question_text: 'What is 2+2?',
  answer_text: '4',
};

const trueFalseQuestion = {
  id: 2,
  type: 'true_false',
  question_text: 'Is the sky blue?',
  correct_answer: true,
};

const mcQuestion = {
  id: 3,
  type: 'multiple_choice',
  question_text: 'Capital of France?',
  options: [
    { id: 1, option_text: 'Paris',  is_correct: 1 },
    { id: 2, option_text: 'Berlin', is_correct: 0 },
    { id: 3, option_text: 'London', is_correct: 0 },
    { id: 4, option_text: 'Madrid', is_correct: 0 },
  ],
};

describe('QuestionCard', () => {
  it('renders written question with answer_text', () => {
    render(<QuestionCard question={writtenQuestion} index={1} onDelete={() => {}} />);

    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders true_false question with correct answer badge', () => {
    render(<QuestionCard question={trueFalseQuestion} index={2} onDelete={() => {}} />);

    expect(screen.getByText('Is the sky blue?')).toBeInTheDocument();
    expect(screen.getByText('✓ True')).toBeInTheDocument();
  });

  it('renders multiple_choice question with all 4 options', () => {
    render(<QuestionCard question={mcQuestion} index={3} onDelete={() => {}} />);

    expect(screen.getByText('Capital of France?')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Madrid')).toBeInTheDocument();
  });

  it('renders type badge label for each question type', () => {
    const { rerender } = render(
      <QuestionCard question={writtenQuestion} index={1} onDelete={() => {}} />
    );
    expect(screen.getByText('Written')).toBeInTheDocument();

    rerender(<QuestionCard question={trueFalseQuestion} index={2} onDelete={() => {}} />);
    expect(screen.getByText('True / False')).toBeInTheDocument();

    rerender(<QuestionCard question={mcQuestion} index={3} onDelete={() => {}} />);
    expect(screen.getByText('Multiple Choice')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<QuestionCard question={writtenQuestion} index={1} onDelete={onDelete} />);

    fireEvent.click(screen.getByTitle('Delete question'));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
