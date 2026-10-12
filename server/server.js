const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");

const app = express();
const server = http.createServer(app);

// For local development only. Configure an explicit origin allow-list and HTTPS/WSS
// before deploying to the public internet.
const io = new Server(server, {
  cors: { origin: process.env.ALLOWED_ORIGIN || "http://localhost:8080" }
});

const PORT = Number(process.env.PORT || 3000);
const sessions = new Map(); // sessionCode -> { senderId, viewerId, expiresAt }

function makeCode() {
  // Six-digit pairing code; production should also rate-limit attempts.
  return String(crypto.randomInt(100000, 1000000));
}

function cleanExpired() {
  const now = Date.now();
  for (const [code, session] of sessions) {
    if (session.expiresAt <= now) sessions.delete(code);
  }
}
setInterval(cleanExpired, 30_000).unref();

app.get("/health", (_req, res) => res.json({ ok: true, service: "consent-screen-share-signaling" }));

io.on("connection", (socket) => {
  socket.on("create-session", (_payload, callback) => {
    cleanExpired();
    let code = makeCode();
    while (sessions.has(code)) code = makeCode();
    sessions.set(code, {
      senderId: socket.id,
      viewerId: null,
      expiresAt: Date.now() + 5 * 60 * 1000
    });
    socket.data.sessionCode = code;
    socket.data.role = "sender";
    if (typeof callback === "function") callback({ ok: true, code, expiresInSeconds: 300 });
  });

  socket.on("join-session", (payload, callback) => {
    cleanExpired();
    const code = String(payload?.code || "").trim();
    const session = sessions.get(code);
    if (!session || session.viewerId || session.expiresAt <= Date.now()) {
      if (typeof callback === "function") callback({ ok: false, error: "Invalid, expired, or already-used code." });
      return;
    }
    session.viewerId = socket.id;
    socket.data.sessionCode = code;
    socket.data.role = "viewer";
    socket.join(code);
    const sender = io.sockets.sockets.get(session.senderId);
    if (sender) sender.join(code);
    if (typeof callback === "function") callback({ ok: true });
    io.to(session.senderId).emit("viewer-joined", { code });
  });

  // Relay WebRTC signaling messages only within a paired session.
  for (const eventName of ["webrtc-offer", "webrtc-answer", "webrtc-ice"]) {
    socket.on(eventName, (payload) => {
      const code = socket.data.sessionCode;
      const session = code && sessions.get(code);
      if (!session || session.expiresAt <= Date.now()) return;
      const allowed = socket.id === session.senderId || socket.id === session.viewerId;
      if (!allowed) return;
      const targetId = socket.id === session.senderId ? session.viewerId : session.senderId;
      if (targetId) io.to(targetId).emit(eventName, payload);
    });
  }

  socket.on("stop-session", () => {
    const code = socket.data.sessionCode;
    if (code) {
      io.to(code).emit("sharing-stopped");
      sessions.delete(code);
    }
  });

  socket.on("disconnect", () => {
    const code = socket.data.sessionCode;
    if (code) {
      const session = sessions.get(code);
      if (session) {
        io.to(code).emit("peer-disconnected");
        sessions.delete(code);
      }
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Signaling server listening on port ${PORT}`);
});
