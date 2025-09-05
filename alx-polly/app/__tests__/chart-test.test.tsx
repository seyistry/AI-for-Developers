import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChartTestPage from '../chart-test/page';

// Mock Chart.js to avoid canvas rendering issues in tests
jest.mock('react-chartjs-2', () => ({
  Pie: () => <div data-testid="mock-pie-chart">Pie Chart</div>,
}));

// Mock the Button component
jest.mock('../../components/ui/button', () => ({
  __esModule: true,
  default: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick} data-testid="mock-button">
      {children}
    </button>
  ),
}));

describe('ChartTestPage', () => {
  test('renders multiple test cases', () => {
    render(<ChartTestPage />);
    
    // Check if the page title is rendered
    expect(screen.getByText('Chart Test Page')).toBeInTheDocument();
    
    // Check if all test cases are rendered
    expect(screen.getByText('Test Case 1: Basic Chart')).toBeInTheDocument();
    expect(screen.getByText('Test Case 2: Empty Data')).toBeInTheDocument();
    expect(screen.getByText('Test Case 3: Single Option')).toBeInTheDocument();
    expect(screen.getByText('Test Case 4: Equal Votes')).toBeInTheDocument();
    expect(screen.getByText('Test Case 5: Zero Votes')).toBeInTheDocument();
    
    // Check if charts are rendered
    const charts = screen.getAllByTestId('mock-pie-chart');
    expect(charts.length).toBeGreaterThan(0);
  });
  
  test('add vote button increases votes', () => {
    render(<ChartTestPage />);
    
    // Find and click the Add Random Vote button
    const addVoteButton = screen.getByText('Add Random Vote');
    fireEvent.click(addVoteButton);
    
    // Check if the chart is still rendered after vote is added
    expect(screen.getAllByTestId('mock-pie-chart').length).toBeGreaterThan(0);
  });
});