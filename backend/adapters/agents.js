async function runAgent({ name, input }) {
  return {
    agent: name,
    received: input,
    status: "ok",
    message: "Agent adapter responding from backend/adapters/agents.js"
  };
}

module.exports = { runAgent };
