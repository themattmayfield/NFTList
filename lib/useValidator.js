import React from "react";
import validator from "validator";

const useValidator = () => {
  const validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Required";
    } else if (!validator.isEmail(value)) {
      error = "Invalid email address";
    }

    return error;
  };

  const validateWebsite = (value) => {
    let error;
    if (!value) {
      error = "Required";
    } else if (!validator.isURL(value)) {
      error = "Invalid url";
    }

    return error;
  };

  const validatePhone = (value) => {
    let error;
    if (!value) {
      error = "Required";
    } else if (!validator.isMobilePhone(value)) {
      error = "Invalid phone number";
    }

    return error;
  };

  const validateAlpha = (value) => {
    let error;
    if (!value) {
      error = "Required";
    } else if (!validator.isAlpha(value)) {
      error = "No numbers allowed in this field";
    }

    return error;
  };

  const validatePostal = (value) => {
    let error;
    if (!value) {
      error = "Required";
    } else if (!validator.isPostalCode(value, "any")) {
      error = "Invalid Postal Code";
    }

    return error;
  };

  const validatePassword = (value) => {
    let error;
    if (!value) {
      error = "Required";
    } else if (!validator.isStrongPassword(value)) {
      error =
        "Password must be min 8 characters, min 1 lowercase letter, min 1 uppercase letter, min 1 number, min 1 symbol";
    }

    return error;
  };

  const validateNumeric = (value) => {
    let error;
    if (!value) {
      error = "Required";
    } else if (!validator.isNumeric(value)) {
      error = "Must contain numbers only";
    }

    return error;
  };

  const required = (value) => {
    let error;
    if (!value) {
      error = "Required";
    }

    return error;
  };

  return {
    validateEmail,
    validateWebsite,
    validatePhone,
    validateAlpha,
    validatePostal,
    validatePassword,
    validateNumeric,
    required,
  };
};

export default useValidator;
