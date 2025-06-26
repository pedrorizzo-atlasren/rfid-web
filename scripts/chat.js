document.addEventListener("DOMContentLoaded", () => {
  const form     = document.getElementById("chatForm");
  const input    = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");
  let sessionId  = null;  // <- armazena aqui

  function appendMessage(text, role) {
    const wrapper = document.createElement("div");
    wrapper.className = `message ${role}`;
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = text;
    wrapper.appendChild(bubble);
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const prompt = input.value.trim();
    if (!prompt) return;

    appendMessage(prompt, "user");
    input.value = "";

    appendMessage("…carregando…", "bot");
    const loading = messages.querySelector(".message.bot:last-child .bubble");

    try {
      const headers = {
        "Content-Type": "application/json",
      };
      // só adiciona se já tivermos sessionId
      if (sessionId) {
        headers["x-session-id"] = sessionId;
      }

      const res = await fetch("http://localhost:4000/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();

      // salva sessionId para próximas vezes
      sessionId = data.session_id;

      loading.innerHTML = data.answer;
    } catch (err) {
      loading.innerHTML = `<span style="color:red;">Erro: ${err.message}</span>`;
    }
  });
});
