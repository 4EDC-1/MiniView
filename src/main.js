const { app, BrowserWindow } = require("electron");
const chokidar = require("chokidar");
const path = require("path");

let win;

/**
 * Starts MiniView with a specified content file.
 * @param {string} contentFilePath - Path to a JS file exporting HTML string.
 */
function startMiniView(contentFilePath) {

  function createWindow() {
    win = new BrowserWindow({
      width: 400,
      height: 300,
      alwaysOnTop: true,
      title: "MiniView",
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    // Load empty window with div to render content
    win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(`
      <div id="root" style="font-family:sans-serif;"></div>
      <script>
        const { ipcRenderer } = require('electron');
        ipcRenderer.on('update-content', (_, html) => {
          document.getElementById('root').innerHTML = html;
        });
      </script>
    `));

    render(); // Initial render
  }

  function render() {
    if (win) {
      // Clear require cache to reload updated content
      delete require.cache[require.resolve(contentFilePath)];
      const html = require(contentFilePath);
      win.webContents.send("update-content", html);
    }
  }

  // Watch the content file for changes
  chokidar.watch(contentFilePath).on("change", () => {
    console.log("Content updated! Refreshing MiniView...");
    render();
  });

  app.whenReady().then(createWindow);
}

module.exports = { startMiniView };