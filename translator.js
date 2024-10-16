// Define chartInstance globally to prevent errors
let chartInstance = null;

// Golden ratio constant (default)
let phi = 1.618;

// Expanded alphabet mapping with updated "Q" symbol
const alphabetMapping = {
    "A": "𓂀",
    "B": "Ꙫ",
    "C": "ⴲ",
    "D": "Ꙥ",
    "E": "⊕",
    "F": "⨀",
    "G": "Ꙡ",
    "H": "𑀯",
    "I": "⨁",
    "J": "✹",
    "K": "ꙧ",
    "L": "⍣",
    "M": "⚸",
    "N": "⚺",
    "O": "⦿",
    "P": "⚛",
    "Q": "⊛",
    "R": "⚒",
    "S": "⚕",
    "T": "✴",
    "U": "☀",
    "V": "⍟",
    "W": "⚙",
    "X": "⚚",
    "Y": "⚖",
    "Z": "⚗"
};

// Function to translate individual letters based on alphabet mapping
function translateAlphabet(inputText) {
    const words = inputText.toUpperCase().split('');
    const translatedWords = words.map(letter => {
        return alphabetMapping[letter] || letter; // Return mapped letter or original if not mapped
    });
    return translatedWords.join('');
}

// Golden ratio cipher function, adjusted by slider value for φ
function goldenRatioCipher(word) {
    const letters = word.toUpperCase().split('');
    const cipher = letters.map((letter, index) => {
        const charCode = letter.charCodeAt(0) - 64; // 'A' = 1, 'B' = 2, etc.
        return Math.round(charCode * Math.pow(phi, index));
    });
    return cipher;
}

// Function to generate color based on value
function getColor(value, minValue, maxValue) {
    const normalizedValue = (value - minValue) / (maxValue - minValue);

    // Create a gradient from blue (low) to red (high)
    const red = Math.round(255 * normalizedValue);
    const green = Math.round(255 * (1 - normalizedValue));
    const blue = Math.round(255 * (1 - normalizedValue));
    return `rgb(${red}, ${green}, ${blue})`;
}

// Plot the cipher graph with colored dots representing the values
function plotCipherGraph(cipherArray) {
    const ctx = document.getElementById('cipherGraph').getContext('2d');

    // Destroy previous chart instance
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Determine the min and max values in the array for color scaling
    const min = Math.min(...cipherArray);
    const max = Math.max(...cipherArray);

    // Prepare dataset with each point having a specific color
    const data = cipherArray.map((value, index) => ({
        x: index,
        y: value,
        backgroundColor: getColor(value, min, max)
    }));

    chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Golden Ratio Cipher',
                data: data,
                pointRadius: 8,
                pointBackgroundColor: data.map(point => point.backgroundColor)
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1000,
                easing: 'easeInOutCubic'
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Character Position',
                        font: {
                            family: 'Courier',
                            size: 16,
                            weight: 'bold',
                            color: '#2c3e50'
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Encoded Value',
                        font: {
                            family: 'Courier',
                            size: 16,
                            weight: 'bold',
                            color: '#2c3e50'
                        }
                    }
                }
            }
        }
    });

    // Also create the interactive D3.js shape visualization with enhanced effects
    createEnhancedD3ShapeVisualization(cipherArray);
}

// Create an enhanced, interactive shape using D3.js
function createEnhancedD3ShapeVisualization(cipherArray) {
    // Clear any previous SVG element
    d3.select("#shapeContainer").selectAll("*").remove();

    const width = 600;
    const height = 400;
    const radius = 150; // Radius for radial layout

    // Create an SVG element within the shapeContainer
    const svg = d3.select("#shapeContainer")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .style("background-color", "#f4f4f9");

    // Determine the min and max values in the array for color scaling
    const min = Math.min(...cipherArray);
    const max = Math.max(...cipherArray);

    // Convert the cipher array to points arranged in a radial pattern
    const angleStep = (2 * Math.PI) / cipherArray.length;
    const points = cipherArray.map((value, index) => {
        const angle = index * angleStep;
        return {
            x: width / 2 + radius * Math.cos(angle) * (1 + value / 100),
            y: height / 2 + radius * Math.sin(angle) * (1 + value / 100),
            value: value
        };
    });

    // Create the shape using Bezier curves for smooth transitions
    const lineGenerator = d3.line()
                            .curve(d3.curveCardinalClosed)
                            .x(d => d.x)
                            .y(d => d.y);

    const pathData = lineGenerator(points);

    const shape = svg.append("path")
                     .attr("d", pathData)
                     .attr("fill", "url(#animatedGradient)")
                     .attr("stroke", "#1f3a93")
                     .attr("stroke-width", 3)
                     .attr("opacity", 0.8);

    // Create a gradient fill for the shape with animation
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
                         .attr("id", "animatedGradient")
                         .attr("x1", "0%")
                         .attr("y1", "0%")
                         .attr("x2", "100%")
                         .attr("y2", "100%");

    gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#3498db") // Blue
            .transition()
            .duration(3000)
            .ease(d3.easeCubicInOut)
            .attr("stop-color", "#e74c3c") // Red
            .on("end", function repeat() {
                d3.select(this)
                  .transition()
                  .duration(3000)
                  .ease(d3.easeCubicInOut)
                  .attr("stop-color", "#3498db")
                  .on("end", repeat);
            });

    gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#e74c3c") // Red
            .transition()
            .duration(3000)
            .ease(d3.easeCubicInOut)
            .attr("stop-color", "#3498db")
            .on("end", function repeat() {
                d3.select(this)
                  .transition()
                  .duration(3000)
                  .ease(d3.easeCubicInOut)
                  .attr("stop-color", "#e74c3c")
                  .on("end", repeat);
            });

    // Add particles for enhanced visual effect
    points.forEach(point => {
        svg.append("circle")
           .attr("cx", point.x)
           .attr("cy", point.y)
           .attr("r", 5)
           .attr("fill", getColor(point.value, min, max))
           .transition()
           .duration(2000)
           .ease(d3.easeElasticOut)
           .attr("r", 10)
           .attr("opacity", 0.5)
           .on("end", function repeat() {
                d3.select(this)
                  .transition()
                  .duration(2000)
                  .ease(d3.easeElasticOut)
                  .attr("r", 5)
                  .attr("opacity", 1)
                  .on("end", repeat);
           });
    });

    // Add rotation animation to the entire shape
    function animateRotation() {
        shape.transition()
             .duration(10000)
             .ease(d3.easeLinear)
             .attrTween("transform", function () {
                 return d3.interpolateString("rotate(0,300,200)", "rotate(360,300,200)");
             })
             .on("end", animateRotation);
    }
    animateRotation();

    // Add dragging functionality
    let isDragging = false;
    let originalTransform;

    shape.call(
        d3.drag()
          .on("start", function (event) {
              isDragging = true;
              originalTransform = d3.select(this).attr("transform");
          })
          .on("drag", function (event) {
              if (isDragging) {
                  d3.select(this)
                    .attr("transform", `translate(${event.dx}, ${event.dy})`);
              }
          })
          .on("end", function () {
              isDragging = false;
              // Return to original position
              d3.select(this)
                .transition()
                .duration(1000)
                .attr("transform", originalTransform);
          })
    );
}

// Form submission handling
document.getElementById('translatorForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputText = document.getElementById('inputText').value;

    const translatedText = translateAlphabet(inputText);
    document.getElementById('translatedText').innerHTML = translatedText;

    const cipherArray = [];
    translatedText.split('').forEach(letter => {
        const cipher = goldenRatioCipher(letter);
        cipherArray.push(...cipher);
    });

    plotCipherGraph(cipherArray);
});

// Play sound only when the "Play Sound" button is clicked
document.getElementById('playSoundButton').addEventListener('click', function() {
    const inputText = document.getElementById('inputText').value;
    const translatedText = translateAlphabet(inputText);
    const cipherArray = [];

    translatedText.split('').forEach(letter => {
        const cipher = goldenRatioCipher(letter);
        cipherArray.push(...cipher);
    });

    playGraphSounds(cipherArray);
});

// Play Sound function for the graph points
function playGraphSounds(cipherArray) {
    if (cipherArray.length === 0) {
        return;
    }

    const minY = Math.min(...cipherArray);
    const maxY = Math.max(...cipherArray);

    cipherArray.forEach((yValue, index) => {
        const frequency = mapYValueToFrequency(yValue, minY, maxY);
        setTimeout(() => playSound(frequency), index * 500); // Stagger sound for each point
    });
}

// Sound generation based on plot points
function playSound(frequency, duration = 500) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gainNode.gain.setValueAtTime(0.5, context.currentTime);

    oscillator.start();
    oscillator.stop(context.currentTime + duration / 1000);
}

// Map Y-values to frequency range for sound generation
function mapYValueToFrequency(yValue, minY, maxY, minFrequency = 200, maxFrequency = 1000) {
    const normalizedY = (yValue - minY) / (maxY - minY);
    return minFrequency + (normalizedY * (maxFrequency - minFrequency));
}
