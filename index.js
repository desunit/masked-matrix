// geting canvas by Boujjou Achraf
var c = document.getElementById("c");
var ctx = c.getContext("2d");

//making the canvas full screen
c.height = window.innerHeight;
c.width = window.innerWidth;

//chinese characters - taken from the unicode charset
var matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
//converting the string into an array of single characters
matrix = matrix.split("");

var font_size = 10;
var columns = c.width/font_size; //number of columns for the rain
//an array of drops - one per column
var drops = [];
var dropSpeeds = []; // New array to store individual drop speeds


var mask;
var maskCanvas;
var maskCtx;
var intervalId;

// Load the image and create the mask
var img = new Image();
img.onload = function() {
    maskCanvas = document.createElement('canvas');
    maskCanvas.width = c.width;
    maskCanvas.height = c.height;
    maskCtx = maskCanvas.getContext('2d');
    
    // Fill the mask canvas with white
    maskCtx.fillStyle = "white";
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    // Calculate the dimensions and position to maintain aspect ratio and fit within the canvas
    var imgAspectRatio = img.width / img.height;
    var canvasAspectRatio = c.width / c.height;
    var drawWidth, drawHeight, drawX, drawY;

    if (imgAspectRatio > canvasAspectRatio) {
        // Image is wider than the canvas
        drawWidth = c.width;
        drawHeight = c.width / imgAspectRatio;
        drawX = 0;
        drawY = (c.height - drawHeight) / 2;
    } else {
        // Image is taller than the canvas
        drawWidth = c.height * imgAspectRatio;
        drawHeight = c.height;
        drawX = (c.width - drawWidth) / 2;
        drawY = 0;
    }

    // Draw the image scaled to fit the calculated dimensions
    maskCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    
    // Get the image data and create the mask
    var imageData = maskCtx.getImageData(0, 0, c.width, c.height);
    mask = new Array(c.width * c.height);
    for (var i = 0; i < imageData.data.length; i += 4) {
        // Check if the pixel is black (or very close to black)
        mask[i / 4] = imageData.data[i] < 10 && imageData.data[i + 1] < 10 && imageData.data[i + 2] < 10;
    }
    
    // Initialize drops and speeds
    for(var x = 0; x < columns; x++) {
        drops[x] = Math.random() * c.height / font_size; // Random initial position
        dropSpeeds[x] = 1 + Math.random(); // Random speed between 1 and 2
    }
    
    // Start the animation once the image is loaded
    clearInterval(intervalId);
    intervalId = setInterval(draw, 50);    
};
img.src = 'image.png'; // Make sure this path is correct

function changeImage(imageSrc) {
    img.src = imageSrc;
}
// Modify the draw function
function draw() {
    // Black BG for the canvas
    // Translucent BG to show trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#4A90E2"; // Text color
    ctx.font = font_size + "px arial";

    // Looping over drops
    for (var i = 0; i < drops.length; i++) {
        var x = i * font_size;
        var y = drops[i] * font_size;

        // Check if the current position is within the mask
        if (mask[Math.floor(y) * c.width + x]) {
            var text = matrix[Math.floor(Math.random() * matrix.length)];
            ctx.fillText(text, x, y);
        }

        // Move the drop down
        drops[i] += dropSpeeds[i];

        // If we've reached the bottom of the canvas, wrap around to the top
        if (drops[i] * font_size >= c.height) {
            drops[i] = 0;
        }
    }
}
