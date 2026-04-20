import React from 'react';

/**
 * Displays a status badge based on the bot state.
 * Keeps styling logic centralized and consistent across the UI.
 */
const Badge = ({ status }) => {
  const statusText = status ? String(status) : '';
  const statusClass = `badge-${statusText.toLowerCase()}`;

  return (
    <span className={`badge ${statusClass}`}>
      {statusText.toUpperCase()}
    </span>
  );
};

export default Badge;