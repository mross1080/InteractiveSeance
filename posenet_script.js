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
Tone.Transport.scheduleRepeat(playChord, "1m");
var delay1 = new Tone.PingPongDelay("8t", 0.01).toMaster();
var reverb = new Tone.JCReverb(0).connect(Tone.Master);
var dist = new Tone.Distortion(0).toMaster();

var meter = new Tone.Meter();
Tone.Master.chain(meter);


var grainplayer = new Tone.GrainPlayer({
    "url": "https://s3.us-east-2.amazonaws.com/itpcloudassets/chants.wav",
    "loop": true,
    "grainSize": 1,
    "overlap": 1,
    "reverse": true,
    "playbackRate": 1
}).connect(delay1).connect(dist).connect(reverb).toMaster();


var grainbass = new Tone.GrainPlayer({
    "url": "https://s3.us-east-2.amazonaws.com/itpcloudassets/bassdrone2.mp3",
    "loop": true,
    "grainSize": 1,
    "overlap": 0,
    "reverse": false,
    "playbackRate": 4
}).toMaster();

grainplayer.start()
grainplayer.volume.value = -10;
// grainbass.volume.value = -5;
Tone.Transport.start();



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

var maxXValue = 0;
var minXValue = 10;
var smoothedXValue = 0;

var maxYValue = 0;
var minYValue = 10;
var smoothedYValue = 0;



var leftShoulder = 0;

function playChord() {


    // TODO 
    // Write Default LED State 
    console.log(poses)
    if (poses.length > 0) {
      // if poses.length > 0 then we have at least one person on the screen, begin feedback sequences


        // TODO 
        // Write Phase 1 of LED Feedback now that we are tracking bodies 


        var me = poses[0]
        console.log("MY DATA : ")
        console.log(me)
        console.log("POSES : ")
        console.log(me.pose)

        document.getElementById("camvalue").innerText = "Left Wrist : x= " + me.pose.keypoints[9].position.x + " y=" + me.pose.keypoints[9].position.y;

        mappedYValue = Math.floor(map(me.pose.keypoints[9].position.y, 0, 500, 0, 10))
        mappedXValue = Math.floor(map(me.pose.keypoints[9].position.x, 0, 500, 0, 10))
        document.getElementById("mappedcamvalue").innerText = "Mapped and Smoothed Left Wrist : x= " + mappedXValue + " y=" + mappedYValue;



        // TODO : Possibly Refactor this ? 
        // Smooth X values 
        if (smoothedXValue == 0) {
            smoothedXValue = mappedXValue;

        } else {
            smoothedXValue = smoothedXValue * 0.9 + mappedXValue * 0.1;
        }

        if (mappedXValue > maxXValue) {
            maxXValue = mappedXValue;
        }

        if (mappedXValue < minXValue) {
            minXValue = mappedXValue;
        }

        // Smooth Y values
        if (smoothedYValue == 0) {
            smoothedYValue = mappedYValue;

        } else {
            smoothedYValue = smoothedYValue * 0.9 + mappedYValue * 0.1;
        }

        if (mappedYValue > maxYValue) {
            maxYValue = mappedYValue;
        }

        if (mappedYValue < minYValue) {
            minYValue = mappedYValue;
        }

        document.getElementById("smoothedcamvalue").innerText = "Mapped and Smoothed Left Wrist : x= " + smoothedXValue + " y=" + smoothedYValue;



        // if smoothedYValue is less that 7 initiate next feedback
        if (smoothedYValue <= 7) {

            // Bass starts 
            grainbass.start()

            // TODO initiate LED circle of death and flashing 

            // Todo intiate Servo 'waking up'

           if (smoothedYValue <= 4) {

              // TODO 
              // Final Crazy LED Sequence going

               // TODO 
              // Initiate Balloon rising into the air

                if (smoothedYValue <= 3) {

              // TODO 
              // Play voice recording of the dead 



        } else {
            grainbass.stop();
        }





    }

}