const generateMessage = (username, text) => {
  return {
    username,
    text,
    created_At: new Date().getTime(),
  };
};

const generateLocation = (username, url) => {
  return {
    url,
    created_At: new Date().getTime(),
    username,
  };
};

module.exports = {
  generateMessage,
  generateLocation,
};
