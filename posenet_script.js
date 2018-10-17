
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
var delay1 = new Tone.PingPongDelay("8t", 0.1).toMaster();
var reverb = new Tone.JCReverb(0).connect(Tone.Master);
var dist = new Tone.Distortion(0).toMaster();

var meter = new Tone.Meter();
Tone.Master.chain(meter);


  var grainplayer = new Tone.GrainPlayer({
      "url" : "https://s3.us-east-2.amazonaws.com/itpcloudassets/chants.wav",
      "loop" : true,
      "grainSize" : 1,
      "overlap" : 1,
      "reverse": true,
      "playbackRate": 1
    }).connect(delay1).connect(dist).connect(reverb).toMaster();


        var grainbass = new Tone.GrainPlayer({
      "url" : "https://s3.us-east-2.amazonaws.com/itpcloudassets/bassdrone2.mp3",
      "loop" : true,
      "grainSize" : 1,
      "overlap" : 0,
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
    var avgXValue = 0;

      var maxYValue = 0;
    var minYValue = 10;
    var avgYValue = 0;

//Optional Smoothing Function
// function getValues() {


//     note2 = 5;
//     note = 6
//     for (let i = 0; i < poses.length; i++) {
//         let skeleton = poses[i].pose.keypoints;

//         // console.log(skeleton)
//         // For every skeleton, loop through all body connections

//         var leftElbowPosition = skeleton[7]["score"]
//         var position = leftElbowPosition * 100;

//         if (avgValue == 0) {

//             avgValue = position;

//         } else {
//             avgValue = avgValue * 0.9 + position * 0.1;

//         }
//         console.log("Average : " + avgValue)


//         if (position > maxValue) {
//             maxValue = position;
//         }

//         if (position < minValue) {
//             minValue = position;
//         }

//         console.log("MAX : " + maxValue)
//         console.log("MIN : " + minValue)

//         document.getElementById("position").innerText = avgValue;
//         document.getElementById("camvalue").innerText = position;


//         // console.log(leftElbowPosition * 100)
//         var leftWristPosition = skeleton[9]["score"]
//         // console.log("Initial Position of left " + leftWristPosition)
//         var rightWristPosition = skeleton[10]["score"]
//         if (leftElbowPosition > .1) {


//             note = Math.floor(leftElbowPosition * 10)
//             // console.log("Processed note will be " + note)

//         }
//     }

// }

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

        mappedYValue = Math.floor(map(me.pose.keypoints[9].position.y, 0, 500, 0, 10))
        mappedXValue = Math.floor(map(me.pose.keypoints[9].position.x, 0, 500, 0, 10))
        document.getElementById("mappedcamvalue").innerText = "Mapped and Smoothed Left Wrist : x= " + mappedXValue + " y=" + mappedYValue;


        if (avgXValue == 0) {
            avgXValue = mappedXValue;

        } else {
            avgXValue = avgXValue * 0.9 + mappedXValue * 0.1;

        }

        if (mappedXValue > maxXValue) {
            maxXValue = mappedXValue;
        }

        if (mappedXValue < minXValue) {
            minXValue = mappedXValue;
        }

          // Smooth Y values
           if (avgYValue == 0) {
            avgYValue = mappedYValue;

        } else {
            avgYValue = avgYValue * 0.9 + mappedYValue * 0.1;

        }

        if (mappedYValue > maxYValue) {
            maxYValue = mappedYValue;
        }

        if (mappedYValue < minYValue) {
            minYValue = mappedYValue;
        }







        document.getElementById("smoothedcamvalue").innerText = "Mapped and Smoothed Left Wrist : x= " + avgXValue + " y=" + avgYValue;

        
        if (avgYValue <= 7) {

            grainbass.start()
        } else {
            grainbass.stop();

        }




        let notes = ["C" + mappedXValue, "G" + Math.floor(mappedYValue), "E5", "B" + Math.floor(mappedYValue)];
        // poly.triggerAttackRelease(notes, "4n");

    }

}