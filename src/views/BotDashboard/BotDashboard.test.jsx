import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import BotDashboard from './BotDashboard';

vi.mock('../../services/dataServices', () => ({
  dataService: {
    getLogsByBotId: vi.fn(),
    getLogsByWorkerId: vi.fn(),
  },
}));

import { dataService } from '../../services/dataServices';

const emptyPaginationResult = {
  data: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  dataService.getLogsByBotId.mockResolvedValue(emptyPaginationResult);
  dataService.getLogsByWorkerId.mockResolvedValue(emptyPaginationResult);
});

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

  it('should show empty state when there are no logs', async () => {
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

    await waitFor(() => {
      expect(
        screen.getByText(/this bot has no logs/i)
      ).toBeInTheDocument();
    });
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

  it('should render logs when logs exist', async () => {
    dataService.getLogsByBotId.mockResolvedValue({
      data: [
        {
          id: 'log-1',
          created: '2024-04-22T14:14:14.926Z',
          message: 'Test log message',
          worker: 'worker-1',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });

    const bot = {
      id: '1',
      name: 'Bot One',
      description: 'Test bot',
      status: 'ENABLED',
      workers: [],
      logs: [],
    };

    render(<BotDashboard bot={bot} />);

    fireEvent.click(screen.getByRole('button', { name: /logs/i }));

    await waitFor(() => {
      expect(screen.getByText(/test log message/i)).toBeInTheDocument();
    });
  });
});