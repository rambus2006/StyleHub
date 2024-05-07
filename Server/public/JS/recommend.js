function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function recommendColor() {
    var colorBox = document.getElementById('colorBox');
    var randomColor = getRandomColor();
    colorBox.style.backgroundColor = randomColor;
    
}