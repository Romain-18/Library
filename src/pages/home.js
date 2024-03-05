import React, { useState, useEffect } from 'react';
import './home.css';

const RecentChanges = () => {
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentChanges = async () => {
      try {
        const response = await fetch('http://openlibrary.org/recentchanges.json?limit=10');
        const data = await response.json();
        setChanges(data);
        setLoading(false);
      } catch (error) {
        setError('Error loading recent changes.');
        setLoading(false);
      }
    };

    fetchRecentChanges();
  }, []);

  return (
    <div>
      <h2>Recent Changes</h2>
      {loading && <p className="container">
            <span className="loader"></span></p>}
      {error && <p>{error}</p>}
      <ul>
        {changes.map(change => (
          <li key={change.id} className="list">
            <p>Kind: {change.kind}</p>
            <p>Timestamp: {change.timestamp}</p>
            <p>Comment: {change.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentChanges;
