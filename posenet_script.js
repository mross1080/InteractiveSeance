/* ===
Adapted Via https://github.com/ml5js/ml5-examples/tree/master/p5js/PoseNet
=== */


let video;
let poseNet;
let poses = [];
let keypoints = {}
let stage = 0;
let time = new Date();
var serial; // variable to hold an instance of the serialport library
var fromSerial = 0; //variable to hold the data


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
  serial = new p5.SerialPort(); // make a new instance of  serialport librar
  // serial.on('list', printList); // callback function for serialport list event
  serial.on('data', serialEvent); // callback for new data coming in
  serial.list(); // list the serial ports
  serial.open("/dev/cu.usbmodem1431"); // open a port

}
function serialEvent() {
  // this is called when data is recieved
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


var voice_files = ["bassdrone2.mp3","seanceaudio2.mp3"]
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

var grainvoice = new Tone.GrainPlayer({
    "url": "https://s3.us-east-2.amazonaws.com/itpcloudassets/seanceaudio1.wav",
        "loop": true,
    "grainSize": 1,
    "overlap": 0,
    "reverse": false,

}).toMaster();


var undeadvoice = new Tone.GrainPlayer({
    "url": "https://s3.us-east-2.amazonaws.com/itpcloudassets/seanceaudiodead.mp3",
        "loop": false,
    "grainSize": 1,
    "overlap": 0,
    "reverse": false,

}).toMaster();

grainplayer.start()
grainplayer.volume.value = -10;
grainvoice.volume.value = 5;
undeadvoice.volume.value = 10;

// grainvoice.start();
grainbass.volume.value = -10;
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
  //set stage in interaction
    if (poses.length > 0) {

        // if poses.length > 0 then we have at least one person on the screen, begin feedback sequences
        // TODO
        // Write Phase 1 of LED Feedback now that we are tracking bodies

        var me = poses[0]

      //        document.getElementById("camvalue").innerText = "Left Wrist : x= " + me.pose.keypoints[9].position.x + " y=" + me.pose.keypoints[9].position.y;

        mappedYValue = Math.floor(map(me.pose.keypoints[9].position.y, 0, 500, 0, 10))
        mappedXValue = Math.floor(map(me.pose.keypoints[9].position.x, 0, 500, 0, 10))
      //  document.getElementById("mappedcamvalue").innerText = "Mapped and Smoothed Left Wrist : x= " + mappedXValue + " y=" + mappedYValue;


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

      //        document.getElementById("smoothedcamvalue").innerText = "Mapped and Smoothed Left Wrist : x= " + smoothedXValue + " y=" + smoothedYValue;
        // if smoothedYValue is less that 7 initiate next feedback
      console.log('y value: ', smoothedYValue)
      console.log('x value: ', smoothedXValue)
      console.log('stage: ', stage);
      console.log('diff: ', new Date() - time)
      if (smoothedYValue > 8.5 && (new Date() - time > 30000))  {
        stage = 0;
        time = new Date();
        document.getElementById("instructions").innerText = "TO COMMUNICATE WITH THE DEAD, APPROACH THE MONITOR AND BEGIN RAISING YOUR ARMS SLOWLY";
        serial.write(0)
      }


      //     // Initiate Stage 3
      if (smoothedXValue <= 8 && stage == 3 && (new Date() - time > 7000)) {
        time = new Date();
        stage = 4;
         document.getElementById("instructions").innerText = "Your spirit has arrived, be careful what you wish for"
          serial.write(4);
          grainvoice.mute = true;
          grainbass.mute = true;
          grainplayer.mute = true;

          delay1.feedback.value = 0
        reverb.roomSize.value = 0

                    setTimeout(() => {
                            undeadvoice.start();

                 }, 3000)
            // Todo intiate Servo 'waking up'

        //         setTimeout(() => {
        //           stage = 0;
        //         }, 10000)
        //                  // TODO
                  // Play voice recording of the dead
      }

      // Initiate Stage 3
      if (smoothedYValue <= 5 && stage == 2 && (new Date() - time > 7000)) {
        time = new Date();
        stage = 3;
         document.getElementById("instructions").innerText = "The spirits have arrived. Now place your left hand over your heart to project your soul into the beyond"
          serial.write(3);
          grainvoice.start();
          grainbass.volume.value = -20;
            // Todo intiate Servo 'waking up'

        //         setTimeout(() => {
        //           stage = 0;
        //         }, 10000)
        //                  // TODO
                  // Play voice recording of the dead
      }
      // Initiate Stage 2
      if (smoothedYValue <= 7 && smoothedYValue >= 5.5 && stage == 1 && (new Date() - time > 7000)) {
        time = new Date();
        stage = 2;
        document.getElementById("instructions").innerText = "The spirits are approaching the mortal realm. Continue raising your arms. Do not anger the spirits!"
         serial.write(2);
        grainbass.start();
        }

        // Initiate Stage 1
      if (smoothedYValue <= 9 && smoothedYValue >= 7 && stage == 0 && (new Date() - time > 7000)) {
          time = new Date();
           document.getElementById("instructions").innerText = "The dead have heard your call. Continue raising your arms. "
            // Bass starts
          serial.write(1);
          stage = 1;

          delay1.feedback.value = 1
        reverb.roomSize.value = .9


        }
    } else {
        grainbass.stop();
    }



}





