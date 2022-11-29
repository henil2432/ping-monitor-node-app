"use strict";

// const { pingAsync } = require("./pingasync");
// const Monitor = require("ping-monitor");

var addDevice = require("../api/deviceData/add-device");
let pingData = require("../api/ping/get-ping");
const { emit } = require("../logger");

// const http = require("http");
// const activeUsers = new Set();
// const chatCtrl = require("../api/chat");

module.exports = (server, logger) => {
  logger.info("Socket.io server started");
  const io = require("socket.io")(server);
  io.use((socket, next) => {
    logger.info(
      `REQ [${socket.id}] [WS] ${socket.handshake.url} ${JSON.stringify(
        socket.handshake
      )}`
    );
    next();
  });

  // const myMonitor = new Monitor({
  //   address: "192.168.29.205",
  //   // port: 3000,
  //   interval: 0.1, // minutes
  // });

  // myMonitor.on("up", function (res, state) {
  //   console.log("Yay!! " + res.address + ":" + " is up.", state);
  // });

  // myMonitor.on("down", function (res, state) {
  //   console.log("Oh Snap!! " + res.address + ":" + " is down! ", state);
  // });

  // myMonitor.on("stop", function (res, state) {
  //   console.log(res.address + " monitor has stopped.");
  // });

  // myMonitor.on("error", function (error, res) {
  //   console.log(error, res);
  // });

  // myMonitor.on("timeout", function (error, res) {
  //   console.log(error, res);
  // });

  //
  //

  io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    socket.emit("message", socket.id);
    logger.info(
      `CONN [${socket.id}] [WS] ${socket.handshake.url} ${JSON.stringify(
        socket.handshake
      )}`
    );

    // Routes
    //
    socket.on("join", async function (data) {
      console.log("roomId", data);
      try {
        // var hosts = ["192.168.1.1", "google.com", "yahoo.com"];
        // let res = [];
        // for (let host of hosts) {
        //   res.push(await ping.promise.probe(host));
        // }
        let data11 = await pingData.handler(data.id);
        console.log("data11", data11);

        io.in(socket.id).emit("pingdata", { ping: data11 });
        console.log("history sent");
      } catch (error) {
        console.log("Error in finding Chats ", error);
      }
    });
    // socket.on('new-message', async function ({ roomId, sender, message, type }) {
    //     console.log({roomId, sender, message})
    //     try {
    //         let newMsg = await chatCtrl.sendMessage.handler({
    //             roomId: roomId,
    //             sender: sender,
    //             message: message,
    //             type: type
    //         });
    //         // newMsg = JSON.parse(JSON.stringify(newMsg));
    //         // newMsg["network"] = "1"
    //         console.log("new-message", newMsg.payload.newChat)
    //         io.in(roomId).emit('new-message', newMsg.payload.newChat);
    //         console.log("message-sent")
    //     } catch (error) {
    //         console.log('Error in sending message', error);
    //     }
    // });
    // Socket "Call Connect"
    // socket.on(
    //   "connectCall",
    //   async function ({ channelName, otherId, isForVideoCall, token }) {
    //     console.log("channelname on connectcall...", channelName);
    //     console.log("otherid on connectcall...", otherId);
    //     console.log("token on connectcall...", token);
    //     if (token) {
    //       let data = {
    //         msg: "call Requested",
    //         channelName: String(channelName),
    //         otherId: String(otherId),
    //         isForVideoCall: Boolean(isForVideoCall),
    //         token: token,
    //       };
    //       io.in(String(channelName)).emit("onCallRequest", data);
    //       io.in(String(otherId)).emit("onCallRequest", data);
    //       console.log("data on connectcall...", data);
    //     }
    //   }
    // );
    //  socket "acceptCall"
    // socket.on(
    //   "acceptCall",
    //   async function ({ channelName, otherId, isForVideoCall, token }) {
    //     console.log("chanel name................. Accept", channelName);
    //     console.log("otherId............++++++++++Accept", otherId);
    //     console.log("isForVideoCall------------->", isForVideoCall);
    //     console.log("token...........++++++++++++ accept", token);
    //     const res = {
    //       msg: "call accepted",
    //       channelName: String(channelName),
    //       otherId: String(otherId),
    //       isForVideoCall: Boolean(isForVideoCall),
    //       token: token,
    //     };
    //     io.in(String(channelName)).emit("onAcceptCall", res);
    //     io.in(String(otherId)).emit("onAcceptCall", res);
    //     console.log("channelNameonAcceptCall...................", res);
    //     console.log("otherIdonAcceptCall...................", res);
    //   }
    // );
    // Socket "Call Reject"
    // socket.on(
    //   "rejectCall",
    //   async function ({ channelName, otherId, isForVideoCall, token }) {
    //     console.log("chanel name............ reject", channelName);
    //     console.log("otherId........++++++++++ reject", otherId);
    //     console.log("token.........+++++++++++ reject", token);
    //     const res = {
    //       msg: "call disconnected",
    //       channelName: String(channelName),
    //       otherId: String(otherId),
    //       isForVideoCall: Boolean(isForVideoCall),
    //       token: token,
    //     };
    //     io.in(String(channelName)).emit("onRejectCall", res);
    //     io.in(String(otherId)).emit("onRejectCall", res);
    //     console.log("channelNamedisconnect...................", res);
    //     console.log("otherIddisconnect...................", res);
    //   }
    // );
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
    socket.on("error", function (err) {
      console.log("received error from socket:", socket.id);
      console.log(err);
    });
    // // when the client emits 'stop typing', we broadcast it to others
    // socket.on('stop typing', () => {
    //     console.log("stop typing")
    //     socket.broadcast.emit('stop typing', {
    //     username: socket.username
    //     });
    // });
    // // when the client emits 'typing', we broadcast it to others
    // socket.on('typing', () => {
    //     console.log("typing")
    //     socket.broadcast.emit('typing', {
    //     username: socket.username
    //     });
    // });
    // // when the client emits 'new message', we broadcast it to others
    // socket.on('new message', (data) => {
    //     console.log("new message",data)
    //     socket.broadcast.emit('new message', {
    //     username: socket.username,
    //     message: data
    //     });
    // });
    // // when user send message
    // socket.on('send-message', (data) => {
    //     console.log("send message",data)
    //     io.emit('message', data);
    // });
  });
};
