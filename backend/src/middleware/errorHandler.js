import { AppError } from "./AppError.js";

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      details: error.details
    });
  }

  return res.status(500).json({
    error: "Internal server error"
  });
};
