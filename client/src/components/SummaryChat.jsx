import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useFetch } from "../hooks/useFetchHook/useFetch";


function SummaryChat({ response, currentDataId }) {
  console.log("currentData ", currentDataId);
  const [queryResponse, setQueryResponse] = useState(null);
  const [userQuery, setUserQuery] = useState("");
  
  // const resp = useFetch(`/api/v1/fetch/${currentDataId}`);

  // console.log("fetch data ", resp.data);

  const handleQueryChange = (e) => {
    e.preventDefault();
    let value = e.target.value;
    setUserQuery(value);
  };

  const handleQueryResponse = useCallback(async () => {
    const response = await axios.post(`/api/v1/user/${userQuery}`, {
      id: currentDataId,
      query: userQuery,
    });
    let responseData = response.data.data;
    setQueryResponse((data) => ({
      ...data,
      query: responseData,
    }));
  }, [userQuery, currentDataId]);

  useEffect(() => {
    handleQueryResponse();
  }, [handleQueryResponse, response, userQuery]);

  return (
    <div className="container m-auto">
      <div className=" max-w-[800px] w-full m-auto gap-2 flex flex-col items-center justify-center">
        <div className="p-4">
          {queryResponse}
          <p>Need to know more about summary...</p>
        </div>

        <input
          className="bg-white text-black h-[50px] rounded-md w-full placeholder:text-gray-500 p-2 text-[16px]"
          value={userQuery}
          onChange={handleQueryChange}
          placeholder="Ask me anything about summary..."
          type="text"
        ></input>
        <button
          className="bg-blue-500 text-white rounded-2xl min-w-[100px] max-w-full p-2.5 text-[16px] cursor-pointer"
          onClick={handleQueryResponse}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default SummaryChat;
