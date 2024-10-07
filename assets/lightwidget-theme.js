(() => {
  var h = class {
    constructor() {
      (this.menu = document.querySelector("[data-menu]")),
        this.menu !== null &&
          ((this.toggleButton = this.menu.querySelector("button")),
          (this.svg = this.toggleButton.querySelector("svg")),
          (this.use = this.toggleButton.querySelector("svg use")),
          this._attachEvents());
    }
    _openMenu() {
      this.svg.setAttribute(
        "class",
        this.svg.getAttribute("class").replace("icon--extra-large", "")
      ),
        this.use.setAttribute(
          "xlink:href",
          this.use.getAttribute("xlink:href").replace("#menu", "#close")
        );
    }
    _closeMenu() {
      this.svg.setAttribute(
        "class",
        "".concat(this.svg.getAttribute("class"), " icon--extra-large")
      ),
        this.use.setAttribute(
          "xlink:href",
          this.use.getAttribute("xlink:href").replace("#close", "#menu")
        );
    }
    _attachEvents() {
      this.menu.addEventListener("popover", (e) => {
        e.detail === "show" ? this._openMenu() : this._closeMenu();
      });
    }
  };
  var f = class {
    constructor(e) {
      (this.form = e),
        this._clearErrorFromFormItem(),
        this._botProtection(),
        this._blockSecondSubmit(),
        this._watchForDisabledElements(),
        this._scrollToFormOnSubmit();
    }
    _clearErrorFromFormItem() {
      [].forEach.call(
        this.form.querySelectorAll("input,textarea,select"),
        (e) => {
          e.addEventListener("focus", (o) => {
            o.currentTarget.currentValue = this._getCurrentValue(
              o.currentTarget
            );
          });
          let t = e.tagName === "TEXTAREA" ? "input" : "change";
          e.addEventListener(t, (o) => {
            if (o.currentTarget.currentValue !== o.currentTarget.value) {
              o.currentTarget.currentValue = this._getCurrentValue(
                o.currentTarget
              );
              let r = o.currentTarget.closest(".form__item--invalid");
              r !== null && r.classList.remove("form__item--invalid");
            }
          });
        }
      );
    }
    _getCurrentValue(e) {
      return e.type === "radio" ? e.checked : e.value;
    }
    _botProtection() {
      this.form.classList.contains("form--protected") !== !1 &&
        this.form.addEventListener("submit", (e) => {
          e.currentTarget.querySelector(".form__input--protected").value !==
            "" && (e.stopImmediatePropagation(), e.preventDefault());
        });
    }
    _blockSecondSubmit() {
      "submitPreloader" in this.form.dataset &&
        this.form.addEventListener("submit", (e) => {
          if ("submitted" in this.form.dataset) {
            e.stopImmediatePropagation(), e.preventDefault();
            return;
          }
          this.form.dataset.submitted = "true";
          let t = this.form.querySelector('button[type="submit"]');
          t.classList.add("button--loading"), (t.disabled = !0);
        });
    }
    _watchForDisabledElements() {
      let e = new MutationObserver((t) => {
        for (let o of t)
          o.target.classList.contains("form__item--disabled")
            ? this._disableFormItem(o.target)
            : this._enableFormItem(o.target);
      });
      [].forEach.call(this.form.querySelectorAll(".form__item"), (t) => {
        e.observe(t, { attributes: !0, attributeFilter: ["class"] });
      });
    }
    _disableFormItem(e) {
      [].forEach.call(e.querySelectorAll("input"), (t, o) => {
        t.type === "range" || t.type === "checkbox" || t.type === "radio"
          ? (t.disabled = !0)
          : (t.readOnly = !0),
          t.type === "radio" && o === 0 && (t.disabled = !1);
      });
    }
    _enableFormItem(e) {
      [].forEach.call(e.querySelectorAll("input"), (t) => {
        t.type === "range" || t.type === "checkbox" || t.type === "radio"
          ? "preventEnable" in t.dataset || (t.disabled = !1)
          : (t.readOnly = !1);
      });
    }
    _scrollToFormOnSubmit() {
      this.form.hasAttribute("data-error-scroll") &&
        this.form.querySelector(".form__item--invalid, .alert--success") !==
          null &&
        this.form.scrollIntoView({ behavior: "smooth" });
    }
  };
  var g = class {
    constructor(e) {
      (this.el = e),
        (this.code = e.querySelector(".embed-code__contents")),
        (this.expandButton = e.querySelector("[data-embed-expand]")),
        (this.copyButton = e.querySelector("[data-embed-copy]")),
        this._showExpandButton(),
        this._attachEvents();
    }
    _showExpandButton() {
      this.code.scrollHeight > this.code.offsetHeight &&
        this.expandButton.classList.remove("hidden");
    }
    _attachEvents() {
      this.expandButton.addEventListener("click", () => {
        this.code.classList.add("embed-code__contents--expanded"),
          this.expandButton.classList.add("hidden");
      }),
        this.copyButton.addEventListener("click", () => {
          navigator.clipboard.writeText(this.code.textContent),
            this.copyButton.setAttribute(
              "aria-label",
              this.copyButton.dataset.successText
            ),
            setTimeout(
              () =>
                this.copyButton.setAttribute(
                  "aria-label",
                  this.copyButton.dataset.copyText
                ),
              2e3
            );
        }),
        this.code.addEventListener("click", () => {
          let e = document.createRange();
          e.selectNode(this.code);
          let t = window.getSelection();
          t.removeAllRanges(), t.addRange(e);
        });
    }
  };
  var d = class {
    constructor(e) {
      (this.sendButton = e.sendButton),
        (this.preloaderContainer = e.preloaderContainer),
        (this.url = e.url),
        (this.abortController = new AbortController()),
        (this.signal = this.abortController.signal);
    }
    send(e) {
      return this.sendButton.dataset.pending === "yes"
        ? !1
        : (this._startProcessing(),
          fetch(this.url, {
            method: "post",
            credentials: "same-origin",
            body: e,
            signal: this.signal,
          })
            .then((t) => (t.ok ? t : t.json().then((o) => Promise.reject(o))))
            .then((t) => t.json())
            .then((t) => (this._stopProcessing(), t))
            .catch((t) => {
              if (
                (this._stopProcessing(),
                Object.prototype.hasOwnProperty.call(t, "errors"))
              )
                throw ((t.aborted = !1), t);
              let o = new Error(t.message);
              throw (
                ((o.errors = t.message),
                (o.aborted = t.name === "AbortError"),
                o)
              );
            }));
    }
    abort() {
      this._stopProcessing(),
        this.abortController.abort(),
        (this.abortController = new AbortController()),
        (this.signal = this.abortController.signal);
    }
    _startProcessing() {
      (this.sendButton.dataset.pending = "yes"),
        this.preloaderContainer !== null &&
          this.preloaderContainer.classList.add("preloader");
    }
    _stopProcessing() {
      this.preloaderContainer !== null &&
        this.preloaderContainer.classList.remove("preloader"),
        (this.sendButton.dataset.pending = "");
    }
  };
  var l = class {
    constructor(e) {
      (this.modal = document.querySelector(
        '.modal[data-modal-id="'.concat(e, '"]')
      )),
        this.modal !== null &&
          ((this.actionButton = this.modal.querySelector(
            ".modal__action-button"
          )),
          (this.errorElement = this.modal.querySelector(".modal__error")),
          (this.errorMessageElement = this.errorElement.querySelector(
            ".modal__error-message"
          )),
          (this.dialog = this.modal.querySelector(".modal__dialog")),
          (this.contents = this.modal.querySelector(".modal__contents")),
          (this.focusableElements = this.modal.querySelectorAll("button, a")),
          (this.lastFocusedElement = null),
          (this.hasError = !1),
          (this.formData = null),
          (this.successCallback = () => {}),
          (this.redirect = !1),
          (this.ajax = new d({
            sendButton: this.actionButton,
            preloaderContainer: this.dialog,
            url: "/".concat(e),
          })),
          this._attachEvents());
    }
    open(e, t, o = !1) {
      (this.formData = e),
        (this.successCallback = t),
        (this.redirect = o),
        (this.lastFocusedElement = document.activeElement),
        this.modal.classList.add("modal--active"),
        this.actionButton !== null
          ? this.actionButton.focus()
          : this.focusableElements[0].focus(),
        this.modal.dispatchEvent(new CustomEvent("modal", { detail: "open" }));
    }
    close() {
      this.modal.classList.remove("modal--active"),
        this.contents.classList.remove("modal__contents--hidden"),
        this.errorElement.classList.remove("modal__error--visible"),
        (this.errorMessageElement.innerHTML = ""),
        (this.hasError = !1),
        this.lastFocusedElement !== null && this.lastFocusedElement.focus(),
        this.modal.dispatchEvent(new CustomEvent("modal", { detail: "close" }));
    }
    _getLastFocusableElement() {
      return this.hasError === !0
        ? this.focusableElements[this.focusableElements.length - 1]
        : this.focusableElements[this.focusableElements.length - 2];
    }
    _attachEvents() {
      [].forEach.call(this.modal.querySelectorAll(".modal__close"), (e) => {
        e.addEventListener("click", () => {
          this.close();
        });
      }),
        this.modal.addEventListener("keydown", (e) => {
          if (e.key === "Tab") {
            if (
              document.activeElement === this._getLastFocusableElement() &&
              e.shiftKey === !1
            ) {
              e.preventDefault(), this.focusableElements[0].focus();
              return;
            }
            if (
              document.activeElement === this.focusableElements[0] &&
              e.shiftKey === !0
            ) {
              e.preventDefault(), this._getLastFocusableElement().focus();
              return;
            }
          }
          e.key === "Escape" && this.close();
        }),
        this.actionButton !== null &&
          this.actionButton.addEventListener("click", () => {
            let e = this.ajax.send(this.formData);
            e !== !1 &&
              e
                .then((t) => {
                  if (
                    ((this.hasError = !1),
                    this.successCallback(t),
                    this.redirect === !0)
                  ) {
                    this.modal.classList.add("preloader");
                    return;
                  }
                  this.close();
                })
                .catch((t) => {
                  (this.errorMessageElement.innerHTML = t.errors),
                    this.contents.classList.add("modal__contents--hidden"),
                    this.errorElement.classList.add("modal__error--visible"),
                    (this.hasError = !0);
                });
          });
    }
  };
  var p = class {
    constructor(e) {
      (this.removeWidgetButton = document.querySelector(".remove-widget")),
        this.removeWidgetButton !== null &&
          ((this.modal = e), this._attachEvents());
    }
    _attachEvents() {
      this.removeWidgetButton.addEventListener("click", (e) => {
        let t = new FormData();
        t.append("widget[]", e.target.dataset.widgetId),
          this.modal.open(
            t,
            () => {
              window.location.assign("/my-widgets?deleted=true");
            },
            !0
          );
      });
    }
  };
  var b = class {
    constructor(e, t, o) {
      (this.removeSelectedWidgetsButton = e),
        (this.tableCheckboxes = t),
        (this.modal = o),
        this._attachEvents();
    }
    _attachEvents() {
      this.removeSelectedWidgetsButton.addEventListener("click", () => {
        let e = new FormData();
        this.tableCheckboxes.selectedCheckboxes.forEach((t) => {
          e.append("widget[]", this._getWidgetId(t));
        }),
          this.modal.open(
            e,
            () => {
              window.location.assign("/my-widgets?deleted=true");
            },
            !0
          );
      });
    }
    _getWidgetId(e) {
      return e.name.match(/widget\[(.+?)]/)[1];
    }
  };
  var _ = class {
    constructor() {
      (this.checkboxes = document.querySelectorAll(
        ".table tbody .form__input--checkbox"
      )),
        this.checkboxes.length !== 0 &&
          ((this.selectAll = document.querySelector(".table__checkbox-all")),
          (this.bulkAction = document.querySelector(".table__checkbox-action")),
          (this.selectedCheckboxes = []),
          (this.lastChecked = null),
          this._attachEvents(),
          this._toggleBulkActions());
    }
    _attachEvents() {
      [].forEach.call(this.checkboxes, (e) =>
        e.addEventListener("click", (t) => {
          t.shiftKey === !0 && t.target.checked === !0 && this._shiftClick(t),
            (this.lastChecked = t.target),
            this._toggleBulkActions();
        })
      ),
        this.selectAll.addEventListener("click", (e) => {
          [].forEach.call(this.checkboxes, (t) => {
            t.disabled !== !0 && (t.checked = e.target.checked);
          }),
            this._toggleBulkActions();
        });
    }
    _shiftClick(e) {
      let t = !1;
      [].forEach.call(this.checkboxes, (o) => {
        (o === e.target || o === this.lastChecked) && (t = !t),
          t === !0 && o.disabled === !1 && (o.checked = !0);
      });
    }
    _toggleBulkActions() {
      (this.selectedCheckboxes = [].filter.call(
        this.checkboxes,
        (e) => e.checked
      )),
        this.bulkAction !== null &&
          (this.selectedCheckboxes.length > 0
            ? this.bulkAction.classList.add("table__checkbox-action--active")
            : this.bulkAction.classList.remove(
                "table__checkbox-action--active"
              ));
    }
    uncheckAll() {
      [].forEach.call(this.checkboxes, (e) => (e.checked = !1)),
        (this.selectAll.checked = !1),
        this._toggleBulkActions();
    }
  };
  var w = class {
    constructor(e) {
      (this.el = e),
        (this.form = this.el.querySelector("[data-support-search]")),
        (this.search = this.form.querySelector('input[id="support[search]"]')),
        (this.results = this.el.querySelector("[data-support-search-results]")),
        (this.noResults = this.el.querySelector("[data-support-no-results]")),
        (this.ticketMessage = this.el.querySelector(
          'textarea[id="ticket[message]"]'
        )),
        (this.solutionsPreloader = this.el.querySelector(
          "[data-solutions-loader]"
        )),
        (this.solutionResults = this.el.querySelector(
          "[data-solution-results]"
        )),
        (this.searchThrottle = null),
        (this.ticketThrottle = null),
        (this.recordedPhrases = []),
        (this.data = []),
        (this.dataIsLoading = !1),
        this._attachEvents(),
        this._scrollToTicketForm();
    }
    _attachEvents() {
      this.search.addEventListener("keyup", (e) => {
        clearTimeout(this.searchThrottle),
          (this.searchThrottle = setTimeout(
            () => this._filter(e.target.value.toLowerCase()),
            150
          ));
      }),
        this.search.addEventListener("blur", () => {
          this.recordedPhrases.length > 0 &&
            fetch(
              "/search-support?query=".concat(
                encodeURI(this.recordedPhrases.join("|"))
              )
            );
        }),
        this.ticketMessage.addEventListener("keyup", (e) => {
          clearTimeout(this.ticketThrottle),
            (this.ticketThrottle = setTimeout(
              () => this._findSolution(e.target.value.toLowerCase()),
              400
            ));
        }),
        this.form.addEventListener("submit", (e) => {
          e.stopImmediatePropagation(), e.preventDefault();
        });
    }
    _filter(e) {
      if (e.length < 3) {
        this.results.replaceChildren(), this.noResults.classList.add("hidden");
        return;
      }
      if (this.data.length === 0) {
        this.results.classList.add("preloader"),
          this.results.classList.add("preloader--small"),
          this._loadDataModel(() => {
            this._filter(this.search.value.toLowerCase()),
              this.results.classList.remove("preloader"),
              this.results.classList.remove("preloader--small");
          });
        return;
      }
      let t = this.data
        .filter((o) =>
          o.title.toLowerCase().includes(e) || o.content.includes(e)
            ? !0
            : o.tags.join().includes(e)
        )
        .map((o) => this._getResultElement(o, e));
      this.results.replaceChildren(...t),
        t.length === 0
          ? this.noResults.classList.remove("hidden")
          : this.noResults.classList.add("hidden"),
        this._recordPhrase(e);
    }
    _getResultElement(e, t = "") {
      let o = document.createElement("li"),
        r = document.createElement("a");
      r.classList.add("card"), r.classList.add("card--small"), (r.href = e.url);
      let n = document.createElement("strong");
      (n.textContent = e.title), r.appendChild(n);
      let a = document.createElement("p");
      t !== "" && e.content.includes(t)
        ? (a.innerHTML = this._highlightSearchPhrase(e.content, t))
        : (a.textContent = e.excerpt),
        r.appendChild(a);
      let s = document.createElement("ul");
      return (
        s.classList.add("tags__list"),
        (t = t.toLowerCase()),
        e.tags.forEach((u) => {
          let T = u.toLowerCase();
          if (T.includes(t)) {
            let m = document.createElement("li");
            m.classList.add("tags__tag"),
              m.classList.add("tags__item"),
              (m.innerHTML = T.replace(t, "<strong>".concat(t, "</strong>"))),
              s.appendChild(m);
          }
        }),
        s.childElementCount > 0 && t !== "" && r.appendChild(s),
        o.appendChild(r),
        o
      );
    }
    _highlightSearchPhrase(e, t) {
      let r = e.indexOf(t),
        n = 0,
        a;
      for (a = r - 2; a >= 0 && n !== 10; a--) e[a] === " " && n++;
      let s = a <= 0 ? 0 : a + 2,
        u = e.substring(s, r);
      for (n = 0, a = r + t.length + 2; a <= e.length - 1 && n !== 10; a++)
        e[a] === " " && n++;
      let T = a >= e.length ? a : a - 1,
        m = e.substring(r + t.length, T);
      return "..."
        .concat(u, "<strong>")
        .concat(t, "</strong>")
        .concat(m, "...");
    }
    _recordPhrase(e) {
      return e.trim() === "" || this.recordedPhrases.indexOf(e) !== -1
        ? !1
        : ((this.recordedPhrases = this.recordedPhrases.filter(
            (t) => !e.startsWith(t)
          )),
          this.recordedPhrases.push(e),
          !0);
    }
    _findSolution(e) {
      if (e.length < 20) return;
      if (this.data.length === 0) {
        this.solutionsPreloader.classList.remove("hidden"),
          this._loadDataModel(() => {
            this._findSolution(this.ticketMessage.value.toLowerCase()),
              this.solutionsPreloader.classList.add("hidden");
          });
        return;
      }
      let t = this.data
        .map((o) =>
          Object.assign({}, o, {
            tags: o.tags.filter((r) => e.includes(r.toLowerCase())),
          })
        )
        .filter((o) => o.tags.length > 0)
        .sort((o, r) =>
          o.tags.length > r.tags.length
            ? -1
            : o.tags.length < r.tags.length
            ? 1
            : 0
        )
        .slice(0, 3)
        .map((o) => this._getResultElement(o, ""));
      this.solutionResults.replaceChildren(...t);
    }
    _loadDataModel(e) {
      return this.dataIsLoading === !0
        ? !1
        : ((this.dataIsLoading = !0),
          fetch("/support-search-model", { method: "POST" })
            .then((t) => t.json())
            .then((t) => {
              (this.data = t), (this.dataIsLoading = !1), e();
            })
            .catch(() => {}),
          !0);
    }
    _scrollToTicketForm() {
      let e = this.el.querySelector("[data-support-ticket]");
      e.querySelector(".form__item--invalid, .alert--success") !== null &&
        e.scrollIntoView({ behavior: "smooth" });
    }
  };
  var v = class {
    constructor(e) {
      (this.removeUserButton = document.querySelector(".remove-user")),
        this.removeUserButton !== null &&
          ((this.modal = e), this._attachEvents());
    }
    _attachEvents() {
      this.removeUserButton.addEventListener("click", () => {
        this.modal.open(
          new FormData(),
          (e) => {
            window.location.assign(
              "/account-deleted/".concat(e.feedbackSecret)
            );
          },
          !0
        );
      });
    }
  };
  var x = class {
    constructor(e) {
      (this.form = document.querySelector(".form--notification-email")),
        this.form !== null &&
          ((this.emailContainer = this.form.querySelector(".form__item")),
          (this.errorContainer = this.form.querySelector(".form__error")),
          (this.submitButton = this.form.querySelector(".button--primary")),
          (this.cancelNotificationShowDialogButton =
            this.form.querySelector(".button--secondary")),
          (this.message = this.form.querySelector(".alert")),
          (this.email = this.form.querySelector(
            'input[name="notificationEmail"]'
          )),
          (this.modal = e),
          (this.cancelNotificationButton = this.form.querySelector(
            ".cancel-notification-email"
          )),
          (this.updateEmailAjax = new d({
            sendButton: this.submitButton,
            preloaderContainer: this.form,
            url: "/update-notification-email",
          })),
          this._attachEvents());
    }
    _attachEvents() {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault(),
          (this.errorContainer.textContent = ""),
          this.emailContainer.classList.remove("form__item--invalid"),
          this.message.classList.add("alert--hidden");
        let t = this.updateEmailAjax.send(this._getFormData());
        t !== !1 &&
          t
            .then((o) => {
              (this.submitButton.value =
                this.submitButton.dataset.captionUpdate),
                this.cancelNotificationShowDialogButton.classList.remove(
                  "button--hidden"
                ),
                this.message.classList.remove("alert--hidden"),
                (this.email.value = o.email),
                (this.form.dataset.token = o.unsubscribeToken);
            })
            .catch((o) => {
              (this.errorContainer.textContent = o.errors),
                this.emailContainer.classList.add("form__item--invalid");
            });
      }),
        this.cancelNotificationButton.addEventListener("click", () => {
          this.message.classList.add("alert--hidden"),
            this.modal.open(this._getFormData(), () => {
              (this.email.value = ""),
                (this.form.dataset.token = ""),
                this.cancelNotificationShowDialogButton.classList.add(
                  "button--hidden"
                ),
                (this.submitButton.value =
                  this.submitButton.dataset.captionCreate);
            });
        });
    }
    _getFormData() {
      let e = new FormData();
      return e.append("email", this.email.value), e;
    }
  };
  var y = class {
    constructor() {
      (this.form = document.querySelector(".woocommerce-checkout")),
        this.form !== null &&
          ((this.companyField = this.form.querySelector(
            'input[name="billing_company"]'
          )),
          (this.countryField = this.form.querySelector(
            'select[name="billing_country"]'
          )),
          (this.vatIdFormItem = this.form.querySelector("#vatNumber_field")),
          (this.vatIdField = this.form.querySelector(
            'input[name="vatNumber"]'
          )),
          (this.nipFormItem = this.form.querySelector("#nip_field")),
          (this.nipField = this.form.querySelector('input[name="nip"]')),
          this._attachEvents());
    }
    _attachEvents() {
      this.companyField.addEventListener(
        "input",
        this._toggleFields.bind(this)
      ),
        this.countryField.addEventListener(
          "input",
          this._toggleFields.bind(this)
        );
    }
    _toggleFields() {
      this.companyField.value === ""
        ? (this.vatIdFormItem.classList.add("form__item--hidden"),
          (this.vatIdField.value = ""))
        : this.vatIdFormItem.classList.remove("form__item--hidden"),
        this.companyField.value !== "" && this.countryField.value === "PL"
          ? this.nipFormItem.classList.remove("form__item--hidden")
          : (this.nipFormItem.classList.add("form__item--hidden"),
            (this.nipField.value = ""));
    }
  };
  var k = class {
    constructor() {
      document.querySelectorAll(".checkbox-container__toggle").length !== 0 &&
        this._attachEvents();
    }
    _attachEvents() {
      document
        .querySelector(".main-content")
        .addEventListener("change", (e) => {
          if (e.target.classList.contains("checkbox-container__toggle") === !1)
            return;
          let t = e.target;
          do t = t.parentElement;
          while (t.classList.contains("checkbox-container") === !1);
          t.querySelector(".checkbox-container__content").classList.toggle(
            "checkbox-container__content--visible"
          );
        });
    }
  };
  var E = class {
    constructor(e) {
      (this.removeAccountButtons =
        document.querySelectorAll(".remove-account")),
        !(this.removeAccountButtons.length <= 0) &&
          ((this.modal = e), this._attachEvents());
    }
    _attachEvents() {
      [].forEach.call(this.removeAccountButtons, (e) => {
        e.addEventListener("click", (t) => {
          let o = new FormData(),
            r = t.currentTarget.dataset.accountId;
          o.append("accountId", r),
            this.modal.open(o, () => {
              document
                .querySelector(
                  '.instagram-account[data-account-id="'.concat(r, '"]')
                )
                .parentElement.remove();
            });
        });
      });
    }
  };
  var L = class {
    constructor(e) {
      (this.disconnectAccountButtons = document.querySelectorAll(
        ".disconnect-account"
      )),
        !(this.disconnectAccountButtons.length <= 0) &&
          ((this.modal = e), this._attachEvents());
    }
    _attachEvents() {
      [].forEach.call(this.disconnectAccountButtons, (e) => {
        e.addEventListener("click", (t) => {
          let o = new FormData(),
            r = t.currentTarget.dataset.accountId;
          o.append("accountId", r),
            this.modal.open(o, () => {
              document
                .querySelector(
                  '.instagram-account[data-account-id="'.concat(r, '"]')
                )
                .parentElement.remove();
            });
        });
      });
    }
  };
  var S = class {
    constructor() {
      (this.sections = document.querySelectorAll(".section--hideable")),
        this.sections.length !== 0 &&
          ((this.settings =
            JSON.parse(
              window.localStorage.getItem("lightwidget-section-settings")
            ) || {}),
          this._attachEvents(),
          this._showSections());
    }
    _attachEvents() {
      [].forEach.call(this.sections, (e) => {
        e.querySelector(".section__hide").addEventListener("click", (t) => {
          let o = t.currentTarget.parentNode;
          o.classList.add("section--hidden"),
            (this.settings[o.dataset.sectionId] = "hidden"),
            window.localStorage.setItem(
              "lightwidget-section-settings",
              JSON.stringify(this.settings)
            );
        });
      });
    }
    _showSections() {
      [].forEach.call(this.sections, (e) => {
        Object.prototype.hasOwnProperty.call(
          this.settings,
          e.dataset.sectionId
        ) || e.classList.remove("section--hidden");
      });
    }
  };
  var C = class {
    constructor(e) {
      (this.disconnectDeveloperButtons = document.querySelectorAll(
        ".disconnect-developer"
      )),
        !(this.disconnectDeveloperButtons.length <= 0) &&
          ((this.modal = e), this._attachEvents());
    }
    _attachEvents() {
      [].forEach.call(this.disconnectDeveloperButtons, (e) => {
        e.addEventListener("click", (t) => {
          let o = new FormData(),
            r = t.currentTarget.dataset.accountId,
            n = t.currentTarget.dataset.developerId;
          o.append("accountId", r),
            o.append("developerId", n),
            this.modal.open(o, () => {
              let a = document.querySelector(
                  '.instagram-account .link[data-account-id="'
                    .concat(r, '"][data-developer-id="')
                    .concat(n, '"]')
                ).parentNode,
                s = a.closest(".accounts-list__item");
              a.remove(), s.querySelector(".link") === null && s.remove();
            });
        });
      });
    }
  };
  var z = class {
    constructor() {
      (this.chatbotEl = document.querySelector(".chatbot")),
        this.chatbotEl !== null &&
          ((this.conversation = this.chatbotEl.querySelector(
            ".chatbot__conversation"
          )),
          (this.typingBubble =
            this.chatbotEl.querySelector(".chatbot__typing")),
          (this.enableChatButton =
            this.chatbotEl.querySelector(".chatbot__icon")),
          (this.closeChatButton =
            this.chatbotEl.querySelector(".chatbot__close")),
          (this.actionButtonsDelay = 800),
          (this.keystrokesPerSecond = 7),
          (this.dataModel = []),
          (this.loadingDataModelInProgress = !1),
          (this.typingNowClassName = "chatbot__typing--now"),
          this._attachEvents());
    }
    _attachEvents() {
      this.enableChatButton.addEventListener("click", () => {
        this.chatbotEl.classList.add("chatbot--live"), this.loadDataModel();
      }),
        this.closeChatButton.addEventListener("click", () => {
          this.close();
        });
    }
    loadDataModel() {
      return this.loadingDataModelInProgress === !0 || this.dataModel.length > 0
        ? !1
        : ((this.loadingDataModelInProgress = !0),
          this.startTyping(),
          fetch("/chatbot-model")
            .then((e) => e.json())
            .then((e) => {
              (this.dataModel = e), this.write(0);
            })
            .catch(() => {
              this.addItemToConversation(
                this.createTextMessage("Sorry, I am offline!")
              ),
                this.stopTyping();
            }),
          !0);
    }
    write(e) {
      this.startTyping();
      let t = this.getMessageFromDataModel(e);
      if (t === void 0) {
        this.stopTyping(),
          this.addItemToConversation(
            this.createTextMessage(
              "I cannot process this this information for some reason, sorry:("
            )
          );
        return;
      }
      let o = 0;
      t.textMessages.forEach((r) => {
        (o += this.getWritingTime(r)),
          setTimeout(() => {
            this.addItemToConversation(this.createTextMessage(r));
          }, o);
      }),
        setTimeout(() => {
          this.stopTyping(),
            t.actions.forEach((r) => {
              this.addItemToConversation(this.getActionButton(r));
            });
        }, o + this.actionButtonsDelay);
    }
    createTextMessage(e, t = "bot") {
      let o = document.createElement("p");
      return (
        o.classList.add("chatbot__message"),
        o.classList.add("chatbot__message--".concat(t)),
        (o.innerHTML = e),
        o
      );
    }
    addItemToConversation(e) {
      this.conversation.insertBefore(e, this.typingBubble);
    }
    getActionButton(e) {
      if (e.type === "link") return this.createLinkButton(e);
      if (e.type === "close") return this.createCloseButton(e);
      if (e.type === "answer") return this.createAnswerButton(e);
    }
    createCloseButton(e) {
      let t = document.createElement("button");
      return (
        this._addActionButtonClasses(t),
        (t.innerText = e.text),
        t.addEventListener("click", () => this.close()),
        t
      );
    }
    createLinkButton(e) {
      let t = document.createElement("a");
      return (
        this._addActionButtonClasses(t),
        (t.innerText = e.text),
        (t.href = e.link),
        t
      );
    }
    createAnswerButton(e) {
      let t = document.createElement("button");
      return (
        this._addActionButtonClasses(t),
        (t.dataset.id = e.id.toString()),
        (t.innerText = e.text),
        t.addEventListener("click", (o) => this._answer(o)),
        t
      );
    }
    _answer(e) {
      this.addItemToConversation(
        this.createTextMessage(e.currentTarget.innerText, "user")
      );
      let t = parseInt(e.currentTarget.dataset.id);
      [...this.conversation.querySelectorAll(".chatbot__action")].forEach((o) =>
        o.remove()
      ),
        this.write(t);
    }
    _addActionButtonClasses(e) {
      e.classList.add("button"),
        e.classList.add("button--primary"),
        e.classList.add("chatbot__action");
    }
    getWritingTime(e) {
      return (e.length / this.keystrokesPerSecond) * 100;
    }
    startTyping() {
      this.typingBubble.classList.add(this.typingNowClassName);
    }
    stopTyping() {
      this.typingBubble.classList.remove(this.typingNowClassName);
    }
    getMessageFromDataModel(e) {
      return this.dataModel.find((t) => t.id === e);
    }
    close() {
      this.chatbotEl.classList.remove("chatbot--live");
    }
  };
  var I = class {
    constructor() {
      this._removeHash(), this._attachListeners(), this._tryNavigate();
    }
    _attachListeners() {
      window.addEventListener(
        "hashchange",
        () => {
          this.navigate(window.location.hash);
        },
        !1
      );
    }
    navigate(e) {
      e = this._parseHash(e);
      let t = document.querySelector('[data-hash-nav="'.concat(e, '"]'));
      return t === null
        ? !1
        : (t.scrollIntoView({ behavior: "smooth", block: "center" }),
          t.tagName.toLowerCase() === "input" && t.focus({ preventScroll: !0 }),
          !0);
    }
    _parseHash(e) {
      return e[0] === "#" ? e.substr(1) : e;
    }
    _removeHash() {
      ["#_=_", "#_"].indexOf(window.location.hash) !== -1 &&
        history.pushState("", document.title, window.location.pathname);
    }
    _tryNavigate() {
      return window.location.hash !== ""
        ? this.navigate(window.location.hash)
        : !1;
    }
  };
  var A = class {
    constructor() {
      (this.numberOfRequiredPolyfills = 0),
        this.svgUse() === !1 &&
          (this.numberOfRequiredPolyfills++,
          this._loadScript("svgUse", () => {
            svg4everybody();
          })),
        this.fetch() === !1 &&
          ((this.numberOfRequiredPolyfills += 3),
          this._loadScript("promise"),
          this._loadScript("fetch"),
          this._loadScript("abortController")),
        this.remove() === !1 &&
          (this.numberOfRequiredPolyfills++, this._loadScript("remove")),
        this.closest() === !1 &&
          (this.numberOfRequiredPolyfills++, this._loadScript("closest")),
        this.startsWith() === !1 &&
          (this.numberOfRequiredPolyfills++, this._loadScript("startsWith")),
        this.find() === !1 &&
          (this.numberOfRequiredPolyfills++, this._loadScript("find")),
        this.includes() === !1 &&
          (this.numberOfRequiredPolyfills++, this._loadScript("includes")),
        this.customEvents() === !1 &&
          ((this.numberOfRequiredPolyfills += 2),
          this._loadScript("event"),
          this._loadScript("customEvents"));
    }
    arePolyfillsLoaded() {
      return this.numberOfRequiredPolyfills === 0;
    }
    svgUse() {
      return (
        !!document.createElementNS &&
        /SVGAnimate/.test(
          {}.toString.call(
            document.createElementNS("http://www.w3.org/2000/svg", "animate")
          )
        )
      );
    }
    fetch() {
      return "fetch" in window;
    }
    remove() {
      return "remove" in Element.prototype;
    }
    closest() {
      return "closest" in Element.prototype;
    }
    startsWith() {
      return "startsWith" in String.prototype;
    }
    find() {
      return "find" in Array.prototype;
    }
    includes() {
      return "includes" in String.prototype;
    }
    customEvents() {
      return typeof Event == "function";
    }
    _loadScript(e, t = null) {
      let o = document.createElement("script");
      o.setAttribute(
        "src",
        "/wp-content/themes/lightwidget/dist/js/polyfill/".concat(e, ".min.js")
      ),
        o.addEventListener(
          "load",
          () => {
            this.numberOfRequiredPolyfills--, t !== null && t();
          },
          !1
        ),
        document.head.appendChild(o);
    }
  };
  var M = class {
    constructor(e) {
      (this.el = e),
        (this.el.dataset.popoverEnabled = ""),
        (this.toggleButton = this.el.querySelector("[data-popover-button]")),
        (this.focusableElements = this.el
          .querySelector("[data-popover-content]")
          .querySelectorAll('button,a,input,[tabindex="0"]')),
        (this.clickOutsideHandler = this._hideOnClickOutside.bind(this)),
        this._attachEvents();
    }
    _showPopover() {
      this.toggleButton.setAttribute("aria-expanded", "true"),
        this.toggleButton.setAttribute(
          "aria-label",
          this.toggleButton.dataset.popoverMessageHide
        ),
        document.addEventListener("click", this.clickOutsideHandler),
        this.el.dispatchEvent(new CustomEvent("popover", { detail: "show" }));
    }
    _hidePopover() {
      this.toggleButton.setAttribute("aria-expanded", "false"),
        this.toggleButton.setAttribute(
          "aria-label",
          this.toggleButton.dataset.popoverMessageShow
        ),
        document.removeEventListener("click", this.clickOutsideHandler),
        this.el.dispatchEvent(new CustomEvent("popover", { detail: "hide" }));
    }
    _handleKeyboardEvent(e) {
      if (e.key === "Tab") {
        if (
          document.activeElement ===
            this.focusableElements[this.focusableElements.length - 1] &&
          e.shiftKey === !1
        ) {
          this._hidePopover();
          return;
        }
        if (document.activeElement === this.toggleButton && e.shiftKey === !0) {
          this._hidePopover();
          return;
        }
      }
      e.key === "Escape" && this._hidePopover();
    }
    _attachEvents() {
      this.toggleButton.addEventListener("click", (e) => {
        e.preventDefault(),
          this.toggleButton.getAttribute("aria-expanded") === "false"
            ? this._showPopover()
            : this._hidePopover();
      }),
        this.el.addEventListener("keydown", (e) => {
          this._handleKeyboardEvent(e);
        });
    }
    _hideOnClickOutside(e) {
      e.target.closest("[data-popover]") !== this.el && this._hidePopover();
    }
  };
  var c = class {
    constructor(e) {
      (this.el = e),
        (this.buttons = Array.prototype.slice.call(
          this.el.querySelectorAll(".accordion__button")
        )),
        this._attachEvents();
    }
    _attachEvents() {
      this.buttons.forEach((e) => {
        e.addEventListener("click", (t) => {
          t.preventDefault();
          let o = t.currentTarget.getAttribute("aria-expanded");
          this.el.dataset.solo === "on" &&
            this.buttons.forEach((n) => this._closePanel(n));
          let r = this._getGroupOfPanels(t.currentTarget);
          o === "true"
            ? r.forEach((n) => this._closePanel(n))
            : r.forEach((n) => this._openPanel(n));
        });
      });
    }
    _closePanel(e) {
      e.setAttribute("aria-expanded", "false");
      let t = e.querySelector("use");
      t !== null &&
        t.setAttribute(
          "xlink:href",
          t.getAttribute("xlink:href").replace("#remove", "#add")
        );
    }
    _openPanel(e) {
      e.setAttribute("aria-expanded", "true");
      let t = e.querySelector("use");
      t !== null &&
        t.setAttribute(
          "xlink:href",
          t.getAttribute("xlink:href").replace("#add", "#remove")
        ),
        this._scrollIntoView(e);
    }
    _getGroupOfPanels(e) {
      return "group" in e.dataset
        ? this.buttons.filter((t) => t.dataset.group === e.dataset.group)
        : [e];
    }
    _scrollIntoView(e) {
      this.el.dataset.solo === "on" &&
        window.scrollY !== 0 &&
        e.scrollIntoView({ behavior: "smooth" });
    }
  };
  var B = class {
    constructor() {
      (this.tryDemoButton = document.querySelector("[data-try-demo]")),
        this.tryDemoButton !== null &&
          (this.tryDemoButton.addEventListener("click", () => this._loadDemo()),
          (this.loadingClass = "button--loading"));
    }
    _loadDemo() {
      this.tryDemoButton.classList.contains(this.loadingClass) ||
        (this.tryDemoButton.classList.add(this.loadingClass),
        fetch("/widget-creator")
          .then((e) => e.text())
          .then((e) => {
            let t = document.createElement("script");
            (t.src = this.tryDemoButton.dataset.scriptUrl),
              (document.querySelector(
                "[data-widget-creator-placeholder]"
              ).outerHTML = e),
              document
                .querySelector(".widget-preview__header")
                .classList.remove("widget-preview__header--hidden"),
              document.querySelector(".widget-creator__welcome").remove(),
              document
                .querySelector(".widget-preview__canvas")
                .classList.remove("widget-preview__canvas--initial"),
              document
                .querySelector('.account[data-id="sign-up"]')
                .addEventListener("click", () => {
                  window.location.assign("/create-account");
                }),
              document.body.appendChild(t),
              [].forEach.call(
                document.querySelectorAll(".accordion"),
                (o) => new c(o)
              );
          }));
    }
  };
  var q = class {
    constructor(e, t) {
      document.querySelectorAll("[data-developer-invitation]").length <= 0 ||
        ((this.cancelModal = e), (this.acceptModal = t), this._attachEvents());
    }
    _attachEvents() {
      [].forEach.call(
        document.querySelectorAll("[data-cancel-invitation]"),
        (e) => {
          e.addEventListener("click", (t) => {
            let o = t.currentTarget.closest(".accounts-list__item"),
              r = new FormData(),
              n = t.currentTarget.dataset.cancelInvitation;
            r.append("developerId", n),
              this.cancelModal.open(r, () => {
                o.remove();
              });
          });
        }
      ),
        [].forEach.call(
          document.querySelectorAll("[data-accept-invitation]"),
          (e) => {
            e.addEventListener("click", (t) => {
              let o = new FormData(),
                r = t.currentTarget.dataset.acceptInvitation;
              o.append("userId", r),
                this.acceptModal.open(
                  o,
                  () => {
                    window.location.assign(
                      "/instagram-accounts?invitation=accepted#managed-accounts"
                    );
                  },
                  !0
                );
            });
          }
        );
    }
  };
  var j = class {
    constructor(e) {
      (this.upgradedWidgets = Array.prototype.slice.call(
        e.querySelectorAll(
          'select[name="startTrial[widgetId]"] option[data-upgraded]:not([data-trial-disabled])'
        )
      )),
        (this.addOns = e.querySelectorAll('input[name="startTrial[addOn]"]')),
        this._attachEvents();
    }
    _attachEvents() {
      [].forEach.call(this.addOns, (e) => {
        e.addEventListener("change", () => {
          this.upgradedWidgets.forEach(
            (t) => (t.disabled = e.value === "widget-upgrade")
          );
        });
      });
    }
  };
  (function (i, e, t, o, r) {
    "use strict";
    if (i.lightwidget !== void 0) return !1;
    i.lightwidget = {};
    var n = null;
    i.addEventListener(
      "message",
      function (a) {
        if (t.indexOf(a.origin.replace(/^https?:\/\//i, "")) !== -1) {
          var s;
          if (
            (typeof a.data == "object"
              ? (s = a.data)
              : (s = JSON.parse(a.data)),
            s.type === "lightwidget_lightbox" && n === null)
          ) {
            (n = e.createElement("script")),
              (n.src = r.replace("y", s.version)),
              e.body.appendChild(n);
            return;
          }
          s.size <= 0 ||
            [].forEach.call(
              e.querySelectorAll(o.replace(/x/g, s.widgetId)),
              function (u) {
                u.style.height = s.size + "px";
              }
            );
        }
      },
      !1
    );
  })(
    window,
    document,
    ["lightwidget.com", "dev.lightwidget.com", "cdn.lightwidget.com"],
    'iframe[src*="lightwidget.com/widgets/x"],iframe[data-src*="lightwidget.com/widgets/x"],iframe[src*="instansive.com/widgets/x"]',
    "https://cdn.lightwidget.com/widgets/lightwidget-lightbox.y.js"
  );
  var D = class {
      run() {
        let e = new A();
        if (e.arePolyfillsLoaded()) {
          this._load();
          return;
        }
        let t = setInterval(() => {
          e.arePolyfillsLoaded() && (clearInterval(t), this._load());
        }, 100);
      }
      _load() {
        new h(),
          document.querySelector(".remove-widget") !== null &&
            new p(new l("remove-widget"));
        let e = new _(),
          t = document.querySelector(".remove-selected-widgets");
        t !== null && new b(t, e, new l("remove-widget")),
          new v(new l("remove-user")),
          new x(new l("cancel-notification-email")),
          new y(),
          new k(),
          new E(new l("remove-account")),
          new S(),
          new C(new l("disconnect-developer")),
          new q(
            new l("cancel-developer-invitation"),
            new l("accept-developer-invitation")
          ),
          new L(new l("disconnect-account")),
          new z(),
          new I(),
          new B(),
          [].forEach.call(
            document.querySelectorAll(".embed-code"),
            (o) => new g(o)
          ),
          [].forEach.call(
            document.querySelectorAll(".form:not(.widget-creator__form)"),
            (o) => new f(o)
          ),
          [].forEach.call(
            document.querySelectorAll(
              "[data-popover]:not([data-popover-enabled])"
            ),
            (o) => new M(o)
          ),
          [].forEach.call(
            document.querySelectorAll("[data-support-page]"),
            (o) => new w(o)
          ),
          [].forEach.call(
            document.querySelectorAll("[data-free-trial-form]"),
            (o) => new j(o)
          ),
          [].forEach.call(
            document.querySelectorAll(".accordion"),
            (o) => new c(o)
          );
      }
    },
    F = new D();
  F.run();
})();
