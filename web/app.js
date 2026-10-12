const statusEl = document.getElementById("status");
const stateEl = document.getElementById("screen-state");
const form = document.getElementById("join-form");
const video = document.getElementById("remote-video");

let socket = null;
try {
  if (typeof io === "function") {
    socket = io("http://localhost:3000", { transports: ["websocket", "polling"] });
    socket.on("connect", () => {
      statusEl.textContent = "Signaling server connected. Enter a valid temporary session code.";
    });
    socket.on("connect_error", () => {
      statusEl.textContent = "Can't reach the local signaling server. Start it in the server folder.";
    });
    socket.on("sharing-stopped", () => {
      stateEl.textContent = "Sharing stopped";
      statusEl.textContent = "The sharing device stopped the session.";
      video.srcObject = null;
      video.style.display = "none";
    });
    socket.on("peer-disconnected", () => {
      stateEl.textContent = "Peer disconnected";
      statusEl.textContent = "The other device disconnected.";
    });
  } else {
    statusEl.textContent = "Signaling script unavailable. Start the server and check the Socket.IO URL.";
  }
} catch (_error) {
  statusEl.textContent = "Unable to initialize signaling. Check server configuration.";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const code = document.getElementById("code").value.replace(/\s/g, "");
  if (!/^\d{6}$/.test(code)) {
    statusEl.textContent = "Enter the six-digit session code.";
    return;
  }
  if (!socket || !socket.connected) {
    statusEl.textContent = "No signaling connection. Start the server first.";
    return;
  }
  socket.emit("join-session", { code }, (result) => {
    if (result?.ok) {
      statusEl.textContent = "Code accepted. WebRTC video is not connected in this starter yet.";
      stateEl.textContent = "Paired — awaiting WebRTC";
    } else {
      statusEl.textContent = result?.error || "Could not join the session.";
    }
  });
});
