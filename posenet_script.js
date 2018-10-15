// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];

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
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // console.log(poses)
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
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

var meter = new Tone.Meter();
Tone.Master.chain(meter);
var polyRead = new Tone.Waveform(32);
var poly = new Tone.PolySynth({
    polyphony  : 4 ,
    volume  : 0 ,
    detune  : 0 ,
    voice  : Tone.DuoSynth
    }
    ).connect(polyRead).toMaster();
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



function playChord() {
  // console.log(poses)
  // if (hand.confidence) {

        // note = Math.floor(hand.confidence * 10)
        // note1 = Math.floor(rotationAxis[0] * 10)
        // note2 = Math.floor(hand.pinchStrength * 10)
        note2 = 5;
        note = 6
         for (let i = 0; i < poses.length; i++) {
          let skeleton = poses[i].pose.keypoints;

          console.log(skeleton)
    // For every skeleton, loop through all body connections

    var leftElbowPosition = skeleton[7]["score"]
    console.log(leftElbowPosition)
    var leftWristPosition =  skeleton[9]["score"]
    console.log("Initial Position of left " + leftWristPosition)
    var rightWristPosition =  skeleton[10]["score"]
    if (leftElbowPosition > .1) {


        note = Math.floor(leftElbowPosition* 10)
        console.log("Processed note will be " + note)

    }


      // for (let j = 0; j < skeleton.length; j++) {
      //   console.log("Checking" + skeleton[j]["part"])
      //       if ( skeleton[j]["part"].includes("Wrist")) {
      //         console.log("plating note")
      //                let notes = ["C" + note2, "G" + note2,"E5","B" + note];
      //            poly.triggerAttackRelease(notes, "4n");


      //       }
        // stroke(255, 0, 0);
        // line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
      // }
    }

      // note = integer.parseInt(hand.confidence * 10)
      // console.log(note)
      // Play Cmaj7
 
        // sampler.triggerAttack("D3")

        // grainplayer.playbackRate =hand.confidence;
         // grainplayer.grainSize = hand.pinchStrength;

  // }




}


