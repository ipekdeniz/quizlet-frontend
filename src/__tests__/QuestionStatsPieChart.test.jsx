import { render, screen } from '@testing-library/react';
import QuestionStatsPieChart from '../components/QuestionStatsPieChart';

vi.mock('react-apexcharts', () => ({
  default: () => <div data-testid="apex-chart" />,
}));

describe('QuestionStatsPieChart', () => {
  it('shows empty state when stats is null', () => {
    render(<QuestionStatsPieChart stats={null} />);

    expect(screen.getByText('No questions yet')).toBeInTheDocument();
  });

  it('shows empty state when total is zero', () => {
    render(<QuestionStatsPieChart stats={{ multiple_choice: 0, true_false: 0, written: 0, total: 0 }} />);

    expect(screen.getByText('No questions yet')).toBeInTheDocument();
  });

  it('renders the Question Types card header when stats has data', () => {
    render(<QuestionStatsPieChart stats={{ multiple_choice: 2, true_false: 1, written: 3, total: 6 }} />);

    expect(screen.getByText('Question Types')).toBeInTheDocument();
  });

  it('renders the chart when stats has data', () => {
    render(<QuestionStatsPieChart stats={{ multiple_choice: 2, true_false: 1, written: 3, total: 6 }} />);

    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('does not show empty state when stats has data', () => {
    render(<QuestionStatsPieChart stats={{ multiple_choice: 1, true_false: 0, written: 0, total: 1 }} />);

    expect(screen.queryByText('No questions yet')).not.toBeInTheDocument();
  });
});
