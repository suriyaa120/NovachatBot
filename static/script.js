const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatMessages = document.getElementById("chatMessages");
const voiceBtn = document.getElementById("voiceBtn");
const fileInput = document.getElementById("fileInput");
const themeToggle = document.getElementById("themeToggle");
const quickReplies = document.getElementById("quickReplies");

let conversationHistory = [];

// Theme toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    themeToggle.textContent = document.body.classList.contains("light") ? "🌙" : "☀️";
});

// Send message
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", e => { if(e.key === "Enter") sendMessage(); });

// Voice input
voiceBtn.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = e => { messageInput.value = e.results[0][0].transcript; sendMessage(); };
});

// File input
fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if(!file) return;
    const formData = new FormData();
    formData.append("file", file);
    appendMessage(`📎 ${file.name}`, "user");
    chatMessages.scrollTop = chatMessages.scrollHeight;
    try {
        const res = await fetch("/upload", { method:"POST", body:formData });
        const data = await res.json();
        appendMessage(data.reply, "bot");
    } catch(err) { console.error(err); appendMessage("Failed to send file.", "bot"); }
});

// Quick replies example
const quickOptions = ["/help","/joke","/translate","/summarize"];
quickOptions.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => { messageInput.value = opt; sendMessage(); };
    quickReplies.appendChild(btn);
});

async function sendMessage() {
    const text = messageInput.value.trim();
    if(!text) return;
    appendMessage(text, "user");
    messageInput.value = "";
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing";
    typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch("/chat", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({message:text, history:conversationHistory})
        });
        const data = await response.json();
        typingIndicator.remove();
        appendMessage(data.reply, "bot");
        conversationHistory.push({user:text, bot:data.reply});
        speak(data.reply);
    } catch(err) { console.error(err); typingIndicator.remove(); appendMessage("Error: failed to get response.", "bot"); }
}

function appendMessage(text, sender) {
    const div = document.createElement("div");
    div.className = "message " + sender;
    div.innerHTML = marked.parse(text);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Text-to-speech
function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utter);
}


// Elements


// const loginWrapper = document.getElementById("loginWrapper");
// const chatWrapper = document.getElementById("chatWrapper");
// const loginBtn = document.getElementById("loginBtn");
// const userIdInput = document.getElementById("userId");
// const passwordInput = document.getElementById("password");
// const loginError = document.getElementById("loginError");
// const chatMessages = document.getElementById("chatMessages");
// const messageInput = document.getElementById("messageInput");
// const sendBtn = document.getElementById("sendBtn");
// const voiceBtn = document.getElementById("voiceBtn");
// const fileBtn = document.getElementById("fileBtn");
// const fileInput = document.getElementById("fileInput");
// const themeToggle = document.getElementById("themeToggle");
// const chatLogo = document.getElementById("chatLogo");
// const welcomeMessage = document.getElementById("welcomeMessage");
// const historyList = document.getElementById("historyList");

// let conversationHistory = [];
// let currentTheme = 'dark';

// // Dummy login credentials
// const USERS = { "user1":"password1", "user2":"password2" };

// loginBtn.addEventListener("click", () => {
//     const id = userIdInput.value.trim();
//     const pw = passwordInput.value.trim();
//     if(USERS[id] && USERS[id]===pw){
//         loginWrapper.style.display = "none";
//         chatWrapper.style.display = "flex";
//         showWelcome();
//     } else {
//         loginError.textContent = "Invalid credentials!";
//     }
// });

// // Theme toggle
// themeToggle.addEventListener("click", ()=>{
//     document.body.classList.toggle("light");
//     document.body.classList.toggle("dark");
//     currentTheme = document.body.classList.contains("light") ? "light":"dark";
//     chatLogo.src = currentTheme==="light"?"/static/logo_dark.png":"/static/logo_light.png";
//     themeToggle.textContent = currentTheme==="light"?"🌙":"☀️";
// });

// // Welcome message
// function showWelcome(){
//     welcomeMessage.style.display="block";
//     setTimeout(()=>{ welcomeMessage.style.display="none"; },4000);
// }

// // Voice input
// voiceBtn.addEventListener("click", ()=>{
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.lang='en-US';
//     recognition.start();
//     recognition.onresult = e=>{
//         messageInput.value = e.results[0][0].transcript;
//         sendMessage();
//     }
// });

// // File input
// fileBtn.addEventListener("click", ()=> fileInput.click());
// fileInput.addEventListener("change", async ()=>{
//     const file = fileInput.files[0];
//     if(!file) return;
//     appendMessage(`📎 ${file.name}`, "user");
//     chatMessages.scrollTop = chatMessages.scrollHeight;
//     const formData = new FormData();
//     formData.append("file", file);
//     try{
//         const res = await fetch("/upload",{method:"POST", body: formData});
//         const data = await res.json();
//         appendMessage(data.reply, "bot");
//         addHistory("File: "+file.name, data.reply);
//     } catch(err){ appendMessage("Failed to send file.","bot"); }
// });

// // Quick replies
// const quickOptions = ["/help","/joke","/translate","/summarize"];
// quickOptions.forEach(opt=>{
//     const btn = document.createElement("button");
//     btn.textContent=opt;
//     btn.onclick=()=>{ messageInput.value=opt; sendMessage(); };
//     document.getElementById("quickReplies").appendChild(btn);
// });

// // Send message
// sendBtn.addEventListener("click", sendMessage);
// messageInput.addEventListener("keypress", e=>{if(e.key==="Enter") sendMessage();});

// async function sendMessage(){
//     const text = messageInput.value.trim();
//     if(!text) return;
//     appendMessage(text,"user");
//     addHistory(text,"");
//     messageInput.value="";
//     const typing = document.createElement("div");
//     typing.className="typing";
//     typing.innerHTML='<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
//     chatMessages.appendChild(typing);
//     chatMessages.scrollTop=chatMessages.scrollHeight;

//     try{
//         const response = await fetch("/chat",{
//             method:"POST",
//             headers:{"Content-Type":"application/json"},
//             body: JSON.stringify({message:text, history:conversationHistory})
//         });
//         const data = await response.json();
//         typing.remove();
//         appendMessage(data.reply,"bot");
//         addHistory("",data.reply);
//         conversationHistory.push({user:text,bot:data.reply});
//     } catch(err){ typing.remove(); appendMessage("Error: failed to get response.","bot"); }
// }

// function appendMessage(text,sender){
//     const div = document.createElement("div");
//     div.className="message "+sender;
//     div.innerHTML = marked.parse(text);
//     chatMessages.appendChild(div);
//     chatMessages.scrollTop=chatMessages.scrollHeight;
// }

// function addHistory(userText, botText){
//     const li = document.createElement("li");
//     li.textContent = userText ? "You: "+userText : "Bot: "+botText;
//     historyList.appendChild(li);
// }


// const messageInput = document.getElementById("messageInput");
// const sendBtn = document.getElementById("sendBtn");
// const chatMessages = document.getElementById("chatMessages");
// const voiceBtn = document.getElementById("voiceBtn");
// const fileBtn = document.getElementById("fileBtn"); // New button for files/images
// const themeToggle = document.getElementById("themeToggle");
// const quickReplies = document.getElementById("quickReplies");
// const chatLogo = document.querySelector(".chat-logo");

// let conversationHistory = [];

// // Theme toggle with dynamic logo
// themeToggle.addEventListener("click", () => {
//     document.body.classList.toggle("light");
//     themeToggle.textContent = document.body.classList.contains("light") ? "🌙" : "☀️";
//     // Switch logo based on theme
//     chatLogo.src = document.body.classList.contains("light") ? "/static/logo_dark.png" : "/static/logo_light.png";
// });

// // Send message
// sendBtn.addEventListener("click", sendMessage);
// messageInput.addEventListener("keypress", e => { if(e.key === "Enter") sendMessage(); });

// // Voice input
// voiceBtn.addEventListener("click", () => {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.lang = 'en-US';
//     recognition.start();
//     recognition.onresult = e => {
//         messageInput.value = e.results[0][0].transcript;
//         sendMessage();
//     };
// });

// // File/image upload
// fileBtn.addEventListener("change", async () => {
//     const file = fileBtn.files[0];
//     if(!file) return;
//     appendMessage(`📎 ${file.name}`, "user");
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//         const res = await fetch("/upload", { method:"POST", body: formData });
//         const data = await res.json();
//         appendMessage(data.reply, "bot");
//         conversationHistory.push({user: file.name, bot: data.reply});
//     } catch(err) {
//         console.error(err);
//         appendMessage("Failed to send file.", "bot");
//     }
// });

// // Quick replies example
// const quickOptions = ["/help","/joke","/translate","/summarize"];
// quickOptions.forEach(opt => {
//     const btn = document.createElement("button");
//     btn.textContent = opt;
//     btn.onclick = () => { messageInput.value = opt; sendMessage(); };
//     quickReplies.appendChild(btn);
// });

// async function sendMessage() {
//     const text = messageInput.value.trim();
//     if(!text) return;
//     appendMessage(text, "user");
//     messageInput.value = "";

//     const typingIndicator = document.createElement("div");
//     typingIndicator.className = "typing";
//     typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
//     chatMessages.appendChild(typingIndicator);
//     chatMessages.scrollTop = chatMessages.scrollHeight;

//     try {
//         const response = await fetch("/chat", {
//             method: "POST",
//             headers: {"Content-Type":"application/json"},
//             body: JSON.stringify({message: text, history: conversationHistory})
//         });
//         const data = await response.json();
//         typingIndicator.remove();
//         appendMessage(data.reply, "bot");
//         conversationHistory.push({user:text, bot:data.reply});
//     } catch(err) {
//         console.error(err);
//         typingIndicator.remove();
//         appendMessage("Error: failed to get response.", "bot");
//     }
// }

// function appendMessage(text, sender) {
//     const div = document.createElement("div");
//     div.className = "message " + sender;
//     div.innerHTML = text;
//     chatMessages.appendChild(div);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// }

// const chatbox = document.getElementById("chatbox");
// const userInput = document.getElementById("userInput");
// const sendBtn = document.getElementById("sendBtn");
// const voiceBtn = document.getElementById("voiceBtn");
// const fileBtn = document.getElementById("fileBtn");
// const fileInput = document.getElementById("fileInput");
// const themeToggle = document.getElementById("themeToggle");
// const logo = document.getElementById("logo");

// let history = [];
// let darkMode = true;

// // Append message to chat
// function appendMessage(sender, text) {
//   const msg = document.createElement("div");
//   msg.className = `message ${sender}`;
//   msg.textContent = text;
//   chatbox.appendChild(msg);
//   chatbox.scrollTop = chatbox.scrollHeight;
// }

// // Send message
// async function sendMessage() {
//   const text = userInput.value.trim();
//   if(!text) return;
//   appendMessage("user", text);
//   userInput.value = "";

//   const res = await fetch("/chat", {
//     method:"POST",
//     headers:{"Content-Type":"application/json"},
//     body: JSON.stringify({ message:text, history })
//   });
//   const data = await res.json();
//   appendMessage("bot", data.reply);

//   history.push({ user:text, bot:data.reply });
// }

// sendBtn.onclick = sendMessage;
// userInput.addEventListener("keypress", e => {
//   if(e.key === "Enter") sendMessage();
// });

// // Quick replies
// function sendQuick(text){
//   userInput.value = text;
//   sendMessage();
// }

// // File upload
// fileBtn.onclick = () => fileInput.click();
// fileInput.onchange = async () => {
//   const file = fileInput.files[0];
//   if(!file) return;
//   appendMessage("user", `[Uploaded: ${file.name}]`);

//   const formData = new FormData();
//   formData.append("file", file);

//   const res = await fetch("/upload", { method:"POST", body: formData });
//   const data = await res.json();
//   appendMessage("bot", data.reply);

//   history.push({ user:`Uploaded: ${file.name}`, bot:data.reply });
// };

// // Voice input
// let isRecognizing = false;

// if ("webkitSpeechRecognition" in window) {
//   recognition = new webkitSpeechRecognition();
//   recognition.continuous = false;
//   recognition.interimResults = false;
//   recognition.lang = "en-US";

//   recognition.onstart = () => { isRecognizing = true; };
//   recognition.onend = () => { isRecognizing = false; };

//   recognition.onresult = (event) => {
//     const text = event.results[0][0].transcript;
//     userInput.value = text;
//     sendMessage();
//   };
// }

// voiceBtn.onclick = () => {
//   if (recognition && !isRecognizing) {
//     recognition.start();
//   }
// };


// // Theme toggle
// themeToggle.onclick = () => {
//   document.body.classList.toggle("light");
//   darkMode = !darkMode;
//   themeToggle.textContent = darkMode ? "🌙" : "☀️";
//   logo.src = darkMode ? "static/logo_dark.png" : "static/logo_light.png";
// };
