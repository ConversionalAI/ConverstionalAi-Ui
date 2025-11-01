import React, { useMemo, useState } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import { API_BASE_URL } from "../config";

const VoiceToText = ({ setText }) => {
    const [audioBlob, setAudioBlob] = useState(null);
    const [conversationName, setConversationName] = useState("");
    const [durationSec, setDurationSec] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [infoMsg, setInfoMsg] = useState("");

    const handleStop = (blob) => {
        setErrorMsg("");
        setInfoMsg("");
        setAudioBlob(blob);

        // Derive duration by loading into an Audio element
        try {
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.addEventListener("loadedmetadata", () => {
                if (!isNaN(audio.duration)) {
                    setDurationSec(Math.round(audio.duration));
                }
                URL.revokeObjectURL(url);
            });
        } catch (_) {
            // best-effort; ignore
        }
    };

    const sendAudioToBackend = async () => {
        if (!audioBlob) {
            setErrorMsg("No audio recorded yet.");
            return;
        }

        // Use .webm to align with backend WEBM_OPUS config
        const safeName = conversationName.trim()
            .replace(/[^a-z0-9-_\s]/gi, "")
            .replace(/\s+/g, "-")
            .toLowerCase();
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = safeName ? `${safeName}.webm` : `recording-${timestamp}.webm`;

        const formData = new FormData();
        formData.append("file", audioBlob, fileName);

        try {
            setIsUploading(true);
            setErrorMsg("");
            setInfoMsg("Uploading and transcribing...");

            const res = await fetch(`${API_BASE_URL}/transcribe/`, {
                method: "POST",
                body: formData
            });
            if (!res.ok) throw new Error(`Transcribe failed with ${res.status}`);
            const data = await res.json();

            setText(data.transcription);

            // Clear the audio blob after successful upload
            setAudioBlob(null);
            setConversationName("");
            setDurationSec(0);
            setInfoMsg("Transcription ready. You can edit and search now.");
        } catch (error) {
            setErrorMsg("Failed to transcribe. Please try again.");
        }
        setIsUploading(false);
    };

    const audioUrl = useMemo(() => (audioBlob ? URL.createObjectURL(audioBlob) : null), [audioBlob]);

    return (
        <div className="voice-to-text-container">
            <h2>Speak, review, then transcribe to text</h2>

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

            {audioBlob && (
                <div className="recording-preview" style={{ marginTop: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 600 }}>Preview:</span>
                        {durationSec > 0 && (
                            <span>~{Math.floor(durationSec / 60)}:{String(durationSec % 60).padStart(2, "0")} min</span>
                        )}
                    </div>
                    <audio controls src={audioUrl} style={{ width: "100%", marginTop: "0.25rem" }} />
                </div>
            )}

            <div className="button-group">
                <button onClick={sendAudioToBackend} disabled={!audioBlob || isUploading}>
                    {isUploading ? "Transcribing..." : "Transcribe"}
                </button>
                {audioBlob && !isUploading && (
                    <button
                        onClick={() => {
                            setAudioBlob(null);
                            setDurationSec(0);
                            setErrorMsg("");
                            setInfoMsg("");
                        }}
                        className="secondary"
                    >
                        Discard
                    </button>
                )}
            </div>

            {errorMsg && (
                <div className="error" style={{ color: "#c62828", marginTop: "0.5rem" }}>{errorMsg}</div>
            )}
            {infoMsg && (
                <div className="info" style={{ color: "#2e7d32", marginTop: "0.5rem" }}>{infoMsg}</div>
            )}
        </div>
    );
};

export default VoiceToText;
