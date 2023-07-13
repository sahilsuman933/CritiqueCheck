import React, { useState } from "react";
import logo from "./logo.svg";
import "./app.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [codeSnippet, setCodeSnippet] = useState("");
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("https://chatbot.theb.ai/api/chat-process", {
        method: "POST",
        body: JSON.stringify({
          prompt: `Please analyze the following code and provide feedback on style, best practices, and potential improvements:\n${codeSnippet}`,
          options: {},
        }),
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 120000,
      });

      const responseData = await response.text();
      const jsonData = JSON.parse(responseData.split("\n").pop());
      console.log(jsonData?.text);

      if (jsonData?.status === "Fail") {
        toast.error("OpenAI Server Error.");
      } else {
        setResponseText(jsonData?.text);
      }
    } catch (error) {
      console.log("Error occurred:", error);
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleCodeClick = () => {
    setCodeSnippet(`const number = parseInt(prompt('Enter the number of terms: '));
let n1 = 0, n2 = 1, nextTerm;

console.log('Fibonacci Series:');

for (let i = 1; i <= number; i++) {
  console.log(n1);
  nextTerm = n1 + n2;
  n1 = n2;
  n2 = nextTerm;
}`);
  };

  const handleCodeChange = (e) => {
    const text = e.target.value;
    const lines = text.split("\n");
    if (lines.length <= 300) {
      setCodeSnippet(text);
    } else {
      setCodeSnippet(text.substring(0, text.lastIndexOf("\n", 300)));
      toast.warning("Code Line Limit exceeds (300 lines).");
    }
  };

  const isCodeLimitExceeded = codeSnippet.split("\n").length > 300;

  return (
    <div className="homepage">
      <header>
        <img src={logo} alt="Logo" />
        <p>
          Elevate your code quality and enhance your programming skills.
          <br />
          Start typing or drop a file into the text area to get started.
        </p>
      </header>
      <main className="main-content">
        <div>
          <textarea
            placeholder="Enter your code snippet here"
            value={codeSnippet}
            onChange={handleCodeChange}
          />
          <p className="note">Note: Code length limit is 300 lines.</p>
        </div>
        <div>
          <input type="file" id="codeFile" />
          <p>
            or{" "}
            <span>
              <label htmlFor="codeFile">Upload your code file</label>
            </span>
          </p>
        </div>
        <div className="btn">
          <button
            onClick={handleSubmit}
            disabled={isLoading || isCodeLimitExceeded}
            className={isLoading ? "loading" : ""}
          >
            <span className="btn-content">
              {isLoading ? <span className="spinner"></span> : "Submit Code"}
            </span>
          </button>
          <p>
            Not sure what to submit? Try a{" "}
            <span onClick={handleSampleCodeClick}>sample code</span>.
          </p>
        </div>
      </main>
      {responseText && (
        <div className="feedback">
          <h2>Code Feedback:</h2>
          <pre>{responseText}</pre>
        </div>
      )}
      <footer>
        <hr />
        <p>Made with ❤️ by CritiqueCheck</p>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default App;
