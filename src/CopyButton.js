export default class CopyButton {
  constructor(_options) {
    this.element = _options.element;
    this.text = _options.text;
    this.successText = _options.successText;
    this.errorText = _options.errorText;
    this.copy = this.copy.bind(this);
    this.init();
  }

  init() {
    this.element.addEventListener("click", this.copy);
  }
  copy() {
    if (!navigator.clipboard) {
      this.element.innerHTML = this.errorText;
      return;
    }

    navigator.clipboard
      .writeText(this.text)
      .then(() => {
        console.log("success");
        this.element.innerHTML = this.successText;
        setTimeout(() => {
          this.element.innerHTML = this.text;
        }, 2000);
      })
      .catch((e) => {
        console.log(e);
        this.element.innerHTML = this.errorText;
        setTimeout(() => {
          this.element.innerHTML = this.text;
        }, 2000);
      });
  }
}
