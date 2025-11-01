import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import { supabase } from "../supabaseClient";

const FileUploader = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const uploadFileToBackend = async () => {
        if (!selectedFile) {
            console.error("No file selected!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile, fileName);
        try {
            const { data: userData } = await supabase.auth.getUser();
            const user_id = userData?.user?.id || "";
            formData.append("user_id", user_id);
        } catch (_) {
            // ignore if unable to fetch user
        }

        try {
            const res = await fetch(`${API_BASE_URL}/content`, {
                method: "POST",
                body: formData
            });
            if (!res.ok) throw new Error(`Upload failed with ${res.status}`);
            const data = await res.json();

            console.log("Upload Response:", data);
            if (onUploadSuccess) {
                onUploadSuccess(data);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="file-uploader-container">
            <h2>Upload a File</h2>

            <div
                className={`drop-zone ${dragActive ? "active" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <p>Drag & drop a file here, or click to select</p>
                <input type="file" onChange={handleFileChange} />
            </div>

            {fileName && <p className="file-name">Selected File: {fileName}</p>}

            <div className="button-group">
                <button onClick={uploadFileToBackend} disabled={!selectedFile}>
                    Upload
                </button>
            </div>
        </div>
    );
};

export default FileUploader;
