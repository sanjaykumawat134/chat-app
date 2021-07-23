const socket = io();

// socket.on('countUpdated', (count) => {
//     console.log('count updated',count)
// })

// const countBtn = document.querySelector("#increment");
// countBtn.addEventListener('click', () => {
//   socket.emit('increment')
// })

//options (query string)

const { userName, roomName } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Elements
const $formElement = document.querySelector("form");
const $locationBtnElem = document.getElementById("send-location");
const $inputElem = $formElement.querySelector("input");
const $submitBtn = $formElement.querySelector("button");
const $messages = document.querySelector("#messages");

const $messageTemplates = document.querySelector("#message-template").innerHTML;
const $locationTemplates =
  document.querySelector("#location-template").innerHTML;
const $sideBarTemplates = document.querySelector("#sidebar-template").innerHTML;
socket.on("message", (msg) => {
  const html = Mustache.render($messageTemplates, {
    userName: msg.username,
    message: msg.text,
    createdAt: moment(msg.created_At).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  // autoScroll();
});
socket.on("locationMessage", (locationUrl) => {
  console.log(locationUrl);
  const html = Mustache.render($locationTemplates, {
    userName: locationUrl.username,
    url: locationUrl.url,
    createdAt: moment(locationUrl.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});
socket.on("roomData", ({ room, users }) => {
  console.log(users);
  const html = Mustache.render($sideBarTemplates, {
    room,
    users,
  });
  document.querySelector(".chat_sidebar").innerHTML = html;
  // autoScroll();
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

socket.emit(
  "join",
  {
    userName,
    roomName,
  },
  (error) => {
    if (error) {
      alert(error);
      location.href = "/";
    }
  }
);
// const autoScroll = () => {
//   //New message element
//   // const $newMessages = $messages.lastChild;
//   // // console.log($newMessages);
//   // // height of new message
//   // const newMessageStyles = getComputedStyle($newMessages);
//   // console.log(newMessageStyles);
//   // const newMessageHeight = $newMessages.offsetHeight;
//   // // console.log(newMessageHeight);
//   $messages.scrollTop = $message.scrollHeight;
// };
