import React, { useEffect, useState } from 'react';
import { dataService } from '../../services/dataServices';
import '../../styles/BotDashboard.css';
import { Badge, LogTable } from '../../components/';

const BotDashboard = ({ bot }) => {
  const [activeTab, setActiveTab] = useState('workers');
  const [selectedWorkerId, setSelectedWorkerId] = useState('all');
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logsError, setLogsError] = useState(null);

  const limit = 10;

  useEffect(() => {
    if (activeTab !== 'logs') return;

    const fetchLogs = async () => {
      try {
        setLoadingLogs(true);
        setLogsError(null);

        const result =
          selectedWorkerId === 'all'
            ? await dataService.getLogsByBotId(bot.id, page, limit)
            : await dataService.getLogsByWorkerId(bot.id, selectedWorkerId, page, limit);

        setLogs(result.data);
        setPagination(result.pagination);
      } catch (error) {
        setLogsError('Failed to load logs');
      } finally {
        setLoadingLogs(false);
      }
    };

    fetchLogs();
  }, [bot.id, activeTab, selectedWorkerId, page]);

  const filteredLogs = selectedWorkerId === 'all'
    ? bot.logs
    : bot.logs.filter(log => log.worker === selectedWorkerId);

  return (
    <div className="bot-dashboard">
      <header className="bot-details-header">
        <h1>{bot.name}</h1>
        <p>{bot.description}</p>
        <Badge status={bot.status} />
      </header>

      {/* Navigation tabs */}
      <nav className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'workers' ? 'active' : ''}`}
          onClick={() => setActiveTab('workers')}
        >
          Workers ({bot.workers.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          Logs ({bot.logs.length})
        </button>
      </nav>

      {/* workers cards and logs */}
      <section className="tab-content">
        {activeTab === 'workers' && (
          bot.workers.length === 0 ? (
            <p>No workers found for this bot.</p>
          ) : (
            <div className="worker-grid">
              {bot.workers.map(worker => (
                <div key={worker.id} className="card worker-card">
                  <h4>{worker.name}</h4>
                  <p>ID: {worker.id}</p>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setSelectedWorkerId(worker.id);
                      setActiveTab('logs');
                    }}
                  >
                    See Worker logs
                  </button>
                </div>
              ))}
            </div>
          )
        )}


        {activeTab === 'logs' && (
          <div className="table-wrapper">
            <div className="filter-bar" style={{ marginBottom: '15px' }}>
              <label>Filter by Worker: </label>
              <select
                className="custom-select"
                value={selectedWorkerId}
                onChange={(e) => {
                  setSelectedWorkerId(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All Bot's logs</option>
                {bot.workers.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            {loadingLogs && <p>Loading logs...</p>}
            {logsError && <p>{logsError}</p>}

            {!loadingLogs && !logsError && logs.length === 0 && (
              <p>
                {selectedWorkerId === 'all'
                  ? 'This bot has no logs.'
                  : 'No logs found for this worker.'}
              </p>
            )}

            {!loadingLogs && !logsError && logs.length > 0 && (
              <>
                <LogTable logs={logs} />

                {pagination && (
                  <div className="pagination-controls">
                    <button
                      className="btn btn-outline"
                      disabled={!pagination.hasPreviousPage}
                      onClick={() => setPage(prev => prev - 1)}
                    >
                      Previous
                    </button>

                    <span>
                      Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <button
                      className="btn btn-outline"
                      disabled={!pagination.hasNextPage}
                      onClick={() => setPage(prev => prev + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default BotDashboard