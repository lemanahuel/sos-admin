'use strict';

/**
 * Get unique error field name
 */
let getUniqueErrorMessage = (err) => {
  let output = null,
    fieldName = null;

  try {
    fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exist';
  } catch (ex) {
    output = 'Unique field already exist';
  }

  return output;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = (err) => {
  let message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err);
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (let errName in err.errors) {
      if (err.errors[errName].message) {
        message = err.errors[errName].message;
      }
    }
  }

  return message;
};
