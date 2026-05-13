import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const [issue, setIssue] = useState("");
  const [report, setReport] = useState("");

  // AI CHAT
  const sendMessage = async () => {

    const res = await fetch("http://127.0.0.1:5000/ask-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    });

    const data = await res.json();

    setResponse(data.response);
  };

  // GENERATE REPORT
  const generateReport = async () => {

    const res = await fetch("http://127.0.0.1:5000/generate-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        issue: issue,
      }),
    });

    const data = await res.json();

    setReport(data.report);
  };

  // DOWNLOAD PDF
  const downloadReport = async () => {

    const res = await fetch("http://127.0.0.1:5000/download-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        report: report,
      }),
    });

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "audit_report.pdf";

    document.body.appendChild(a);

    a.click();

    a.remove();
  };

  return (
    <div className="container mt-5">

      <h1 className="text-center mb-5">
        AI Audit Report Generator
      </h1>

      {/* AI CHAT */}

      <div className="card p-4 mb-5">

        <h2>AI Chat</h2>

        <div className="input-group mb-3">

          <input
            type="text"
            className="form-control"
            placeholder="Ask AI anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            className="btn btn-primary"
            onClick={sendMessage}
          >
            Send
          </button>

        </div>

        <div className="card p-3">

          <h3>AI Response:</h3>

          <p>{response}</p>

        </div>

      </div>

      {/* REPORT GENERATOR */}

      <div className="card p-4">

        <h2>Generate Audit Report</h2>

        <div className="input-group mb-3">

          <input
            type="text"
            className="form-control"
            placeholder="Enter audit issue"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          />

          <button
            className="btn btn-danger"
            onClick={generateReport}
          >
            Generate Report
          </button>

        </div>

        <div className="card p-3">

          <h3>Generated Report:</h3>

          <p>{report}</p>

          <button
            className="btn btn-success mt-3"
            onClick={downloadReport}
          >
            Download PDF
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;