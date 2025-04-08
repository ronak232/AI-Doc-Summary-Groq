import { useState } from "react";
import "../style/dashboard.css";
import axios from "axios";
import { motion } from "framer-motion";
import SummaryChat from "./SummaryChat";

function ChatDashboard() {
  const [uploadFile, setUploadFile] = useState(null);
  const [showSummary, setShowSummary] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDataId, setCurrentDataId] = useState(null);
 

  const handleUploadChange = (e) => {
    const file = e.target.files[0];
    const extname = file.name.split(".").pop();
    if (extname.includes(".mp3") || extname.includes(".wav")) {
      const audio = URL.createObjectURL(file);
      audio.src = audio;
      setUploadFile(audio);
      return;
    }
    setUploadFile(file);
  };

  const removeSelectedFile = (e) => {
    e.stopPropagation();
    if (uploadFile) {
      setUploadFile(null);
    }
  };

  const handleFileSummarizer = async () => {
    if (!uploadFile) return;
    setisLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
    
      const response = await axios.post("/api/v1/upload", formData, {
        headers: {
          "Content-Type":"multipart/form-data",
        }
      });

      console.log("response ", response.data);
      const { fileId, data } = response.data;
      let parseData = new DOMParser();
      const documents = parseData.parseFromString(data, "text/html");
      setisLoading(false);
      let extractedData = documents.body.innerHTML;
      setShowSummary(extractedData);
      setUploadFile("");
      setCurrentDataId(fileId);
    } catch (error) {
      setError(true);
      setUploadFile("");
      console.error("debug error ", error.message);
      throw new Error("Unable to generate ");
    }
  };

  return (
    <div className="p-2 mt-12">
      <div className="text-white h-full">
        {!error ? (
          !isLoading ? (
            showSummary ? (
              <motion.div
                className="container showSummary"
                dangerouslySetInnerHTML={{ __html: showSummary }}
              />
            ) : (
              <motion.div className="flex justify-center items-center flex-col w-full relative">
                <img
                  className="max-w-[300px] max-h-[300px] "
                  src="../images/ai-bot-bg.png"
                  alt=""
                />
                <p className="text-2xl">
                  🗃️Just upload a file and get instant summary of your document
                  ...
                </p>
                <p className="text-xl">with lighting fast speed 💥</p>
                <p>Allowed files (.pdf, .txt, .docx, .mp3, .wav)</p>
              </motion.div>
            )
          ) : (
            <motion.div
              className="flex justify-center items-center text-3xl font-semibold mt-6 min-h-[300px] h-auto overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            >
              <p>AI is summarizing</p>
              <motion.span
                className="dot-flashing"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 0.6 }}
              >
                ...
              </motion.span>
            </motion.div>
          )
        ) : (
          <div className="flex justify-center items-center gap-1.5 min-h-[350px] h-auto">
            <svg
              className="h-[100px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <g data-name="05-error 404">
                <path d="M45 40H3a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3h3v2H3a1 1 0 0 0-1 1v26a1 1 0 0 0 1 1h42a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1h-3V8h3a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3z" />
                <path d="M15 39h2v4h-2z" />
                <path d="M13 47h-2v-2a3 3 0 0 1 3-3h10v2H14a1 1 0 0 0-1 1zM31 39h2v4h-2z" />
                <path d="M37 47h-2v-2a1 1 0 0 0-1-1h-5v-2h5a3 3 0 0 1 3 3z" />
                <path d="M9 46h30v2H9zM40 36H8a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3h32a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3zM8 2a1 1 0 0 0-1 1v30a1 1 0 0 0 1 1h32a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
                <path d="M6 6h36v2H6zM9 3h2v2H9zM13 3h2v2h-2zM17 3h2v2h-2zM1 30h5v2H1zM42 30h5v2h-5zM9 10h2v2H9zM37 10h2v2h-2zM37 30h2v2h-2zM9 30h2v2H9zM17 25h-2v-2h-3a1 1 0 0 1-.781-1.625l4-5A1 1 0 0 1 17 17v4h1v2h-1zm-2.919-4H15v-1.149zM35 25h-2v-2h-3a1 1 0 0 1-.781-1.625l4-5A1 1 0 0 1 35 17v4h1v2h-1zm-2.919-4H33v-1.149zM25 25h-2a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3zm-2-7a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM13 30h22v2H13zM13 10h22v2H13z" />
              </g>
            </svg>
            <p className="text-2xl text-gray-300">Unable to generate...</p>
          </div>
        )}

        {showSummary && (
          <SummaryChat currentDataId={currentDataId} />
        )}
        <div className="text-center upload_file">
          <div className="upload_file_options">
            {uploadFile && (
              <div className="file-block">
                <p className="text-[12px]">Your file {uploadFile?.name}</p>
                <button className="close-button" onClick={removeSelectedFile}>
                  <span className="close-icon">&times;</span>
                </button>
              </div>
            )}
            <label
              className="w-full space-y-2 flex flex-col gap-2 items-center"
              htmlFor="file"
            >
              <input
                className="hidden"
                type="file"
                id="file"
                onChange={handleUploadChange}
              />
              <div className="flex justify-between w-full m-2">
                <div className="p-2 bg-black rounded-full cursor-pointer">
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    title="Upload file"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"
                    />
                  </svg>
                </div>
                <button
                  className="text-blue-400 bg-white text-[18px] font-semibold rounded-xl cursor-pointer w-full max-w-[200px]"
                  onClick={handleFileSummarizer}
                  disabled={!uploadFile}
                >
                  Get Summary
                </button>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatDashboard;
