const Chatroom = require("../models/chatroom");

exports.createChatroom = async (req, res) => {
  try {
    const { name } = req.body;

    // const nameRegex = /^[A-Za-z\s]+$/;

    // if (!nameRegex.test(name))
    //   throw "Chatroom name can contain only alphabets.";

    const chatroomExists = await Chatroom.findOne({ name });
    if (chatroomExists) {
      return res
        .status(400)
        .send({ msg: "Chatroom with that name already exists!" });
    }

    const chatroom = new Chatroom({
      name,
    });

    await chatroom.save();

    res.json({
      message: "Chatroom created!",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllChatrooms = async (req, res) => {
  try {
    const chatrooms = await Chatroom.find({});
    res.json(chatrooms);
  } catch (error) {
    console.log(error);
  }
};
