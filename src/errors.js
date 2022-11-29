/**
 * All error classes
 */
//  const errorCodes = require("../json/error-codes");

class InvalidArgumentsError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidArgumentsError";
    this.errorCode = -1;
  }
}

class InvalidPaymentMethodError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidPaymentMethodError";
    this.errorCode = -2;
  }
}

class InvalidResponseError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidResponseError";
    this.errorCode = -3;
  }
}

class MethodNotImplementedError extends Error {
  constructor(message) {
    super(message);
    this.name = "MethodNotImplementedError";
    this.errorCode = -4;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.errorCode = -5;
  }
}

class PaymentFailedError extends Error {
  constructor(message) {
    super(message);
    this.name = "PaymentFailedError";
    this.errorCode = -6;
  }
}

module.exports = {
  InvalidArgumentsError: InvalidArgumentsError,
  InvalidPaymentMethodError: InvalidPaymentMethodError,
  InvalidResponseError: InvalidResponseError,
  MethodNotImplementedError: MethodNotImplementedError,
  NotFoundError: NotFoundError,
  PaymentFailedError: PaymentFailedError,
};
