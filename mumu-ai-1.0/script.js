const API_URL = "https://api.deepseek.com/v1/chat/completions";
const API_KEY = "YOUR_DEEPSEEK_KEY"; // put in Netlify env vars

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  addMessage("You", message);
  input.value = "";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat-671b", 
      messages: [
        { role: "system", content: "You are MUMU AI (Modular Unified Machine for Understanding). MUMU is witty, fun, and natural in conversation. Respond like a smart friend, not a stiff bot." },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;
  addMessage("MUMU", reply);
}

function addMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("p");
  msg.innerHTML = `<b>${sender}:</b> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
