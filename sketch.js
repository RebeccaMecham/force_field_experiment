// Force-field experiment ported from Pygame to p5.js
// Mobile-compatible (mouse + touch)


let WIDTH = 800;
let HEIGHT = 800;
let drawTop = HEIGHT / 2; // same as your code
let B = 0.3; // force field gain


let triangle;
let maskThickness = 30; // thickness of polygon outline for accuracy test


let drawing = false;
let prevPos = null;
let prevMouse = null;


let realPoints = [];
let drawPoints = [];
let accurate = [];


let trialData = [];
let trialNum = 0;
let startTime = null;


let accuracyThreshold = 0.75; // stop when reached

// Google Apps Script endpoint (paste your deployed web app URL here)
let GAS_ENDPOINT = "https://rebeccamecham.github.io/force_field_experiment/";


function setup() {
// Make canvas responsive but keep aspect ratio
let canvas = createCanvas(WIDTH, HEIGHT);
canvas.parent(document.body);
textFont('Arial');


triangle = [
createVector(width/2, 150),
createVector(width/2 - 100, 250),
createVector(width/2 + 100, 250)
];


// Hook download button
const dl = document.getElementById('downloadBtn');
dl.addEventListener('click', () => downloadCSV(trialData, 'experiment_results.csv'));
}


function windowResized(){
// Keep fixed size for consistent experience; optionally adapt here
// resizeCanvas(windowWidth, windowHeight);
}
function draw() {
// If threshold reached, stop further trials and notify
if (accuracy >= accuracyThreshold) {
document.getElementById('status').textContent = `Threshold reached (acc=${accuracy.toFixed(2)}) — experiment stopped.`;
noLoop(); // stop draw loop to preserve final state
// Optionally offer download
downloadCSV(trialData, 'experiment_results.csv');
}
}


function pointOnPolygonOutline(p, poly, thickness) {
// Determine if point is within poly interior OR within 'stroke' area of edges.
// We'll check if inside polygon (barycentric) OR distance to any edge < thickness/2
if (pointInTriangle(p, poly)) return true;


// Check distance to each edge
for (let i = 0; i < poly.length; i++) {
let a = poly[i];
let b = poly[(i+1) % poly.length];
let d = distancePointToSegment(p, a, b);
if (d <= thickness/2) return true;
}
return false;
}


function pointInTriangle(p, tri) {
// Barycentric technique
let A = tri[0], B = tri[1], C = tri[2];
let area = abs((B.x - A.x)*(C.y - A.y) - (C.x - A.x)*(B.y - A.y));
let area1 = abs((A.x - p.x)*(B.y - p.y) - (B.x - p.x)*(A.y - p.y));
let area2 = abs((B.x - p.x)*(C.y - p.y) - (C.x - p.x)*(B.y - p.y));
let area3 = abs((C.x - p.x)*(A.y - p.y) - (A.x - p.x)*(C.y - p.y));
return abs(area - (area1 + area2 + area3)) < 1e-2;
}


function distancePointToSegment(p, v, w) {
// p, v, w are p5.Vector
let l2 = p5.Vector.dist(v, w) ** 2;
if (l2 == 0.0) return p5.Vector.dist(p, v);
let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
t = max(0, min(1, t));
let proj = createVector(v.x + t * (w.x - v.x), v.y + t * (w.y - v.y));
return p5.Vector.dist(p, proj);
}


async function postToGAS(record) {
try {
const res = await fetch(GAS_ENDPOINT, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(record)
});
const json = await res.json();
console.log('GAS response', json);
} catch (err) {
console.error('Error posting to GAS', err);
}
}


function downloadCSV(data, name) {
if (!data || data.length === 0) return;
let csv = 'Trial,Time,Accuracy,Error,Timestamp\n';
data.forEach(d => {
csv += `${d.Trial},${d.Time},${d.Accuracy},${d.Error},${d.Timestamp}\n`;
});
const blob = new Blob([csv], {type: 'text/csv'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = name;
document.body.appendChild(a);
a.click();
a.remove();
}
