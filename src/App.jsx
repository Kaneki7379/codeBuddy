import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Editor from "@monaco-editor/react";
import Select from "react-select";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import { PacmanLoader } from "react-spinners";

const App = () => {
  const options = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "go", label: "Go" },
    { value: "ruby", label: "Ruby" },
    { value: "php", label: "PHP" },
    { value: "rust", label: "Rust" },
    { value: "kotlin", label: "Kotlin" },
    { value: "swift", label: "Swift" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
    { value: "bash", label: "Bash" },
    { value: "sql", label: "SQL" },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [fixedCode, setFixedCode] = useState("");

  const ai = new GoogleGenAI({
    apiKey: "",
  });

  async function reviewCode() {
    setLoading(true);
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an expert developer. Analyze the following ${selectedOption.value} code:

1. Rate its quality (Better, Good, Normal, Bad).
2. Suggest improvements.
3. Explain what the code does.
4. Identify bugs or issues.
5. Suggest fixes.

Code: ${code}`,
    });
    setResponse(result.text);
    setLoading(false);
  }

  async function fixCode() {
    setLoading(true);
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Fix and improve the following ${selectedOption.value} code. Provide only the improved code:

Code: ${code}`,
    });
    setFixedCode(result.text);
    setLoading(false);
  }

  const markdownComponents = {
    h1: ({ children }) => <h1 className="text-red-400 text-2xl font-bold mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-red-400 text-xl font-bold mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-red-400 text-lg font-bold mb-2">{children}</h3>,
  };

  return (
    <>
      <Navbar />
      <div
        className="main flex justify-between bg-zinc-950 text-white"
        style={{ height: "calc(100vh - 90px)" }}
      >
        <div className="left w-1/2 p-4 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-4">
            <Select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e)}
              options={options}
              className="text-white"
              styles={{
                container: (base) => ({ ...base, width: "30%" }),
                control: (base) => ({
                  ...base,
                  backgroundColor: "#18181b",
                  borderColor: "#3f3f46",
                  color: "white",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#18181b",
                  color: "white",
                }),
                singleValue: (base) => ({ ...base, color: "white" }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected
                    ? "#3f3f46"
                    : isFocused
                    ? "#27272a"
                    : "#18181b",
                  color: "white",
                  cursor: "pointer",
                }),
                input: (base) => ({ ...base, color: "white" }),
              }}
            />
            <button
              onClick={() =>
                code ? reviewCode() : alert("Please enter the code first!")
              }
              className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded shadow-md transition"
            >
              Review
            </button>
            <button
              onClick={() =>
                code ? fixCode() : alert("Please enter the code first!")
              }
              className="bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded shadow-md transition"
            >
              Fix Code
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                theme="vs-dark"
                language={selectedOption.value}
                value={code}
                onChange={(val) => setCode(val)}
                options={{ minimap: { enabled: false } }}
              />
            </div>

            {fixedCode && (
              <div className="flex-1 bg-zinc-800 p-4 rounded overflow-hidden">
                <h3 className="font-bold mb-2 text-purple-400">Fixed Code:</h3>
                <div className="h-full overflow-hidden">
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    language={selectedOption.value}
                    value={fixedCode}
                    options={{ readOnly: true, minimap: { enabled: false } }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="right w-1/2 p-4 overflow-y-auto bg-zinc-900">
          <div className="border-b border-zinc-700 pb-2 mb-4">
            <h2 className="text-xl font-bold text-purple-300">Review Response</h2>
          </div>
          <div className="bg-zinc-800 p-4 rounded text-gray-100 text-base leading-relaxed shadow-inner">
            {loading ? (
              <div className="flex justify-center py-10">
                <PacmanLoader color="#9333ea" />
              </div>
            ) : (
              <Markdown components={markdownComponents}>{response}</Markdown>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
