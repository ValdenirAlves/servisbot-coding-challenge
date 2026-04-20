import React, { useState, useEffect } from 'react';
import { dataService } from './services/dataServices';
import BotDashboard from './views/BotDashboard/BotDashboard';
import './styles/Global.css';

const App = () => {
  const [bots, setBots] = useState([]);
  const [selectedBotId, setSelectedBotId] = useState("");
  const [selectedBotData, setSelectedBotData] = useState(null);
  const [loadingBots, setLoadingBots] = useState(false);
  const [loadingBotDetails, setLoadingBotDetails] = useState(false);
  const [error, setError] = useState(null);

  // Load bots on mount
  useEffect(() => {
    const fetchBots = async () => {
      try {
        setLoadingBots(true);
        const data = await dataService.getBots();
        setBots(data);
      } catch (err) {
        setError('Failed to load bots');
      } finally {
        setLoadingBots(false);
      }
    };

    fetchBots();
  }, []);

  // Load selected bot details
  useEffect(() => {
    if (!selectedBotId) {
      setSelectedBotData(null);
      return;
    }

    const fetchBotDetails = async () => {
      try {
        setLoadingBotDetails(true);
        const data = await dataService.getBotById(selectedBotId);
        setSelectedBotData(data);
      } catch (err) {
        setError('Failed to load bot details');
      } finally {
        setLoadingBotDetails(false);
      }
    };

    fetchBotDetails();
  }, [selectedBotId]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="selector-wrapper">
          <label htmlFor="bot-select">Bots:</label>

          <select
            id="bot-select"
            value={selectedBotId}
            onChange={(e) => setSelectedBotId(e.target.value)}
          >
            <option value="">-- Available Bots --</option>
            {bots.map(bot => (
              <option key={bot.id} value={bot.id}>
                {bot.name} ({bot.status})
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="dashboard-content">
        {loadingBots && <p>Loading bots...</p>}
        {loadingBotDetails && <p>Loading workers...</p>}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loadingBotDetails && !loadingBots && !selectedBotData && (
          <div className="welcome-message">
            <h2>Control Panel</h2>
            <p>Select a Bot from the menu above.</p>
          </div>
        )}

        {!loadingBotDetails && selectedBotData && (
          <BotDashboard bot={selectedBotData} />
        )}
      </main>
    </div>
  );
};

export default App;