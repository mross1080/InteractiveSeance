
/* ===
Adapted Via https://github.com/ml5js/ml5-examples/tree/master/p5js/PoseNet
=== */


let video;
let poseNet;
let poses = [];
let keypoints = {}

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);

    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', function(results) {
        poses = results;
    });
    // Hide the video element, and just show the canvas
    video.hide();
}

function modelReady() {
    select('#status').html('Model Loaded');
}

function draw() {
    image(video, 0, 0, width, height);

    // We can call both functions to draw all keypoints and the skeletons
    drawKeypoints();
    drawSkeleton();
    // getValues();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {

    for (let i = 0; i < poses.length; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = poses[i].pose;
        // console.log(poses)
        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];

            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {
                fill(255, 0, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }
    }
}

var skeleton = ""
var meter = new Tone.Meter();
Tone.Master.chain(meter);
var polyRead = new Tone.Waveform(32);
var poly = new Tone.PolySynth({
    polyphony: 4,
    volume: 0,
    detune: 0,
    voice: Tone.DuoSynth
}).connect(polyRead).toMaster();
//set the attributes using the set interface

poly.volume.value = -10;
Tone.Transport.start();
Tone.Transport.scheduleRepeat(playChord, "1m");


// A function to draw the skeletons
function drawSkeleton() {
    // Loop through all the skeletons detected

    for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].skeleton;

        // For every skeleton, loop through all body connections
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255, 0, 0);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}


//Optional Smoothing Function
function getValues() {

    var maxValue = 0;
    var minValue = 100;
    var avgValue = 0;

    note2 = 5;
    note = 6
    for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].pose.keypoints;

        // console.log(skeleton)
        // For every skeleton, loop through all body connections

        var leftElbowPosition = skeleton[7]["score"]
        var position = leftElbowPosition * 100;

        if (avgValue == 0) {

            avgValue = position;

        } else {
            avgValue = avgValue * 0.9 + position * 0.1;

        }
        console.log("Average : " + avgValue)


        if (position > maxValue) {
            maxValue = position;
        }

        if (position < minValue) {
            minValue = position;
        }

        console.log("MAX : " + maxValue)
        console.log("MIN : " + minValue)

        document.getElementById("position").innerText = avgValue;
        document.getElementById("camvalue").innerText = position;


        // console.log(leftElbowPosition * 100)
        var leftWristPosition = skeleton[9]["score"]
        // console.log("Initial Position of left " + leftWristPosition)
        var rightWristPosition = skeleton[10]["score"]
        if (leftElbowPosition > .1) {


            note = Math.floor(leftElbowPosition * 10)
            // console.log("Processed note will be " + note)

        }
    }

}

var leftShoulder = 0;

function playChord() {

    console.log(poses)
    if (poses.length > 0) {
        var me = poses[0]
        console.log("MY DATA : ")
        console.log(me)
        console.log("POSES : ")
        console.log(me.pose)

        document.getElementById("camvalue").innerText = "Left Wrist : x= " + me.pose.keypoints[9].position.x + " y=" + me.pose.keypoints[9].position.y;

        mappedYValue = map(me.pose.keypoints[9].position.y, 0, 500, 0, 100)
        mappedXValue = map(me.pose.keypoints[9].position.x, 0, 500, 0, 100)

        document.getElementById("mappedcamvalue").innerText = "Mapped Left Wrist : x= " + mappedXValue + " y=" + mappedYValue;

        let notes = ["C" + mappedXValue, "G" + Math.floor(mappedYValue), "E5", "B" + Math.floor(mappedYValue)];
        // poly.triggerAttackRelease(notes, "4n");

    }

}