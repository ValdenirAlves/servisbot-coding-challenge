import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BotDashboard from './BotDashboard';

describe('BotDashboard', () => {
  it('should show empty state when there are no workers', () => {
    const bot = {
      id: '1',
      name: 'Bot Four',
      description: 'Test bot with no workers',
      status: 'ENABLED',
      workers: [],
      logs: [],
    };

    render(<BotDashboard bot={bot} />);

    expect(
      screen.getByText(/no workers found for this bot/i)
    ).toBeInTheDocument();
  });

  it('should show empty state when there are no logs', () => {
    const bot = {
      id: '1',
      name: 'Bot Four',
      description: 'Test bot with no logs',
      status: 'ENABLED',
      workers: [],
      logs: [],
    };

    render(<BotDashboard bot={bot} />);

    fireEvent.click(screen.getByRole('button', { name: /logs/i }));

    expect(
      screen.getByText(/this bot has no logs|no logs found for this selection/i)
    ).toBeInTheDocument();
  });

  it('should render workers when workers exist', () => {
    const bot = {
      id: '1',
      name: 'Bot One',
      description: 'Test bot',
      status: 'ENABLED',
      workers: [
        {
          id: 'worker-1',
          name: 'Worker One',
          description: 'First worker',
        },
      ],
      logs: [],
    };

    render(<BotDashboard bot={bot} />);

    expect(screen.getByText(/worker one/i)).toBeInTheDocument();
  });

  it('should render logs when logs exist', () => {
    const bot = {
      id: '1',
      name: 'Bot One',
      description: 'Test bot',
      status: 'ENABLED',
      workers: [],
      logs: [
        {
          id: 'log-1',
          created: '2024-04-22T14:14:14.926Z',
          message: 'Test log message',
          worker: 'worker-1',
        },
      ],
    };

    render(<BotDashboard bot={bot} />);

    fireEvent.click(screen.getByRole('button', { name: /logs/i }));

    expect(screen.getByText(/test log message/i)).toBeInTheDocument();
  });
});