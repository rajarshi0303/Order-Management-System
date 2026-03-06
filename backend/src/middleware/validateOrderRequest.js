import { AppError } from "./AppError.js";

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;
const phoneRegex = /^\+?[0-9\-\s]{7,15}$/;

export const validateCreateOrder = (req, _res, next) => {
  const errors = [];
  const { items, deliveryDetails } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    errors.push("items must be a non-empty array");
  } else {
    items.forEach((item, index) => {
      if (!isNonEmptyString(item?.menuItemId)) {
        errors.push(`items[${index}].menuItemId is required`);
      }
      if (!isPositiveInteger(item?.quantity)) {
        errors.push(`items[${index}].quantity must be a positive integer`);
      }
    });
  }

  if (!deliveryDetails || typeof deliveryDetails !== "object") {
    errors.push("deliveryDetails is required");
  } else {
    if (!isNonEmptyString(deliveryDetails.name)) {
      errors.push("deliveryDetails.name is required");
    }
    if (!isNonEmptyString(deliveryDetails.address)) {
      errors.push("deliveryDetails.address is required");
    }
    if (!isNonEmptyString(deliveryDetails.phone) || !phoneRegex.test(deliveryDetails.phone)) {
      errors.push("deliveryDetails.phone is invalid");
    }
  }

  if (errors.length > 0) {
    return next(new AppError("Validation failed", 400, errors));
  }

  return next();
};

export const validateOrderStatusPatch = (req, _res, next) => {
  const { status } = req.body || {};
  if (!isNonEmptyString(status)) {
    return next(new AppError("Validation failed", 400, ["status is required"]));
  }
  return next();
};
