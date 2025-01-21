

import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [format, setFormat] = useState("text"); // Default format is text
  const [data, setData] = useState({}); // Stores data for the selected format
  const [qrCode, setQrCode] = useState("");
  const [bgColor, setBgColor] = useState("ffffff"); // Default background color
  const [size, setSize] = useState(400); // Default size
  const [generate, setGenerate] = useState(false); // Control when to generate the QR code

  // Generate QR Code URL dynamically
  useEffect(() => {
    if (!generate) return;

    let qrData = "";

    // Format the QR data based on the selected format
    switch (format) {
      case "text":
        qrData = data.text || "";
        break;
      case "url":
        qrData = data.url || "";
        break;
      case "phone":
        qrData = `tel:${data.phone || ""}`;
        break;
      case "email":
        qrData = `mailto:${data.email || ""}?subject=${data.subject || ""}&body=${data.body || ""}`;
        break;
      case "wifi":
        qrData = `WIFI:S:${data.ssid || ""};T:${data.security || ""};P:${data.password || ""};;`;
        break;
      default:
        qrData = "";
    }

    setQrCode(
      `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=${size}x${size}&bgcolor=${bgColor}`
    );
  }, [generate, format, data, bgColor, size]);

  // Handle input changes
  const handleInputChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Reset fields
  const handleReset = () => {
    setData({});
    setBgColor("ffffff");
    setSize(400);
    setGenerate(false);
    setQrCode("");
  };

  // Programmatically download the QR code image
  function handleDownload() {
    if (!qrCode) return;
  
    fetch(qrCode)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'QRCode.png';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click(); // Programmatically click the link
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error downloading QR code:', error);
        alert('Failed to download QR Code. Please try again.');
      });
  }
  

  return (

<div className="App">
  <h1>Multi-Format QR Code Generator</h1>

  {/* Flex container */}
  <div className="flex-container">
    {/* Input Box */}
    <div className="input-box">
      <h4>Select QR Code Format:</h4>
      <select onChange={(e) => setFormat(e.target.value)} value={format}>
        <option value="text">Text</option>
        <option value="url">URL</option>
        <option value="phone">Phone Number</option>
        <option value="email">Email</option>
        <option value="wifi">Wi-Fi</option>
      </select>

      {/* Inputs for specific format */}
      {format === "text" && (
        <input
          type="text"
          placeholder="Enter text"
          onChange={(e) => handleInputChange("text", e.target.value)}
          value={data.text || ""}
        />
      )}
      {format === "url" && (
        <input
          type="url"
          placeholder="Enter URL"
          onChange={(e) => handleInputChange("url", e.target.value)}
          value={data.url || ""}
        />
      )}
      {format === "phone" && (
        <input
          type="tel"
          placeholder="Enter phone number"
          onChange={(e) => handleInputChange("phone", e.target.value)}
          value={data.phone || ""}
        />
      )}
      {format === "email" && (
        <>
          <input
            type="email"
            placeholder="Recipient email"
            onChange={(e) => handleInputChange("email", e.target.value)}
            value={data.email || ""}
          />
          <input
            type="text"
            placeholder="Subject"
            onChange={(e) => handleInputChange("subject", e.target.value)}
            value={data.subject || ""}
          />
          <textarea
            placeholder="Email body"
            onChange={(e) => handleInputChange("body", e.target.value)}
            value={data.body || ""}
          ></textarea>
        </>
      )}
      {format === "wifi" && (
        <>
          <input
            type="text"
            placeholder="Wi-Fi SSID"
            onChange={(e) => handleInputChange("ssid", e.target.value)}
            value={data.ssid || ""}
          />
          <select
            onChange={(e) => handleInputChange("security", e.target.value)}
            value={data.security || ""}
          >
            <option value="WPA">WPA</option>
            <option value="WEP">WEP</option>
            <option value="">None</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => handleInputChange("password", e.target.value)}
            value={data.password || ""}
          />
        </>
      )}
    </div>

    {/* Extra Options */}
    <div className="extra-options">
      <h5>Background Color:</h5>
      <input
        type="color"
        value={`#${bgColor}`}
        onChange={(e) => setBgColor(e.target.value.substring(1))}
      />
      <h5>Dimensions:</h5>
      <input
        type="range"
        min="200"
        max="600"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />
      <p>{size} x {size}</p>
    </div>
  </div>

  {/* Buttons */}
  <div className="buttons">
    <button className="generate-button" onClick={() => setGenerate(true)}>
      Generate
    </button>
    <button className="reset-button" onClick={handleReset}>
      Reset
    </button>
  </div>

  {/* QR Code Output */}
  {qrCode && (
    <div className="output-box">
      <img src={qrCode} alt="Generated QR Code" />
      <button type="button" onClick={handleDownload}>
          Download
        </button>
    </div>
 )}
 </div>
);
}

export default App;