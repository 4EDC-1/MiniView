// mini-view-lib (index.js)
const { app, BrowserWindow } = require("electron");
const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");

/**
 * Main function to start the MiniView.
 * @param {string} filePath - Path to the HTML file to be previewed.
 */
function startMiniView(filePath) {
    let win;
    
    // تحويل المسار المعطى لمسار مطلق لضمان الوصول للملف من أي مكان
    const absolutePath = path.isAbsolute(filePath) 
        ? filePath 
        : path.resolve(process.cwd(), filePath);

    function createWindow() {
        // التأكد من وجود الملف لتجنب كراش التطبيق
        if (!fs.existsSync(absolutePath)) {
            console.error(`[MiniView] Error: File not found at ${absolutePath}`);
            return;
        }

        win = new BrowserWindow({
            width: 400,
            height: 300,
            alwaysOnTop: true, // ميزة المكتبة الأساسية
            frame: true,       // إبقاء الإطار للتحكم بالحجم
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            }
        });

        // تحميل الملف
        win.loadFile(absolutePath);

        // مراقبة الملف الأساسي وأي ملفات بجانبه (CSS/JS) في نفس المجلد
        const watcher = chokidar.watch(path.dirname(absolutePath), {
            ignoreInitial: true
        });

        watcher.on("change", (changedPath) => {
            console.log(`[MiniView] File changed: ${path.basename(changedPath)}. Reloading...`);
            if (win) win.reload();
        });

        win.on('closed', () => {
            watcher.close();
            win = null;
        });
    }

    // إدارة تشغيل Electron
    app.whenReady().then(() => {
        createWindow();

        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });

    // إغلاق البرنامج عند إغلاق النافذة (ما عدا الماك)
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
}

module.exports = { startMiniView };