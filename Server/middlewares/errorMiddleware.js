const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  console.log("❌ Error:", err.stack);
  res.status(statusCode).res.json({
    message: err.message || "Something went wrong!",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
