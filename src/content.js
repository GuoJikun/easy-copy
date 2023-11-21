// import { useThrottleFn } from "./utils/index.js";

class Modal {
  constructor() {
    const template = `
      <style></style>
      <div></div>
    `;
    this.shadowRoot = this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = template.cloneNode(true).content;
    // this.el = document.createElement("dialog");
    // this.el.id = "easy_copy_dialog";
    // this.el.style = `position: fixed;top: 24px;left: 50%;transform: translateX(-50%);z-index: 999999999;`;
    // document.body.appendChild(this.el);
  }
  open() {
    this.el.setAttribute("open", true);
  }
  close() {
    this.el.setAttribute("open", false);
  }
  setContent(content) {
    this.el.innerHTML = content;
  }
}

function createEl() {
  let el = document.querySelector("#easy_copy");
  if (!el) {
    el = document.createElement("div");
    const dialog = document.createElement("dialog");
    dialog.id = "easy_copy_dialog";
    // dialog.setAttribute("open", false);
    dialog.style = `position: fixed;top: 24px;left: 50%;transform: translateX(-50%);z-index: 999999999;`;
    document.body.appendChild(dialog);
  }

  el.id = "easy_copy";
  const styles = {
    display: "none",
    position: "fixed",
    top: "0",
    left: "0",
    "z-index": 999999998,
    width: "100%",
    height: "100%",
    "pointer-events": "none",
    transition: "all 0.2s ease-in-out",
    "background-color": "hsl(123.92deg 91.93% 46.85% / 18%)",
  };
  setStyle(el, styles);
  document.body.appendChild(el);
}

const handleScroll = function () {};

function bindScrollEvent() {}

function setStyle(el, style) {
  for (let key in style) {
    el.style.setProperty(key, style[key]);
  }
}

const handleMousemove = (ev) => {
  // console.log("ev", ev);
  const { x, y } = ev;
  const element = document?.elementFromPoint(x, y);
  const boundingClientRect = element?.getBoundingClientRect();
  // console.log(boundingClientRect);
  const style = {
    width: boundingClientRect.width + "px",
    height: boundingClientRect.height + "px",
    left: boundingClientRect.left + "px",
    top: boundingClientRect.top + "px",
  };
  const target = document.querySelector("#easy_copy");
  setStyle(target, style);
};

const handleClick = (ev) => {
  const target = ev.target;
  const cloneTarget = target.cloneNode(true);
  document.querySelector("#easy_copy_dialog").innerHTML = cloneTarget.outerHTML;
};

const bindEvent = () => {
  document.addEventListener("mousemove", handleMousemove);
  document.addEventListener("click", handleClick);
};
const removeEvent = () => {
  document.removeEventListener("mousemove", handleMousemove);
  document.removeEventListener("click", handleClick);
};

const bindOrRemove = (type) => {
  type ? bindEvent() : removeEvent();
};

function handleMessage(ev) {
  const data = ev;
  const target = document.querySelector("#easy_copy");
  let style = {};
  if (data.type === "open") {
    style = {
      display: "block",
    };
  } else if (data.type === "close") {
    style = { display: "none" };
  }
  setStyle(target, style);
  bindOrRemove(data.type === "open");
}

function createChannel() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("接收到 background 传来的信息", request);
    handleMessage(request);
  });
}

function init() {
  console.log("content.js is running.");
  createEl();
  createChannel();
  // bindScrollEvent();
}
init();
