class Flashcards {
  constructor(id) {
    if (active.newModule) htmlGen.hideCreateModule();

    this.class = "flashcards";
    this.render(id);
  }

  gameHtml() {
    this.html = /*html*/ `
        
        <div class="container">
            <div class="game__main">

                <div class="game__controls-container">

                    <div class="game__controls">

                        <div class="game__back">
                            <button class="btn grey ai-c ta-l fz17 width100 pad15-20 h-bcc-yellow" onclick="active.return()">
                            
                                <svg height="15" width="15">
                                  <use href="img/sprite.svg#icon__triangle_left"></use>
                                </svg>
                                <span>Back</span>
                                
                            </button>
                        </div>

                        <div class="game__title">
                            <svg height="40" width="40">
                                <use href="img/sprite.svg#icon__cards"></use>
                            </svg>
                            <span>Flashcards</span>
                        
                        </div>


                        <div class="game__progress">
                            <div class="game__progress-bar">
                                <div class="game__bar-fill"></div>
                            </div>
                            <div class="game__progress-info">

                                <div class="game__progress-title">
                                    <span>progress</span>
                                </div>

                                <div class="game__progress-count">
                                    <span>0</span><span>/${this.number}</span>
                                </div>

                            </div>
                        </div>

                        <div class="game__control-buttons">

                            <div class="game__method">
                                <div class="game__method-tilte">
                                    Answer with:
                                </div>
                                <button class="btn width100 fz15 pad7 br2 brc-grey-medium brr5 lightblue h-yellow" onclick="active.methodMenuToggle();">
                                    <svg height="13" width="13">
                                        <use href="img/sprite.svg#icon__down_arrow"></use>
                                    </svg>
                                    <span>Term</span>
                                </button>
                                <div class="game__method-menu-container hidden">
                                    <div class="game__method-menu">
                                        <div class="game__method-menu-item" data-method="term">
                                            <span>Term</span>
                                        </div>
                                        <div class="game__method-menu-item" data-method="defenition">
                                            <span>Defenition</span>
                                        </div>
                                    </div>
                                </div>

                                
                                
                            </div>

                            <div class="game__shuffle">
                                <button class="btn width100 fz15 pad7 br2 brc-grey-medium brr5 lightblue h-yellow" onclick="active.toggleShuffle();">
                                    <svg height="20" width="20">
                                        <use href="img/sprite.svg#icon__shuffle"></use>
                                    </svg>
                                    <span>Shuffle</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                
                <div class="game__content-container">

                    <div class="game__content">

                        <div class="game__components">


                            <div class="game__cards-container">
                                
                            </div>

                            <div class="game__nav">

                                <div class="game__nav-item prev">
                                    <button class="btn pad15 bcc-white brr50p d-f h-bcc-yellow mar-left-a p-r" onclick="active.switchCard(false)">
                                        <svg>
                                            <use href="img/sprite.svg#icon__triangle_left"></use>
                                        </svg>
                                    </button>
                                </div>

                                <div class="game__nav-item next">
                                    <button class="btn pad15 bcc-white brr50p d-f h-bcc-yellow p-r" onclick="active.switchCard(true)">
                                        <svg>
                                            <use href="img/sprite.svg#icon__triangle_right"></use>
                                        </svg>
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
  }

  cardHtml({ term, defenition, imgurl }, active, defAnswer) {
    return {
      class: "game__card", // next transparent
      id: "",
      html: /*html*/ `
        <div class="game__card-front ${defAnswer ? "rearside" : ""} ${
        active ? "" : "transparent next"
      }">
            <div class="game__img-container ${imgurl === "" ? "hidden" : ""} ${
        defenition === "" ? "full" : ""
      }">
                <div class="game__img" style="background-image: url(${
                  imgurl !== "" ? imgurl : ""
                });"></div>
            </div>

            <div class="game__defenition-container ${
              imgurl === "" ? "full" : ""
            } ${defenition === "" ? "hidden" : ""}">
                <div class="game__speaker-flashcards" data-active="${
                  voice.working &&
                  defenition !== "" &&
                  voice.detectLanguage(defenition)
                    ? "true"
                    : "false"
                }" data-speaking="false">
                  <svg height="22" width="22">
                    <use href="img/sprite.svg#icon__speaker"></use>
                  </svg>
                </div>
                <div class="game__defenition">
                    <p>${defenition}</p>
                </div>
            </div>
        </div>
        <div class="game__card-back ${defAnswer ? "" : "rearside"} ${
        active ? "" : "transparent next"
      }">
            <div class="game__term-container ${term === "" ? "hidden" : ""}">
                <div class="game__speaker-flashcards" data-active="${
                  voice.working && term !== "" && voice.detectLanguage(term)
                    ? "true"
                    : "false"
                }" data-speaking="false">
                  <svg height="22" width="22">
                    <use href="img/sprite.svg#icon__speaker"></use>
                  </svg>
                  
                </div>
                <div class="game__term">
                  <p>${term}</p>
                </div>
                
            </div>
        </div>`,
    };
  }

  endGameHtml(num) {
    return {
      class: "game__card", // next transparent
      id: "",
      html: /*html*/ `
        <div class="game__card-front unturnable next transparent">
            <h1 class="game__card-message">Nice work!</h1>
            <p class="game__card-message-info">You've just studied ${num} terms!</p>
            <button class="btn bcc-lightblue pad30 brr5 white fz175 h-grey h-bcc-yellow width50" onclick="active.end()">Finish up</button>
        </div>
        <div class="game__card-back unturnable rearside next transparent"></div>
        `,
    };
  }

  async render(id) {
    htmlGen.deleteEl(active.class);
    htmlGen.toggleGameButtons();

    let response = await this.getModule(id);
    if (!response) {
      location.href = hashValues.home;
      return;
    }

    Object.assign(this, response);

    this.gameHtml();

    let el = htmlGen.createEl(this);

    htmlGen.toggleSpinner(false);
    document.body.append(el);

    this.progress = 0;
    this.answerWithDefenition = false;
    this.shuffled = false;

    this.cardsContainer = document.querySelector(".game__cards-container");
    this.gameControls = document.querySelector(".game__controls");
    // -----------------------------
    this.methodMenu = document.querySelector(".game__method-menu-container");
    this.buttonMenu = document.querySelector(".game__method-menu-container");
    this.cardShuffle = document.querySelector(".game__shuffle");
    // -----------------------------
    this.progressCount = document.querySelectorAll(
      ".game__progress-count span"
    )[0];
    this.progressBar = document.querySelector(".game__bar-fill");
    this.methodTitle = document.querySelector(".game__method button span");

    this.cardsContainer.addEventListener("click", this.flipCard);

    this.gameControls.addEventListener("click", (e) => {
      let el = e.target.closest(".game__method-menu-item");
      if (el) {
        if (el.dataset.method === "term") this.methodChange(false);
        if (el.dataset.method === "defenition") this.methodChange(true);
      }
    });

    this.cardsContainer.addEventListener("click", (e) => {
      let speaker = e.target.closest(
        ".game__speaker-flashcards[data-active=true]"
      );
      if (speaker && !voice.synth.speaking) {
        let term = speaker.closest(".game__term-container");
        let defenition = speaker.closest(".game__defenition-container");

        let text;
        if (term) text = term.querySelector(".game__term p").textContent;
        if (defenition)
          text = defenition.querySelector(".game__defenition p").textContent;

        if (text !== "" && speaker.dataset.active !== "false") {
          speaker.dataset.speaking = true;
          let speakText = voice.speak(text);

          speakText.onend = (e) => {
            speaker.dataset.speaking = false;
          };
        }
      } else if (speaker && voice.synth.speaking) {
        voice.cancel();
      }
    });

    this.appendCards(this.cards);

    this.cardsEl = [...document.querySelectorAll(".game__card")];
    this.activeCard = this.cardsEl[0];
  }

  appendCards(arr, defAnswer) {
    let html;
    arr.forEach((item) => {
      let number = this.cardsContainer.children.length;
      let html;
      if (number === 0) {
        html = this.cardHtml(item, true, defAnswer);
      } else {
        html = this.cardHtml(item, false, defAnswer);
      }

      let el = htmlGen.createEl(html, true);

      this.cardsContainer.append(el);
    });

    let endCardEl = htmlGen.createEl(this.endGameHtml(this.number));
    this.cardsContainer.append(endCardEl);
  }

  get activeFront() {
    return this.activeCard.querySelector(".game__card-front");
  }

  get activeBack() {
    return this.activeCard.querySelector(".game__card-back");
  }

  setProgress(num) {
    if (num > this.number) num = this.number;
    if (num < 0) num = 0;
    this.progressCount.textContent = num;
    this.progress = num;
    this.progressBar.style.width = `${(num / this.number) * 100}%`;
  }

  switchCard(forward) {
    let ind = this.cardsEl.indexOf(this.activeCard);
    if (ind == (forward ? this.number : 0)) return;

    this.activeFront.classList.add("transparent");
    this.activeFront.classList.add(forward ? "prev" : "next");
    if (this.answerWithDefenition) {
      this.activeFront.classList.add("rearside");
    } else {
      this.activeFront.classList.remove("rearside");
    }

    this.activeBack.classList.add("transparent");
    this.activeBack.classList.add(forward ? "prev" : "next");
    if (this.answerWithDefenition) {
      this.activeBack.classList.remove("rearside");
    } else {
      this.activeBack.classList.add("rearside");
    }

    let newInd = ind + (forward ? 1 : -1);
    this.activeCard = this.cardsEl[newInd];
    this.setProgress(newInd);

    this.activeFront.classList.remove("transparent");
    this.activeFront.classList.remove(forward ? "next" : "prev");
    this.activeBack.classList.remove("transparent");
    this.activeBack.classList.remove(forward ? "next" : "prev");
  }

  flipCard(event) {
    if (
      event.target.closest(".game__card") &&
      !event.target.closest(".game__speaker-flashcards")
    ) {
      active.activeFront.classList.toggle("rearside");
      active.activeBack.classList.toggle("rearside");
    }
  }

  methodMenuToggle() {
    let target;
    modal ? (target = modal.methodMenu) : (target = active.methodMenu);
    target.classList.toggle("hidden");

    if (target.classList.contains("hidden")) {
      setTimeout(() => {
        document.removeEventListener("click", active.methodMenuToggle);
      }, 0);
    } else {
      setTimeout(() => {
        document.addEventListener("click", active.methodMenuToggle);
      }, 0);
    }
  }

  methodChange(defenition) {
    if (this.answerWithDefenition !== defenition) {
      this.cardsContainer.innerHTML = "";
      this.setProgress(0);
    } else {
      return;
    }

    let methodTitleModal;
    if (modal) {
      methodTitleModal = modal.el.querySelector(".game__method button span");
    }

    if (defenition) {
      this.answerWithDefenition = true;
      this.appendCards(this.cards, this.answerWithDefenition);
      this.methodTitle.textContent = "Defenition";
      if (modal) methodTitleModal.textContent = "Defenition";
    } else {
      this.answerWithDefenition = false;
      this.appendCards(this.cards, this.answerWithDefenition);
      this.methodTitle.textContent = "Term";
      if (modal) methodTitleModal.textContent = "Term";
    }

    this.cardsEl = [...document.querySelectorAll(".game__card")];
    this.activeCard = this.cardsEl[0];
  }

  toggleShuffle() {
    this.cardShuffle.classList.toggle("active");
    if (modal) modal.cardShuffle.classList.toggle("active");
    this.shuffle();
  }

  shuffle() {
    this.shuffled = !this.shuffled;
    this.cardsContainer.innerHTML = "";
    this.setProgress(0);
    if (this.shuffled) {
      // Save original order
      if (!this.originalCards) this.originalCards = [...this.cards];
      // Shuffle cards
      let arr = this.cards;
      for (let i = this.number - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      this.cards = arr;
    } else {
      if (this.originalCards) this.cards = [...this.originalCards];
    }

    this.appendCards(this.cards, this.answerWithDefenition);
    this.cardsEl = [...document.querySelectorAll(".game__card")];
    this.activeCard = this.cardsEl[0];
  }

  async getModule(id) {
    let reqData = {
      id,
    };
    let httpParam = new HttpParam("POST", reqData, true);
    let response = await fetch(url + "/edit/get_module", httpParam);
    if (response.ok) return JSON.parse(await response.text());
    return false;
  }

  return() {
    location.href = `${hashValues.module}?id=${this._id}`;
  }

  end() {
    console.log("Saving and sending statistcs...");
    location.href = `${hashValues.module}?id=${this._id}`;
  }
}