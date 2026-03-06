const path = require("path");
const MiniView = require("./src/main");

// Run MiniView with example content
MiniView.startMiniView(path.join(__dirname, "examples/content.js"));