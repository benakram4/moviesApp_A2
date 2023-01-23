// ======Create express application ================================================================
var express = require("express"); // Include express.js module
var app = express();
app.use(express.static('public')); // serve static files from the css folder
app.use(express.json()); // parse incoming JSON requests and place them in req.body
app.use(express.urlencoded({ extended: true })); // parse incoming urlencoded form data and place it in req.body
// =================================================================================================
// === Create path to static files =================================================================
var path = require("path"); // include module path to use __dirname, and function path.join()
// =================================================================================================

// =================================================================================================
// === Setup HTTP server to listen on port 8080 ====================================================
var HTTP_PORT = process.env.PORT || 8080;
// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on port: " + HTTP_PORT);
};
// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);
// =================================================================================================

// === Setup routes ================================================================================
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("/js/index.js", function(req, res) {
    res.sendFile(path.join(__dirname, "./js/index.js"));
});
// =================================================================================================