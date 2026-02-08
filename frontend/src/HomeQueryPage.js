import React, { useState } from 'react';

function HomeQueryPage() {
  const [showQuerySection, setShowQuerySection] = useState(false);
  const [bulkQuestions, setBulkQuestions] = useState('');
  const [response, setResponse] = useState([]);

  const handleQuery = async () => {
    const questions = bulkQuestions
      .split('",')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    if (questions.length === 0) {
      alert('Please enter at least one question.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/hackrx/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: 'default', // change if needed
          questions: questions
        })
      });

      const data = await res.json();
      const answers = data.response?.answers || [];
      setResponse(answers);
    } catch (error) {
      console.error('Error:', error);
      setResponse(['Error processing query.']);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.badge}>Powered by GPT-4 & Pinecone</div>

      <h1 style={styles.heading}>
        <span style={styles.blackText}>Intelligent Document</span><br />
        <span style={styles.blueText}>Query System</span>
      </h1>

      <p style={styles.subheading}>
        Transform your insurance document workflow with AI-powered intelligent queries. <br />
        Ask questions and get instant, contextual answers.
      </p>

      <div style={styles.buttonContainer}>
        <button style={styles.primaryButton} onClick={() => setShowQuerySection(true)}>
          Start Querying 📄
        </button>
      </div>

      {showQuerySection && (
        <div style={styles.querySection}>
          <textarea
            placeholder={`Paste all your questions here, one per line...`}
            value={bulkQuestions}
            onChange={(e) => setBulkQuestions(e.target.value)}
            style={styles.textareaLarge}
          />
          <button style={styles.primaryButton} onClick={handleQuery}>Submit Queries</button>

          {response.length > 0 && (
            <div style={styles.response}>
              <strong>Answers:</strong>
              <br />
              {response.map((ans, idx) => (
                <div key={idx} style={{ marginTop: '10px' }}>
                  <strong>Ans{idx + 1}:</strong> {ans}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '100px 20px',
    background: '#f9fbff',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  badge: {
    display: 'inline-block',
    padding: '8px 16px',
    border: '1px solid #d0d7e1',
    borderRadius: '25px',
    fontSize: '14px',
    color: '#1c62d6',
    backgroundColor: '#eef3fb',
    marginBottom: '30px',
  },
  heading: {
    fontSize: '48px',
    margin: '0 0 20px',
    lineHeight: '1.2',
  },
  blackText: {
    color: '#1c1c1e',
    fontWeight: '700',
  },
  blueText: {
    color: '#4a90e2',
    fontWeight: '700',
  },
  subheading: {
    color: '#6e6e73',
    fontSize: '18px',
    maxWidth: '600px',
    margin: '0 auto 40px',
    lineHeight: '1.6',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  querySection: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textareaLarge: {
    width: '100%',
    height: '250px',
    padding: '15px',
    marginBottom: '20px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    resize: 'vertical',
    fontFamily: 'monospace',
  },
  response: {
    marginTop: '20px',
    backgroundColor: '#f1f8ff',
    padding: '15px',
    borderRadius: '8px',
    color: '#333',
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
  }
};

export default HomeQueryPage;
