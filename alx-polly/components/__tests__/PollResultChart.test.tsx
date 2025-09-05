import React from 'react';
import { render, screen } from '@testing-library/react';
import PollResultChart from '../PollResultChart';

// Mock Chart.js to avoid canvas rendering issues in tests
jest.mock('react-chartjs-2', () => ({
  Pie: ({ data, options }) => (
    <div data-testid="mock-pie-chart" data-labels={JSON.stringify(data.labels)} data-title={options?.plugins?.title?.text}>
      Pie Chart
    </div>
  ),
}));

describe('PollResultChart Component', () => {
  const mockOptions = [
    { id: '1', text: 'Option 1', votes: 5 },
    { id: '2', text: 'Option 2', votes: 10 },
    { id: '3', text: 'Option 3', votes: 3 },
  ];

  test('renders chart with provided options and title', () => {
    render(<PollResultChart options={mockOptions} title="Test Poll" />);
    
    // Check if chart is rendered
    const chart = screen.getByTestId('mock-pie-chart');
    expect(chart).toBeInTheDocument();
    
    // Verify labels are passed correctly
    const labels = JSON.parse(chart.getAttribute('data-labels') || '[]');
    expect(labels).toHaveLength(3);
    expect(labels).toContain('Option 1');
    expect(labels).toContain('Option 2');
    expect(labels).toContain('Option 3');
    
    // Verify title is passed correctly
    expect(chart.getAttribute('data-title')).toBe('Test Poll');
  });

  test('displays empty state when no options are provided', () => {
    render(<PollResultChart options={[]} />);
    
    expect(screen.getByText('No data available to display')).toBeInTheDocument();
    expect(screen.getByText('Chart will appear when poll options are added')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-pie-chart')).not.toBeInTheDocument();
  });

  test('handles case when all votes are zero', () => {
    const noVotesOptions = [
      { id: '1', text: 'Option 1', votes: 0 },
      { id: '2', text: 'Option 2', votes: 0 },
    ];
    
    render(<PollResultChart options={noVotesOptions} />);
    
    // Chart should still render
    const chart = screen.getByTestId('mock-pie-chart');
    expect(chart).toBeInTheDocument();
    
    // Should show the message about equal segments
    expect(screen.getByText('Chart shows equal segments until votes are cast')).toBeInTheDocument();
    
    // Verify title includes "No Votes Yet"
    expect(chart.getAttribute('data-title')).toContain('(No Votes Yet)');
  });

  test('renders with default title when no title is provided', () => {
    render(<PollResultChart options={mockOptions} />);
    
    // Default title should be used
    const chart = screen.getByTestId('mock-pie-chart');
    expect(chart).toBeInTheDocument();
    expect(chart.getAttribute('data-title')).toBe('Poll Results');
  });
  
  test('handles undefined options gracefully', () => {
    // @ts-ignore - Testing invalid props
    render(<PollResultChart options={undefined} />);
    
    expect(screen.getByText('No data available to display')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-pie-chart')).not.toBeInTheDocument();
  });
  
  test('handles single option with votes', () => {
    const singleOption = [{ id: '1', text: 'Only Option', votes: 42 }];
    
    render(<PollResultChart options={singleOption} />);
    
    const chart = screen.getByTestId('mock-pie-chart');
    expect(chart).toBeInTheDocument();
    
    // Verify labels
    const labels = JSON.parse(chart.getAttribute('data-labels') || '[]');
    expect(labels).toHaveLength(1);
    expect(labels[0]).toBe('Only Option');
  });
});