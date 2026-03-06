/**
 * MINI-VIEW TEST EXAMPLE
 * ----------------------
 * This script demonstrates how to use the mini-view library.
 * To run this: 
 * 1. Ensure you have electron installed: npm install electron
 * 2. Run: npx electron example.js
 */

const { startMiniView } = require('mini-view-dev');

// --- STEP 1: Define your target file ---
// This is the HTML file you want to see in the floating window.
const myFile = './index.html';

// --- STEP 2: Launch the MiniView ---
console.log('------------------------------------------');
console.log('🚀 Launching MiniView...');
console.log(`📂 Watching: ${myFile}`);
console.log('💡 Tip: Edit your HTML/CSS and save to see it update!');
console.log('------------------------------------------');

try {
    // This function starts the Electron window and the file watcher.
    startMiniView(myFile);
} catch (err) {
    console.error('❌ Failed to start MiniView:', err.message);
}