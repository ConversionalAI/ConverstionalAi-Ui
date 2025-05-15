import React, { useState } from "react";
import { ReactMic } from "react-mic";
import axios from "axios";

const VoiceToText = ({ setText }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [conversationName, setConversationName] = useState("");

  const startRecording = () => setRecording(true);
  const stopRecording = () => setRecording(false);

  const onStop = (recordedBlob) => {
    console.log("Recorded Blob:", recordedBlob);
    setAudioBlob(recordedBlob.blob);
  };

  const sendAudioToBackend = async () => {
    if (!audioBlob) {
      console.error("No audio file recorded!");
      return;
    }

    const fileName = conversationName.trim() !== "" ? `${conversationName}.wav` : "audio.wav";

    const formData = new FormData();
    formData.append("file", audioBlob, fileName);

    try {
      const response = await axios.post("http://localhost:8000/transcribe/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Backend Response:", response.data);
      setText(response.data.transcription);
    } catch (error) {
      console.error("Error transcribing:", error);
    }
  };

  return (
    <div className="voice-to-text-container">
      <h2>Conversational AI delivering facts seamlessly</h2>

      {/* Input for conversation name */}
      <input
        type="text"
        placeholder="Enter conversation name"
        value={conversationName}
        onChange={(e) => setConversationName(e.target.value)}
        className="conversation-name-input"
      />

      <ReactMic
        record={recording}
        className="sound-wave"
        onStop={onStop}
        mimeType="audio/wav"
      />

      <div className="button-group">
        <button onClick={startRecording} disabled={recording}>Start Recording</button>
        <button onClick={stopRecording} disabled={!recording}>Stop Recording</button>
        <button onClick={sendAudioToBackend} disabled={!audioBlob}>Transcribe</button>
      </div>
    </div>
  );
};

export default VoiceToText;
