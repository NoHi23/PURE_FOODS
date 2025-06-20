// This script initializes the WOW.js library for revealing animations on scroll
// Ensure that the WOW.js library is loaded before this script

// Check if WOW.js is defined
import WOW from 'wowjs';
if (typeof WOW === 'undefined') {  
    console.error('WOW.js is not loaded. Please include the WOW.js library before this script.');
    }
// Initialize WOW.js

new WOW().init();