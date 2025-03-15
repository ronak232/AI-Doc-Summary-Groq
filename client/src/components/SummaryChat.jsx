import axios from "axios";
import React, { useState } from "react";

function SummaryChat({ response }) {
  const [queryResponse, setQueryResponse] = useState(null);
  const [userQuery, setUserQuery] = useState("");

  if (!response) return;

  const handleQueryChange = (e) => {
    e.preventDefault();
    let value = e.target.value;
    setQueryResponse(value);
  };

  const handleQueryResponse = async () => {
    const response = await axios.post("/upload/v1/query", {
      params: queryResponse,
    });
    return response.data;
  };

  return (
    <div className="mt-6">
      <div className="container m-auto">
        <input
          className="min-w-full bg-white text-black h-[50px] max-w-[200px] rounded-sm"
          name="summary-Q-and-A"
          value={userQuery}
          onChange={handleQueryChange}
        ></input>
        <button
          className="bg-blue-500 text-white rounded-md min-w-10 w-full"
          onClick={handleQueryResponse}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default SummaryChat;
