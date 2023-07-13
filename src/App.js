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

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant.",
              },
              {
                role: "user",
                content: `Please analyze the following code and provide feedback on style, best practices, and potential improvements:\n${codeSnippet}`,
              },
            ],
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
          },
          timeout: 120000,
        }
      );

      const responseData = await response.json();

      console.log(responseData.choices[0].message.content);

      if (responseData?.error) {
        toast.error(`Error: ${responseData.error.type}`);
      } else {
        setResponseText(responseData.choices[0].message.content);
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
              <label htmlFor="codeFile" style={{ cursor: "pointer" }}>
                Upload your code file
              </label>
            </span>
          </p>
        </div>
        <div className="btn">
          <button
            onClick={handleSubmit}
            disabled={isLoading || isCodeLimitExceeded}
            className={isLoading ? "loading" : ""}
          >
            {isLoading ? "Loading..." : "Submit Code"}
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
