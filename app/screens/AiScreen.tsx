import React, { useState } from "react";
import axios from "axios";

const AiScreen = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResponse = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4", // or "gpt-3.5-turbo"
          messages: [{ role: "user", content: input }],
        },
        {
          headers: {
            // Authorization: `Bearer ${'sk-proj--QJ1---'}`,
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(res.data.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching OpenAI API:", error);
      setResponse("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    fetchResponse();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">ChatGPT AI Screen</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border rounded mb-2"
          placeholder="Ask me something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="4"
        ></textarea>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </form>
      {response && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="font-bold">Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AiScreen;
