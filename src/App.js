import React, { useEffect, useState } from "react";

const STORAGE_KEY = "offline-submissions";

function App() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    if (window.WebexEmbeddedApp) {
      window.WebexEmbeddedApp.onReady().then(() => {
        setStatus("✅ Webex Ready");
        tryToResend();
      });
    } else {
      console.warn("⚠ WebexEmbeddedApp is not available. You're probably running locally outside Webex.");
      setStatus("Running outside Webex – SDK not available.");
    }
  
    window.addEventListener("online", tryToResend);
  }, []);

  const tryToResend = async () => {
    const submissions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (navigator.onLine && submissions.length > 0) {
      for (let data of submissions) {
        await sendToBackend(data); // Retry
      }
      localStorage.removeItem(STORAGE_KEY);
      setStatus("✅ Resent offline data");
    }
  };

  const sendToBackend = async (text) => {
    // Replace with your real backend/API call
    console.log("Sending to server:", text);
    return new Promise((res) => setTimeout(res, 1000));
  };

  const handleSubmit = async () => {
    if (input.trim() === "") return;

    if (navigator.onLine) {
      await sendToBackend(input);
      setStatus("✅ Submitted online");
    } else {
      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      existing.push(input);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      setStatus("📴 Offline — saved for retry");
    }

    setInput("");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Workmate Assistant</h2>
      <p>Status: {status}</p>

      <div style={{ margin: "1rem 0" }}>
        <input
          type="text"
          placeholder="Enter message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default App;