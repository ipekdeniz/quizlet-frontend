import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const renderSidebar = (route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Sidebar />
    </MemoryRouter>
  );

describe('Sidebar', () => {
  it('renders all 3 navigation links', () => {
    renderSidebar();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Questions')).toBeInTheDocument();
    expect(screen.getByText('Quizlets')).toBeInTheDocument();
  });

  it('applies active class to the link matching the current route', () => {
    renderSidebar('/questions');

    const questionsLink = screen.getByText('Questions').closest('a');
    expect(questionsLink).toHaveClass('active');
  });
});
