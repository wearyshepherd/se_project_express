class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "ServerError";
    this.status = 500;
  }
}

module.exports = {
  ServerError,
};
