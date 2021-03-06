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


   var elem = document.getElementById("myBar");   
  function setBarProgress(width) {
    console.log("Setting length to : " + width)
      elem.style.width = width + '%'; 
    
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
    "overlap": 0,
    "reverse": false,

}).toMaster();

grainplayer.start()
grainplayer.volume.value = -10;
grainvoice.volume.value = 12;
undeadvoice.volume.value = 15;

// grainvoice.start();
grainbass.volume.value = -7;

  setTimeout(() => {
                      Tone.Transport.start();


                    }, 10000)



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
var seance_in_progress = false;
var laggingXValue = 10;

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
      console.log('lagging x value: ', laggingXValue)
      console.log('stage: ', stage);
      console.log('Time diff: ', new Date() - time)
      timeDiff = new Date() - time
      if (smoothedYValue > 8 && !seance_in_progress && (new Date() - time > 30000))  {
        stage = 0;
        time = new Date();
        document.getElementById("words").innerText = "TO COMMUNICATE WITH THE DEAD, SIT WITH YOUR FEET IN POSITION ON THE FLOOR AND BEGIN RAISING YOUR ARMS SLOWLY ABOVE YOUR HEAD";
        serial.write(0)
        


      }

     
      let xCoordinateDiff = laggingXValue - smoothedXValue;
      console.log("x coordinate diff : " + Math.abs(xCoordinateDiff))
         // Initiate Stage 3
      if (Math.abs(xCoordinateDiff) > 0.35 && stage == 3 && (new Date() - time > 15000)) {
        setBarProgress(100)

        time = new Date();
        stage = 4;
         document.getElementById("words").innerText = "You may now speak to the spirit. Beware - it may not like what it hears."
          serial.write(4);
          grainvoice.mute = true;
          grainbass.mute = true;
          grainbass.stop();
          grainplayer.mute = true;

          delay1.feedback.value = 0
          reverb.roomSize.value = 0
          //RESTART 
                setTimeout(() => {
                   stage = 0;
                   serial.write(0);
                   seance_in_progress = false;
                   grainplayer.mute = false;
                  grainbass.mute = false;
                   grainplayer.start();

                 }, 80000)


                          // TODO
                  // Play voice recording of the dead

          setTimeout(() => {
            undeadvoice.start();
          }, 3000)

          setTimeout(() => {
            serial.write(5)
            console.log("WRITING LAST STAGE")
          }, 40000)

      }
         if (xCoordinateDiff >= 0.1  && timeDiff > 2000 && stage == 3) {

                setBarProgress(25)
            }

              if (xCoordinateDiff >= 0.3  &&  timeDiff > 5000 && stage == 3) {

                setBarProgress(60)
            }

                   if ( timeDiff > 10000 && stage == 3) {

                setBarProgress(70)
            }

               if (xCoordinateDiff >= 0.4  && timeDiff > 13000 && stage == 3) {

                setBarProgress(90)
            }


      // Initiate Stage 3
      if (smoothedYValue <= 5.5 && stage == 2 && (new Date() - time > 16000)) {
        time = new Date();
        stage = 3;
         document.getElementById("words").innerText = "The spirits have arrived but who knows who may be speaking. Now place your left hand over your heart to open your soul to the one you truly seek."
          serial.write(3);
          grainvoice.mute = false;
          grainvoice.start();
          grainbass.volume.value = -10;
          setBarProgress(0)


      }
        if (smoothedYValue <= 6.75  && timeDiff > 4000 && stage == 2) {

                setBarProgress(25)
            }

              if (smoothedYValue <= 6.35  && timeDiff > 7000 && stage == 2) {

                setBarProgress(40)
            }

               if (smoothedYValue <= 5.8  &&  timeDiff > 11000 && stage == 2) {

                setBarProgress(80)
            }


      // Initiate Stage 2
      if (smoothedYValue <= 7 && stage == 1 && (new Date() - time > 7000)) {
        time = new Date();
        stage = 2;
        document.getElementById("words").innerText = "The spirits are approaching the mortal realm. Continue raising your arms. Do not anger the spirits!"
         serial.write(2);
        grainbass.start();
        laggingXValue = smoothedXValue;
      setBarProgress(0)

        }

             if (smoothedYValue <= 7.75  && timeDiff > 2000 && stage == 1) {

                setBarProgress(25)
            }

              if (smoothedYValue <= 7.5  &&  timeDiff > 4000 &&  stage == 1) {

                setBarProgress(50)
            }

               if (smoothedYValue <= 7.25  && timeDiff > 5000 && stage == 1) {

                setBarProgress(75)
            }

        // Initiate Stage 1
      if (smoothedYValue <= 8  && stage == 0 && (new Date() - time > 16000)) {
          time = new Date();
           document.getElementById("words").innerText = "The dead have heard your call. Continue raising your arms over your head. "
            // Bass starts
          serial.write(1);
          stage = 1;

          delay1.feedback.value = 1
        reverb.roomSize.value = .9
                seance_in_progress = true;
                                setBarProgress(0)




        }
        // if (smoothedYValue <= 8  && stage == 0 ) {

            if (smoothedYValue <= 8.5 && timeDiff > 8000 && stage == 0) {

                setBarProgress(50)
            }

              if (smoothedYValue <= 8.2 && timeDiff > 13000 && stage == 0) {

                setBarProgress(77)
            }

        // }

    } else {
        grainbass.stop();
    }



}





