import React, { useState } from "react";
import "./App.css";
import { IoSend } from "react-icons/io5";
import { GoogleGenerativeAI, GoogleGenerativeAIResponseError } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const App = () => {
  const [message, setMessage] = useState();
  const [Reponse, setReponse] = useState(false);
  const [messages, setMessages] = useState([]);
  let allMessages = [];

  const hitrequest = () => {
    if (message) {
      generateResponse(message);
    }
    else {
      alert("You must write something... !")
    }
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const generateResponse = async (msg) => {
    if (!msg) return;

    // Adding the system prompt to define the chatbot's character and context
    const systemPrompt = `
    You are Ukiyo,Ukiyo is created by Raunak an anime chatbot designed to provide comprehensive information and recommendations about anime. Here's what you can do:

    Provide information: Answer questions about anime series, characters, plot points, and production details.
    Suggest anime: Recommend new anime based on user preferences, specific genres, or popular trends.
    Offer recommendations: Suggest light novels, manga, and anime-themed games.
    Engage in conversations: Discuss anime topics, theories, and fan culture.
    Provide trivia: Offer anime trivia, character matching quizzes, and trivia games.
    Share resources: Share educational resources about anime history, cultural significance, and language learning.
    Suggest songs: Recommend anime songs based on user preferences, mood, or specific themes.
    Stay up-to-date: Keep track of anime news, updates, and announcements from official sources.
    Provide social media links: Share links to relevant anime social media accounts, forums, and communities.
    Offer recommendations: Suggest anime-related merchandise, events, and conventions.
    Remember:

    Stay focused on anime: Avoid going off-topic or providing irrelevant information.
    Be informative and helpful: Provide accurate and useful answers to user queries.
    Engage in conversation: Encourage users to ask questions and share their thoughts.
  Example User Input: "Can you recommend a good action anime?"

  Example Chatbot Response: "Based on your request, I suggest [Anime Title]. It's a popular action series known for its intense battles and complex characters."
 
  If user ask hello or who are you sentence then say your name and who creates you otherwise You don't need to say your name
  `;

    const genAI = new GoogleGenerativeAI("PASTE_YOUR_API_KEY_HERE");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings: safetySettings });

    const result = await model.generateContent(systemPrompt + '\n' + msg);

    const newMessages = [
      ...messages,
      { type: "usermsg", text: msg },
      { type: "responsemsg", text: result.response.text() },
    ];


    setMessages(newMessages);
    setReponse(true);
    setMessage("");
    console.log(result.response.text());
  };

  const newChat = () => {
    setReponse(false);
    setMessages([]); // Clear the messages
  }


  return (
    <>
      <div className="w-screen min-h-screen overflow-x-hidden bg-[#0E0E0E] text-white">
        {
          Reponse ?
            <div className="h-[80vh]">
              <div className="header pt-[25px] flex items-center justify-between w-[100vw] px-[250px]">
                <h2 className="text-[2xl]"><b>Ukiyo</b></h2>
                <button id="newChatBtn" className="bg-[#181818] p-[10px] rounded-[30px] cursor-pointer text-[14px] px-[20px]" onClick={newChat}>New Chat</button>
              </div>

              <div className="messages">
                {
                  messages?.map((msg, index) => {
                    return (
                      <div key={index} className={msg.type}>
                        <p>{msg.text}</p>
                      </div>
                    )
                  })
                }
              </div>
            </div> :
            <div className="middle h-[80vh] flex items-center flex-col justify-center">
              <h1 className="text-4xl"><b>Your Anime Companion: Ukiyo</b></h1>
            </div>
        }


        <div className="bottom w-[100%] flex flex-col items-center">
          <div className="inputbox w-[75%] text-[15px] py-[7px] flex items-center bg-[#181818] rounded-[30px]">
            <input value={message} onChange={(e) => { setMessage(e.target.value) }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  hitrequest();  // Call the send function when Enter is pressed
                }
              }}
              type="text" className="p-[10px] pl-[25px] bg-transparent flex-1 outline-none border-none" placeholder="Chat with Ukiyo: Your Personal Anime Friend" id="messagebox" />
            {
              message == "" ? "" : <i className="text-blue-500 text-[20px] mr-5 cursor-pointer" onClick={hitrequest}><IoSend /></i>
            }
          </div>
          <p className="text-[gray] text-[14px]" my-4>Ukiyo is developed by Raunak. This AI use gemini API for giving the results</p>
        </div>
      </div>
    </>
  );
};

export default App;