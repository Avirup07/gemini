import { createContext, useState } from "react";
import main from "../config/gemini";
import { marked } from "marked";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (idx, nextWord) => {
    setTimeout(() => {
        setResultData(prev => prev + nextWord)
    }, 75 * idx);
  };

  const newChat = () => {
    setLoading(false)
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    setInput("");
    setResultData("");
    setLoading(true);
    setShowResult(true);
  
    let actualPrompt = prompt !== undefined ? prompt : input;
  
    if (prompt === undefined) {
      setPrevPrompt(prev => [...prev, input]);
    }
  
    setRecentPrompt(actualPrompt);
  
    const response = await main(actualPrompt);
    let newResponse = marked(response);
    let newResponseArray = newResponse.split(" ");
  
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
  
    setLoading(false);
  };
  

  const ContextValue = {
    input,
    setInput,
    prevPrompt,
    setPrevPrompt,
    onSent,
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
    newChat,
  };
  return (
    <Context.Provider value={ContextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
