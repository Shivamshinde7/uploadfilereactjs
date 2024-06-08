import React , {useRef, useState} from 'react'
import '../components/UploadFile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload  } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-regular-svg-icons';
import axios from "axios";

const FileUpload = () => {
  const inputRef = useRef();

  const [selectedFile , setSelectedFile] = useState(0);
  const [Progress , setProgress] = useState(0);
  const [uploadStatus , setUploadStatus] = useState("select");

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };
    

    const onChooseFile = () => {
      inputRef.current.click();
    };

    const clearFileInput = () => {
      inputRef.current.value = "";
      setSelectedFile(null);
      setProgress(0);
      setUploadStatus("select");
    };

    const handleUpload = async () => {
      if (uploadStatus === "done") {
        clearFileInput();
        return;
      }
  
      try {
        setUploadStatus("uploading");
  
        const formData = new FormData();
        formData.append("file", selectedFile);
  
        const response = await axios.post(
          "http://localhost:3000/api/upload",
          formData,
          {
            onUploadProgress: (ProgressEvent) => {
              const percentCompleted = Math.round(
                (ProgressEvent.loaded * 100) / ProgressEvent.total
              );
              setProgress(percentCompleted);
            },
          }
        );
  
        setUploadStatus("done");
      } catch (error) {
        setUploadStatus("select");
      }
    };

    return (
      <div className='Upload-btn'>
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {!selectedFile && (
          <button className="file-btn" onClick={onChooseFile}>
             <FontAwesomeIcon  icon={faUpload} />
            Upload File
          </button>
        )}
        {selectedFile && (
          <>
          <div className="file-card">
            <span className='material-symbols-outlined'>
              description
            </span>
            <div className="file-info">
              <div style={{ flex:1 }}>

              <h6>{selectedFile?.name}</h6>

               <div className='progressbar-bg'>
                
               <div className='progress' style={{width:`${Progress}%`}} />
               
               </div>
              </div>

              {uploadStatus === "select" ? (
                <button onClick={clearFileInput}>
                  <span class="material-symbols-outlined">
                    close
                  </span>
                </button>
              ) :  (
                <div className="check-circle">
                  {uploadStatus === "uploading" ? (
                    `${Progress}%`
                  ) : uploadStatus === "done" ? (
                    <span class="material-symbols-outlined check">
                    check
                    </span>
                  ) : null}
                </div>
              )}

            </div>
          </div>
          <button className='uplaod-btn' onClick={handleUpload}>
            {uploadStatus === "select" || uploadStatus ==="uploading" ? "Upload":"Done" }
          </button>
          </>
        )}
      </div>
    );
  };
  
  export default FileUpload;