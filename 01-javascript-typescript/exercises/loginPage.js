// loginPage.js
// Page Object for the login page.
// Encapsulates the page's fields and actions so tests stay short and readable.
const { fakeLogin } = require('./warmup');

class LoginPage {
    constructor() {
        // Initial state of a freshly opened login page
        this.username = '',
        this.password = '',
        this.message = ''
    }

    /**
   * Types a value into the username field.
   * @param {string} value
   */

    fillUsername(value) {
        this.username = value;
  }

   /**
   * Types a value into the password field.
   * @param {string} value
   */

    fillPassword(value) {
    this.password = value;
  }

  /**
   * Submits the form and stores the server response as the page message.
   */

  async clickLogin(){
    this.message = await fakeLogin(this.username, this.password);
  }

   /**
   * Returns the message currently shown on the page.
   * @returns {string}
   */

   getMessage(){
    return this.message;
   }


    /**
   * Full login flow: fill both fields and submit.
   * Use the individual methods for partial or negative flows.
   * @param {string} username
   * @param {string} password
   */

    async login(username, password){
        this.fillUsername(username);
        this.fillPassword(password);
        await this.clickLogin();
    }
}

module.exports = { LoginPage };
