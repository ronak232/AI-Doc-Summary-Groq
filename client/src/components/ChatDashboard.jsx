import { useState } from "react";
import "../style/dashboard.css";
import axios from "axios";

function ChatDashboard() {
  const [uploadFile, setUploadFile] = useState(null);
  const [showSummary, setShowSummary] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const handleUploadChange = (e) => {
    console.log("target", e.target.files);
    if (e.target.files) {
      setUploadFile(e.target.files[0]);
    }
  };

  const removeSelectedFile = (e) => {
    e.stopPropagation();
    if (uploadFile) {
      setUploadFile(null);
    }
  };

  const handleFileSummarizer = async () => {
    setisLoading(true);
    const data = new FormData();
    data.append("file", uploadFile);
    const response = await axios.post(
      "http://localhost:8000/api/upload",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    let parseData = new DOMParser();
    const documents = parseData.parseFromString(
      response.data.data,
      "text/html"
    );
    setisLoading(false);
    let extractedData = documents.body.innerHTML;
    setShowSummary(extractedData);
    setUploadFile(null);
  };

  return (
    <div className="p-2">
      <div className="text-white h-full">
        {!isLoading ? (
          showSummary ? (
            <div
              className="container showSummary"
              dangerouslySetInnerHTML={{ __html: showSummary }}
            />
          ) : (
            <div className="flex justify-center items-center flex-col w-full relative">
              <img
                className="max-w-[300px] max-h-[300px] "
                src="../images/ai-bot-bg.png"
                alt=""
              />
              <p className="text-2xl">
                🗃️Just upload a file and get instant summary of your document
                ...
              </p>
              <p className="text-xl">With lighting fast speed 💥</p>
            </div>
          )
        ) : (
          <p className="text-3xl font-semibold">
            Brace yourself this is to fast...
          </p>
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
                <img
                  className="bg-white rounded-full p-1.5 cursor-pointer"
                  src="../images/file.png"
                  alt=""
                />
                <button
                  className="text-blue-400 bg-white text-[18px] font-semibold rounded-xl cursor-pointer w-full max-w-[200px]"
                  onClick={handleFileSummarizer}
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
