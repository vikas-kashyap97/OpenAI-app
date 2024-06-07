import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showArticle, setShowArticle] = useState(false);
  const [history, setHistory] = useState([]); // State to track history of questions and answers
  const [displayedAnswer, setDisplayedAnswer] = useState(""); // State to handle typing effect

  async function generateAnswer(questionText) {
    setShowArticle(false); // Hide the article when generating answer
    setAnswer("loading...");
    setDisplayedAnswer("");

    // Check if the question is already in history
    if (!history.find(item => item.question === questionText)) {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAkzLsNFrzaeMj2IJaDH6Bp1444-FQGxnokar",
        method: "post",
        data: {
          contents: [{ parts: [{ text: questionText }] }],
        },
      });

      const newAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(newAnswer);

      // Add the question and answer to history
      setHistory(prevHistory => [...prevHistory, { question: questionText, answer: newAnswer }]);
    } else {
      const historyItem = history.find(item => item.question === questionText);
      setAnswer(historyItem.answer);
    }
  }

  useEffect(() => {
    if (answer === "loading...") return;

    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedAnswer(prev => prev + answer.charAt(index));
      index++;
      if (index >= answer.length) {
        clearInterval(intervalId);
      }
    }, 1);

    return () => clearInterval(intervalId);
  }, [answer]);

  const openNav = () => {
    setSidebarOpen(true);
  };

  const closeNav = () => {
    setSidebarOpen(false);
  };

  const newChat = () => {
    setQuestion("");
    setAnswer("");
    setDisplayedAnswer("");
    setShowArticle(false); // Close the article when starting a new chat
  };

  const showFullArticle = () => {
    setShowArticle(true);
  };

  const removeHistoryItem = (index) => {
    setHistory(prevHistory => prevHistory.filter((_, i) => i !== index));
  };

  const handleHistoryClick = (item) => {
    setQuestion(item.question);
    setAnswer(item.answer);
    setDisplayedAnswer(item.answer);
  };

  return (
    <>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="mySidebar">
        <button className="closebtn" onClick={closeNav}>×</button>
        <button className="newchatbtn" onClick={newChat}>New Chat</button>
        <a href="#" onClick={showFullArticle}>ChatAI</a>
        <a href="#">Explore AI's</a>
        
        <h3>History</h3>
        <div className="history-container">
        <ul>
          {history.map((item, index) => (
            <li key={index} onClick={() => handleHistoryClick(item)}>
              {item.question} 
              <button id='historycut' onClick={(e) => { e.stopPropagation(); removeHistoryItem(index); }}>×</button>
            </li>
          ))}
        </ul>
      </div>
      </div>

      <div id="main" className={sidebarOpen ? 'shifted' : ''}>
        <button className="openbtn" onClick={openNav}>☰ Open Sidebar</button><br></br>
        <h1>Open AI</h1>
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} cols="30" rows="3"></textarea><br></br>
        <button onClick={() => generateAnswer(question)}>Generate answer</button>
        <div id="answer-container">
          <pre>{displayedAnswer}</pre>
        </div>

        {showArticle && (
          <div className="article">
            <h2>ChatAI Overview</h2>
            <p>ChatAI is an advanced conversational AI model developed by OpenAI. It's based on the GPT (Generative Pre-trained Transformer) architecture, specifically the GPT-3.5 version. ChatAI is designed to understand and generate human-like text based on the input it receives. Here are some key points about ChatAI:</p>

            <h3>Conversational Ability</h3>
            <p>ChatAI can engage in natural, human-like conversations on a wide range of topics. It can provide answers, explanations, and even carry on discussions.</p>

            <h3>Generative Model</h3>
            <p>It generates responses based on the context provided in the conversation. The model is capable of understanding the context of previous messages to provide relevant and coherent responses.</p>

            <h3>Versatility</h3>
            <p>ChatAI is designed to be versatile and can handle various types of queries, from factual questions to open-ended discussions.</p>

            <h3>Training</h3>
            <p>It has been trained on a large dataset that includes a vast amount of text from books, articles, and other sources to develop a broad understanding of human language.</p>

            <h3>Applications</h3>
            <p>ChatAI can be used in applications such as customer service chatbots, virtual assistants, educational tools, and more, wherever interactive text-based communication is needed.</p>

            <h3>Continual Improvement</h3>
            <p>As part of its development, OpenAI continues to improve ChatAI's capabilities, making it more accurate, reliable, and capable of handling a wider range of queries and tasks.</p>

            <p>Overall, ChatAI represents a significant advancement in AI technology, enabling more natural and meaningful interactions between humans and machines.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
