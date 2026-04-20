import React, { useState } from 'react';
import '../../styles/BotDashboard.css';
import { Badge, LogTable } from '../../components/';

const BotDashboard = ({ bot }) => {
  const [activeTab, setActiveTab] = useState('workers'); // 'workers' or 'logs'
  const [selectedWorkerId, setSelectedWorkerId] = useState('all');

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
                    See this Worker logs
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
                onChange={(e) => setSelectedWorkerId(e.target.value)}
              >
                <option value="all">All Bot's logs</option>
                {bot.workers.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            {filteredLogs.length === 0 ? (
              <p>
                {selectedWorkerId === 'all'
                  ? "This bot has no logs."
                  : "No logs found for this worker."}
              </p>
            ) : (
              <LogTable logs={filteredLogs} />
            )}

          </div>
        )}
      </section>
    </div>
  );
};

export default BotDashboard