import React from 'react';
import { useLocation } from 'react-router-dom';

export default function ResultsPage() {
  const location = useLocation();
  const data = location.state?.data || [];

  return (
    <div style={{ padding: '60px' }}>
      <h2>Query Results</h2>
      <ul>
        {data.map((res, idx) => (
          <li key={idx}>{JSON.stringify(res)}</li>
        ))}
      </ul>
    </div>
  );
}
