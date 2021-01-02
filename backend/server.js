var express = require("express");
var http = require("http");

var morgan = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

var userRoute = require("./routes/user.route");
var adminRoute = require("./routes/admin.route");
var authencationRoute = require("./routes/authencation.route");

// App setup
var app = express();

var port = process.env.PORT || 9080;

var server = http.createServer(app);

morgan(":method :url :status :res[content-length] - :response-time ms");

var arrUserInfo = [];

// mongo key
var mongoURI = `mongodb+srv://Product:giadinhlaso1@cluster0-kvgbc.mongodb.net/btl?retryWrites=true&w=majority`;
var options = {
  useNewUrlParser: true,
  useFindAndModify: false,
};

// Tạo kết nối tới database
mongoose.connect(mongoURI, options).then(
  () => console.log("Database connection established"),
  (err) => console.log("Database connection unestablied, error occurred")
);

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser("test"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Static files
app.use(express.static("public"));

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Route
app.use("/user/", userRoute);

app.use("/admin/", adminRoute);

app.use("/login", authencationRoute);


// Socket setup & pass server
var io = require('socket.io')(3005, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

server.listen(port, () => console.log(`Listening on port ${port}`));


io.attach(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});


io.on("connection", (socket) => {
  console.log('A user connected: ' + socket.id);

  socket.on("stateLed", (data) => {
    console.log({ data });
    io.sockets.emit("stateLed", { data }); 
  });

  socket.on("message", (data) => {
    console.log({ data });
    io.sockets.emit("message", { data }); 
  });

  socket.on("disconnect", (data) => {
    var index = arrUserInfo.findIndex(
      (user) => user.peerId === socket.peerId
    );
    arrUserInfo.splice(index, 1);
    io.emit("disconnect", { data }); 
  });
});

