const generateMessage = (text) => {
  return {
    text,
    created_At: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
};
