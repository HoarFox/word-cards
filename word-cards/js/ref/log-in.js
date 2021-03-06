"use strict";

class Log_in {
  constructor() {
    this.class = "modal";
    this.id = "active-modal";
    this.el;
    this.userRegExp = /[A-z0-9]/;
    this.passRegExp = /[A-z0-9"!#$%&'()*+,.:;<=>?@\]\[^_`{}~"\/\\\-]/;
    this.html = /*html*/ `

        <div class="modal__dialog">
            
            <div class="log-in">

                <div class="modal__header">
                    <div class="modal__title">
                        <h3>Log in</h3>
                    </div>
                    <div class="modal__close">
                      <svg height="17" width="17" fill="#fff">
                        <use href="img/sprite.svg#icon__close"></use>
                      </svg>
                    </div>
                </div>

                <div class="modal__content">

                    <div class="modal__username-error"></div>
                    <input type="text" class="input pad5 fz17 height4r br-bottom2 bcc-whiteblue brc-grey f-brc-yellow username" id="username" placeholder="Type your username">
                    <label for="" class="label modal__label">USERNAME</label>

                    <div class="modal__password-error"></div>
                    <input type="password" class="input pad5 fz17 height4r br-bottom2 bcc-whiteblue brc-grey f-brc-yellow password" id="password" placeholder="Type your password">
                    <label for="" class="label modal__label">PASSWORD</label>

                    <div class="modal__log-in" data-checking="false">
                        <button class="btn width100 bcc-lightblue pad15-30 brr5 fz175 white h-grey h-bcc-yellow" onclick="modal.checkValues.call(modal)">
                            <span>Log in</span>
                        </button>
                        <div class="modal__loading-spinner"></div>
                    </div>

                    <div class="modal__options">
                        <p>Don't have an account?   <button class="btn white fz15 inline-block black h-yellow" onclick="htmlGen.sign_up()">Sign up!</button></p>
                        
                    </div>
                </div>

            </div>	
            
        </div>`;

    this.render();

    this.userEl = this.el.querySelector(".username");
    this.passEl = this.el.querySelector(".password");
    this.userErrEl = this.el.querySelector(".modal__username-error");
    this.passErrEl = this.el.querySelector(".modal__password-error");
    this.logInBtn = this.el.querySelector(".modal__log-in");
  }

  // Methods

  render() {
    this.checkForModal();
    let el = htmlGen.createEl(this);
    document.body.appendChild(el);
    setTimeout(() => {
      el.querySelector(".modal__dialog").classList.add("activated");
    }, 0);

    this.el = el;

    el.querySelector(".modal__close").addEventListener("mousedown", () => {
      htmlGen.deleteEl(this.class);
    });

    el.addEventListener("mousedown", (e) => {
      if (e.target === el) {
        htmlGen.deleteEl(this.class);
      }
    });
  }

  checkForModal() {
    let el = document.getElementById("active-modal");
    if (el) {
      el.parentNode.removeChild(el);
    }
  }

  async checkValues(el) {
    this.logInBtn.dataset.checking = true;

    let userValue = this.userEl.value,
      passValue = this.passEl.value,
      userErrValue,
      passErrValue;

    if (await this.checkValue(userValue, "/log_in/no_user")) {
      userErrValue = `Username ${userValue} does not exist`;
    }

    if (await this.checkValue(userValue, "/log_in/invalid_char/username")) {
      userErrValue =
        "Your username may only contain latin letters and numbers.";
    }

    if (await this.checkValue(userValue, "/log_in/is_empty")) {
      userErrValue = "Please enter a username.";
    }

    if (this.createError(this.userErrEl, this.passErrEl, userErrValue)) {
      if (
        await this.checkValue(
          passValue,
          "/log_in/incorrect_password",
          userValue
        )
      ) {
        passErrValue = "The password you entered is incorrect. Try again...";
      }

      if (await this.checkValue(passValue, "/log_in/invalid_char/password")) {
        passErrValue =
          "Your password may only contain latin letters, numbers and special symbols.";
      }

      if (await this.checkValue(passValue, "/log_in/is_empty")) {
        passErrValue = "Please enter a password.";
      }

      this.createError(this.passErrEl, this.userErrEl, passErrValue);
    }

    if (!userErrValue && !passErrValue) {
      await this.login(userValue, passValue);
    }
  }

  createError(target1, target2, errValue) {
    target1.innerHTML = "";
    target2.innerHTML = "";

    if (!errValue) {
      return true;
    } else {
      let el = document.createElement("ul");
      el.className = "modal__error-list";

      let li = document.createElement("li");
      li.innerHTML = errValue;
      el.appendChild(li);

      target1.appendChild(el);

      this.logInBtn.dataset.checking = false;

      return false;
    }
  }

  httpParam(method, data, cred) {
    let obj = {
      method: method,
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(data),
    };
    if (cred) obj.credentials = "include";
    return obj;
  }

  async checkValue(str, route, opt) {
    let reqData = {
      data: str,
    };

    if (opt) {
      reqData = {
        username: opt,
        password: str,
      };
    }

    let httpParam = new HttpParam("POST", reqData);

    let response = await fetch(url + route, httpParam);
    let resData = JSON.parse(await response.text());
    return resData.result;
  }

  async login(username, password) {
    let reqData = {
      username,
      password,
    };

    let httpParam = new HttpParam("POST", reqData, true);
    let response = await fetch(url + "/log_in/log_in", httpParam);

    if (response.status == 200) {
      let data = JSON.parse(await response.text());

      localStorage.setItem("value", data.token);

      this.checkForModal();
      location.href = hashValues.home;
      htmlGen.startDashboard();
    }
    return;
  }
}
