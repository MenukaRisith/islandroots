function notFoundHandler(_req, res, _next) {
  res.status(404).json({
    error: "API route not found"
  });
}

module.exports = {
  notFoundHandler
};
