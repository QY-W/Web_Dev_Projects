// Require the packages we will use:
const http = require("http"),
  fs = require("fs");

const port = 3456;
const file = "client.html";

// Listen for HTTP connections.  This is essentially a miniature static file server that only serves our one file, client.html, on port 3456:
const server = http.createServer(function (req, res) {
  // This callback runs when a new connection is made to our HTTP server.

  fs.readFile(file, function (err, data) {
    // This callback runs when the client.html file has been read from the filesystem.

    if (err) return res.writeHead(500);
    res.writeHead(200);
    res.end(data);
  });
});
server.listen(port);

// Import Socket.IO and pass our HTTP server object to it.
const socketio = require("socket.io")(http, {
  wsEngine: "ws",
});
// Attach our Socket.IO server to our HTTP server to listen
const io = socketio.listen(server);
//starter rooms
let rooms = [
  { roomName: "lobby", password: null, admin: null, banlist: [] },
  { roomName: "separateroom", password: null, admin: null, banlist: [] },
  { roomName: "someroom", password: null, admin: null, banlist: [] },
];

let userIdDict = {};
let users = {};

io.sockets.on("connection", function (socket) {
  // This callback runs when a new Socket.IO connection is established.
  socket.on("message_to_server", function (data) {
    // This callback runs when the server receives a new message from the client.

    let results = data["message"].split(" ");
    //console.log("result [1]" + results);
    let cmdList = ["/pm", "/kick", "/ban", "/help"];
    if (cmdList.includes(results[1])) {
      if (results[1] == "/pm") {
        send_private_message(results);
      } else if (results[1] == "/kick") {
        kick_user(results);
      } else if (results[1] == "/ban") {
        ban_user(results);
      } else if (results[1] == "/help") {
        const newLine = "\r";
        let helpMSG =
          newLine +
          "Example {/pm <username> somewordtosay} to send private message to user in the same room" +
          newLine;
        helpMSG +=
          "Example {/ban <username>} to ban user from entering room(will not kick)" +
          newLine;
        helpMSG +=
          "Example {/kick <username>} to kick user from room and send to lobby" +
          newLine;

        socket.emit("alert_to_console", helpMSG);
      }

      return;
    }

    io.sockets
      .in(users[socket.user].room)
      .emit("message_to_client", { message: data["message"] }); // broadcast the message to other users
  });

  function ban_user(results) {
    let banRoom = null;

    console.log("Entering ban");
    if (results.length < 3) {
      socket.emit("alert_to_console", "Ban failed, user empty");
      return;
    } else {
      let attempt_user = results[2];
      if (userIdDict[attempt_user] === undefined) {
        socket.emit("alert_to_console", "Ban failed, check target name");
        return;
      }
      // get the room object
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].roomName == socket.room) {
          banRoom = rooms[i];
          let creator = rooms[i].admin;
          if (creator != socket.user) {
            socket.emit(
              "alert_to_console",
              "Ban failed, you are not the creator."
            );
            return;
          }
        }
      }
    }
    let attempt_user = results[2];

    if (banRoom) {
      banRoom.banlist.push(attempt_user);
    }
    let banMSG =
      "!" +
      attempt_user +
      "you are banned from room" +
      socket.room +
      "bannlist:" +
      banRoom.banlist;

    socket.broadcast.to(userIdDict[attempt_user]).emit("private_msg", banMSG);
  }

  function kick_user(results) {
    if (results.length < 3) {
      socket.emit("alert_to_console", "Kick failed, user empty");
      return;
    } else {
      let attempt_user = results[2];
      if (userIdDict[attempt_user] === undefined) {
        socket.emit("alert_to_console", "Kick failed, check target name");
        return;
      }
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].roomName == socket.room) {
          let creator = rooms[i].admin;
          if (creator == attempt_user) {
            socket.emit(
              "alert_to_console",
              "Kick failed, creator can not be kicked out."
            );
            return;
          } else if (creator != socket.user) {
            socket.emit(
              "alert_to_console",
              "Kick failed, you are not the creator."
            );
            return;
          } else {
            console.log("Trying to kick", attempt_user, "from", socket.room);
            users[attempt_user].room = "lobby";
            io.sockets
              .in(rooms[i].roomName)
              .emit("people_in_room", roomUserNames(rooms[i].roomName));
          }
        }
      }
      //socket.emit("updateRoom", rooms, rooms[0]);
      socket.to(userIdDict[attempt_user]).emit("updateRoom", rooms, rooms[0]);
      socket
        .to(userIdDict[attempt_user])
        .emit("people_in_room", roomUserNames("lobby"));
      socket.emit("kickout", attempt_user);
      socket.broadcast
        .to(userIdDict[attempt_user])
        .emit("private_msg", "You get kicked out of the current room ");
    }
  }
  // update users in then room
  function roomUserNames(rmname) {
    let newStr = "";
    for (let p in users) {
      if (users.hasOwnProperty(p)) {
        if (users[p].room == rmname) {
          newStr += users[p].name + ",";
        }
      }
    }
    return newStr;
  }

  function send_private_message(results) {
    if (results.length < 4) {
      socket.emit("alert_to_console", "PM failed, message cannot be empty");
      return;
    } else {
      let attempt_user = results[2];
      let names = roomUserNames(socket.room).split(",");
      if (!names.includes(attempt_user)) {
        socket.emit(
          "alert_to_console",
          "PM failed, please enter the user in room"
        );
        return;
      }
      //   console.log("att-user:", attempt_user);
      if (userIdDict[attempt_user] === undefined) {
        socket.emit("alert_to_console", "PM failed, check receiver name");
        return;
      }
      results.shift();
      results.shift();
      results.shift();

      let decoded_msg = results.join(" ");
      decoded_msg = "PM from " + socket.user + ":{" + decoded_msg + "}";
      console.log("sending PM to user", attempt_user, "MSG is:", decoded_msg);


      // sned message to receiver

      socket.broadcast
        .to(userIdDict[attempt_user])
        .emit("private_msg", decoded_msg);

      let selfId = userIdDict[socket.user];
      console.log("self id is:", selfId);
      socket.to(selfId).emit("private_msg", decoded_msg);
    }
  }
  // kickout user and he/she back to lobby
  socket.on("back_to_lobby", function (u) {
    let tmp = [socket.user, socket.room, socket.name];
    console.log("check storing info:  ", tmp);
    socket.user = u;
    socket.name = u;
    socket.leave(socket.room);
    socket.join("lobby");
    socket.in("lobby").emit("updateRoom", rooms, rooms[0]);
    socket.in("lobby").emit("people_in_room", roomUserNames("lobby"));
    socket.user = tmp[0];
    socket.room = tmp[1];
    socket.name = tmp[2];
    socket.join(tmp[1]);
    socket.in(tmp[1]).emit("updateRoom", rooms, rooms[0]);
    socket.in(tmp[1]).emit("people_in_room", roomUserNames(tmp[1]));
  });

  // created user
  socket.on("create_user", function (username) {

    let newUser = {};
    newUser.name = username;
    newUser.room = "lobby";
    userIdDict[username] = socket.id;
    users[username] = newUser;

    socket.user = username;
    socket.room = "lobby";
    socket.name = username;
    socket.join("lobby");
    socket.emit("updateRoom", rooms, rooms[0]);

    let tmp = roomUserNames(socket.room);
    io.sockets.in("lobby").emit("people_in_room", tmp);
    io.sockets.in("lobby").emit("message_to_client", {
      message: username + " join the lobby!!!! with id: " + socket.id,
    });
  });

  // create a room
  socket.on("create_room", function (r) {
    // init banlist
    r.banlist = [];
    rooms.push(r);
    io.emit("create_room", rooms, socket.room);
    console.log(r.roomName + "room is create by" + r.admin);
  });

  socket.on("switchRoom", function (newRoom, ps) {
    // check if user is banned from the attempted room
    let banList = [];
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].roomName == newRoom.roomName) {
        banList = rooms[i].banlist;
      }
    }
    if (banList.includes(socket.user)) {
      console.log(
        "Switch error",
        socket.user,
        "is banned from from:",
        newRoom.roomName
      );
      socket.emit(
        "alert_to_console",
        "You cannot enter this room because you are banned"
      );
      return;
    }
    // check if pw matches the correct one
    if (ps != "nopassword") {
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].roomName == newRoom.roomName) {
          if (ps != rooms[i].password) {
            socket.emit("alert_to_console", "Wrong password");
            console.log(
              "room ",
              rooms[i].roomName,
              " should be ",
              rooms[i].password
            );
            return;
          }
        }
      }
    }
    // check password
    if (typeof users[socket.user].room !== "undefined") {
      users[socket.user].room = newRoom.roomName;
      io.sockets
        .in(socket.room)
        .emit("people_in_room", roomUserNames(socket.room));

      socket.leave(socket.room);
    }

    socket.join(newRoom.roomName);
    users[socket.user].room = newRoom.roomName;
    console.log(socket.user, " in switch room ", users[socket.user].room);
    let newStr = roomUserNames(newRoom.roomName);

    socket.broadcast.to(socket.room).emit("message_to_client", {
      message: socket.user + " has left this room",
    });
    socket.room = newRoom.roomName;
    socket.broadcast.to(newRoom.roomName).emit("message_to_client", {
      message: socket.user + " has joined this room",
    });
    socket.emit("updateRoom", rooms, newRoom);
    io.sockets.in(newRoom.roomName).emit("people_in_room", newStr);
  });
});
