const socket = io();

// socket.on('countUpdated', (count) => {
//     console.log('count updated',count)
// })

// const countBtn = document.querySelector("#increment");
// countBtn.addEventListener('click', () => {
//   socket.emit('increment')
// })

socket.on("message", (msg) => {
  console.log(msg);
});

// Elements
const $formElement = document.querySelector("form");
const $locationBtnElem = document.getElementById("send-location");
const $inputElem = $formElement.querySelector("input");
const $submitBtn = $formElement.querySelector("button");
$formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log($submitBtn);
  $submitBtn.setAttribute("disabled", "disabled");
  $inputElem.value = "";
  $inputElem.focus();
  const message = $inputElem.value;
  socket.emit("sendMessage", message, (error) => {
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
        // $locationBtnElem.removeAttribute("disabled");
      }
    );
  });
});
