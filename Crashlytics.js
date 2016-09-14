/**
 * @providesModule Crashlytics
 */
'use strict';

var { NativeModules, Platform } = require('react-native');
var SMXCrashlytics = NativeModules.SMXCrashlytics;

module.exports = {

  crash: SMXCrashlytics.crash,
  throwException: SMXCrashlytics.throwException,

  /**
   * Convert error into something the native code knows what to do with.
   * Attempts to be flexible and accept error objects in different formats.
   * We need to be careful which data types we send to the native layer.
   * Could do something much fancier here, e.g., deep, recursive serialization
   * (or "flattening") but keep it simple for now.
   * @param error
   */
  recordError: function (error) {
    var newError;

    if (typeof error === "string" || error instanceof String) {
      newError = {domain: error};
    }
    else if (typeof error === "number") {
      newError = {code: error};
    }
    else if (typeof error === "object") {
      newError = {};

      // Pass everything in as a string or number to be safe
      for (var k in error) {
        if (error.hasOwnProperty(k)) {
          if (((typeof error[k]) !== "number") && ((typeof error[k]) !== "string") && !(error[k] instanceof String)) {
            newError[k] = JSON.stringify(error[k]);
          }
          else {
            newError[k] = error[k]
          }
        }
      }
    }
    else {
      // Array?
      // Fall back on JSON
      newError = {
        json: JSON.stringify(error)
      }
    }
    SMXCrashlytics.recordError(newError);
  },

  logException: function (value) {
    SMXCrashlytics.logException(value);
  },

  log: function (message) {
    SMXCrashlytics.log(message);
  },

  setUserEmail: function (email) {
    SMXCrashlytics.setUserEmail(email);
  },

  setUserIdentifier: function (userIdentifier) {
    SMXCrashlytics.setUserIdentifier(userIdentifier);
  },

  setUserName: function (userName) {
    SMXCrashlytics.setUserName(userName);
  },

  setBool: function (key, value) {
    SMXCrashlytics.setBool(key, value);
  },

  setNumber: function (key, value) {
    // This is a hack but allows us to have a standard API for both platforms
    if (Platform.OS === 'android') {
      value = value + "";
    }
    SMXCrashlytics.setNumber(key, value);
  },

  setString: function (key, value) {
    SMXCrashlytics.setString(key, value);
  },

  recordCustomExceptionName: function(name, reason, frameArray) {
    SMXCrashlytics.recordCustomExceptionName(name, reason, frameArray);
  }
};
