const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!username || !room)
    return {
      error: "username and room are required",
    };
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });
  if (existingUser) return { error: "username is in use !" };

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  console.log(index);
  if (index >= 0) return users.splice(index, 1)[0];
};

const getUser = (id) => {
  const user = users.find((user) => user.id === id);
  return user;
};

const getUsersInRoom = (roomName) => {
  const usersInRoom = users.filter((user) => user.room === roomName);
  return usersInRoom;
};
// const user1 = { id: 22, username: "john", room: "chatgroup" };
// const user2 = { id: 23, username: "lorem", room: "college" };
// const user3 = { id: 24, username: "ritesh", room: "chatgroup" };
// console.log(addUser(user1));
// console.log(addUser(user3));
// console.log(getUser(22));
// console.log(getUsersInRoom("chatgroup"));
// console.log(removeUser(22));

module.exports = {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
};
