import React, { useState } from "react";
import axios from "axios";

function OcrUploader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:8080/api/ocr/extract", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (error) {
      setResult("Erreur lors de l'envoi.");
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Extraire texte</button>
      <pre>{result}</pre>
    </div>
  );
}

export default OcrUploader;
