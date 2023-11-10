// import { useThrottleFn } from "./utils/index.js";

function createEl() {
  let el = document.querySelector("#easy_copy");
  if (!el) {
    el = document.createElement("div");
  }

  el.id = "easy_copy";
  const styles = {
    display: "none",
    position: "fixed",
    top: "0",
    left: "0",
    "z-index": 999999999,
    width: "100%",
    height: "100%",
    "pointer-events": "none",
    transition: "all 0.2s ease-in-out",
    "background-color": "hsl(123.92deg 91.93% 46.85% / 16%)",
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

const bindMousemoveEvent = (type) => {
  type
    ? document.addEventListener("mousemove", handleMousemove)
    : document.removeEventListener("mousemove", handleMousemove);
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
  bindMousemoveEvent(data.type === "open");
}

function createChannel() {
  const port = chrome.runtime.connect({ name: "content-script" });
  port.onMessage.addListener((request, sender, sendResponse) => {
    console.log("request", request);
    console.log("sender", sender);
    console.log("sendResponse", sendResponse);
    // sendResponse();
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
