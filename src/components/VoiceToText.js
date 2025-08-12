import React, { useState } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";

const VoiceToText = ({ setText }) => {
    const [audioBlob, setAudioBlob] = useState(null);
    const [conversationName, setConversationName] = useState("");

    const handleStop = (blob) => {
        console.log("Recorded Blob:", blob);
        setAudioBlob(blob);
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
            const res = await fetch("http://localhost:8000/transcribe/", {
                method: "POST",
                body: formData
            });
            if (!res.ok) throw new Error(`Transcribe failed with ${res.status}`);
            const data = await res.json();

            console.log("Backend Response:", data);
            setText(data.transcription);

            // Clear the audio blob after successful upload
            setAudioBlob(null);
            setConversationName("");
        } catch (error) {
            console.error("Error transcribing:", error);
        }
    };

    return (
        <div className="voice-to-text-container">
            <h2>Conversational AI delivering facts seamlessly</h2>

            <input
                type="text"
                placeholder="Enter conversation name"
                value={conversationName}
                onChange={(e) => setConversationName(e.target.value)}
                className="conversation-name-input"
            />

            <AudioRecorder
                onRecordingComplete={handleStop}
                audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                }}
                downloadOnSavePress={false} // Disable local download
            />

            <div className="button-group">
                <button onClick={sendAudioToBackend} disabled={!audioBlob}>
                    Transcribe
                </button>
            </div>
        </div>
    );
};

export default VoiceToText;
