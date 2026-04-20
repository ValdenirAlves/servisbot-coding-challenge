import React from 'react';

const LogTable = ({ logs }) => {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Created at:</th>
            <th>Message</th>
            <th>Worker ID</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{new Date(log.created).toLocaleString('en-US')}</td>
              <td>{log.message.substring(0, 50)}</td>
              <td>{log.worker}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;