const socket = io();

// socket.on('countUpdated', (count) => {
//     console.log('count updated',count)
// })

// const countBtn = document.querySelector("#increment");
// countBtn.addEventListener('click', () => {
//   socket.emit('increment')
// })

// Elements
const $formElement = document.querySelector("form");
const $locationBtnElem = document.getElementById("send-location");
const $inputElem = $formElement.querySelector("input");
const $submitBtn = $formElement.querySelector("button");
const $messages = document.querySelector("#messages");
const $messageTemplates = document.querySelector("#message-template").innerHTML;
const $locationTemplates =
  document.querySelector("#location-template").innerHTML;
socket.on("message", (msg) => {
  const html = Mustache.render($messageTemplates, {
    message: msg.text,
    createdAt: moment(msg.created_At).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});
socket.on("locationMessage", (locationUrl) => {
  const html = Mustache.render($locationTemplates, {
    locationUrl,
  });
  $messages.insertAdjacentHTML("beforeend", html);
});
$formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  $submitBtn.setAttribute("disabled", "disabled");
  const message = $inputElem.value;
  if (message == "") {
    $submitBtn.removeAttribute("disabled");
    return alert("please enter a message to send...!");
  }
  socket.emit("sendMessage", message, (error) => {
    $submitBtn.removeAttribute("disabled");
    $inputElem.value = "";
    $inputElem.focus();
    if (error) {
      return console.log(error);
    }
    console.log("The message was delivered");
  });
});
$locationBtnElem.addEventListener("click", (event) => {
  //disable location button
  $locationBtnElem.setAttribute("disabled", "disabled");
  //fetch geolocation

  if (!window.navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (msg) => {
        console.log(msg);
        $locationBtnElem.removeAttribute("disabled");
      }
    );
  });
});
