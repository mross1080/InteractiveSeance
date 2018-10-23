#include <FastLED.h>
#include <Servo.h>
Servo myServo; // create servo object to control a servo
// all credit to Mark Kriegman and FastLED - borrowed heavily from many examples
FASTLED_USING_NAMESPACE

#if defined(FASTLED_VERSION) && (FASTLED_VERSION < 3001000)
#warning "Requires FastLED 3.1 or later; check github for latest code."
#endif

#define DATA_PIN    3
#define SERVO_PIN   5
#define LED_TYPE    WS2811
#define COLOR_ORDER GRB
#define NUM_LEDS    50
uint8_t stepRate = 50;
uint8_t sat = 0;
uint8_t finalCVal = 160;
int upOrDown = 0;
byte intFromSerial; //define empty byte for state setting later
CRGB leds[NUM_LEDS];
boolean started_interaction = false;
bool gReverseDirection = false;

int pos = 60;
#define BRIGHTNESS          96
// is this useful? #define FRAMES_PER_SECOND  120
uint8_t gHue = 0; // rotating "base color" used by many of the patterns
CRGBPalette16 gPal;


void setup() {
  Serial.begin(9600);
  myServo.attach(SERVO_PIN);
  myServo.write(pos);
  delay(3000);
  // put your setup code here, to run once:
  // delay(3000); // 3 second delay for recovery
    gPal = HeatColors_p;

  // tell FastLED about the LED strip configuration
  FastLED.addLeds<LED_TYPE,DATA_PIN,COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  //FastLED.addLeds<LED_TYPE,DATA_PIN,CLK_PIN,COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);

  // set master brightness control
  FastLED.setBrightness(BRIGHTNESS);

}

void loop() {
    random16_add_entropy( random());
    EVERY_N_MILLISECONDS(stepRate) {
    if (upOrDown == 0) {
     sat++;
    } else {
      sat--;
    }
   }
   if (sat == 255) {
    upOrDown = 1;
  }
  if (sat == 0) {
    upOrDown = 0;
  }
   finalCVal = map(sat, 0, 255, 160, 192);

   EVERY_N_MILLISECONDS( 20 ) { gHue++; } // slowly cycle the "base color" through the rainbow

  if (!started_interaction) {
      initialState();  
    }
  
  if (Serial.available()) {

    intFromSerial = Serial.read();
    if(intFromSerial == 0) {
        initialState();
     }

  }
   // put your main code here, to run repeatedly:
   // move this outside of serial.available to prevent delays
  if (intFromSerial == 1) {
   started_interaction = true;
   stageOneLights();
   stepRate = 50;
   int myDelay = random(1, 3);
   for (pos = 90; pos <= 110; pos+=1) {
      myServo.write(pos);
      delay(myDelay * 15);
   }
    for (pos = 110; pos >= 90; pos-=1) {
      myServo.write(pos);
      delay(myDelay * 15);
   }
  }
  
  if (intFromSerial == 2) {
    speedUp();
    int myDelay = random(1,5);
    if (myDelay > 3) {
      myServo.write(45);
   } else {
    for (pos = 80; pos <= 120; pos+=10) {
      myServo.write(pos);
      delay(myDelay*5);
   }
    for (pos = 120; pos >= 80; pos-=10) {
      myServo.write(pos);
      delay(myDelay*5);
   }
   }
  }
  if (intFromSerial == 3) {
    stepRate = 10;
    redRing();
    for (pos = 10; pos >= 0; pos-=1) {
      myServo.write(pos);
      delay(15);
   }
    for (pos = 0; pos >= 10; pos+=1) {
      myServo.write(pos);
      delay(15);
   }

  }
  Serial.println(intFromSerial);
    FastLED.show();
    myServo.write(pos);
    delay(15);
}


void initialState()
{
  // a colored dot sweeping back and forth, with fading trails
  fadeToBlackBy( leds, NUM_LEDS, 20);
  int ledPos = beatsin16( 13, 0, NUM_LEDS-1 );
  leds[ledPos] += CHSV( 0, 0, gHue);
  pos = 90;
}
  

void stageOneLights() {
  Serial.println(sat);
  fill_solid(leds, NUM_LEDS, CHSV(255, 0, sat));
}
void fadeall() { for(int i = 0; i < NUM_LEDS; i++) { leds[i] = CRGB::Black; } }

//need to pass this serial value from p5
//heavily adapted from FastLED cylon example
void speedUp() {
    for(int i = 0; i < NUM_LEDS; i++) {
    // Set the i'th led to red 
    leds[i] = CRGB::Red;
    // Show the leds
    FastLED.show(); 
    // now that we've shown the leds, reset the i'th led to black
    fadeall();
    // Wait a little bit before we loop around and do it again
    delay(16);
  }
  
}
 void redRing() {
  fadeToBlackBy( leds, NUM_LEDS, 10);
  int pos = random16(NUM_LEDS);
  leds[pos] += CHSV( 255, 200, 255);
 }

 
 void finalState() {
  stepRate = 5;
  fill_solid(leds, NUM_LEDS, CHSV(finalCVal, 255, map(sat, 0, 255, 155, 255)));
 }

 // Fire2012 by Mark Kriegsman, July 2012
// as part of "Five Elements" shown here: http://youtu.be/knWiGsmgycY
//// 
// This basic one-dimensional 'fire' simulation works roughly as follows:
// There's a underlying array of 'heat' cells, that model the temperature
// at each point along the line.  Every cycle through the simulation, 
// four steps are performed:
//  1) All cells cool down a little bit, losing heat to the air
//  2) The heat from each cell drifts 'up' and diffuses a little
//  3) Sometimes randomly new 'sparks' of heat are added at the bottom
//  4) The heat from each cell is rendered as a color into the leds array
//     The heat-to-color mapping uses a black-body radiation approximation.
//
// Temperature is in arbitrary units from 0 (cold black) to 255 (white hot).
//
// This simulation scales it self a bit depending on NUM_LEDS; it should look
// "OK" on anywhere from 20 to 100 LEDs without too much tweaking. 
//
// I recommend running this simulation at anywhere from 30-100 frames per second,
// meaning an interframe delay of about 10-35 milliseconds.
//
// Looks best on a high-density LED setup (60+ pixels/meter).
//
//
// There are two main parameters you can play with to control the look and
// feel of your fire: COOLING (used in step 1 above), and SPARKING (used
// in step 3 above).
//
// COOLING: How much does the air cool as it rises?
// Less cooling = taller flames.  More cooling = shorter flames.
// Default 55, suggested range 20-100 
#define COOLING  55

// SPARKING: What chance (out of 255) is there that a new spark will be lit?
// Higher chance = more roaring fire.  Lower chance = more flickery fire.
// Default 120, suggested range 50-200.
#define SPARKING 120


void Fire2012WithPalette()
{
// Array of temperature readings at each simulation cell
  static byte heat[NUM_LEDS];

  // Step 1.  Cool down every cell a little
    for( int i = 0; i < NUM_LEDS; i++) {
      heat[i] = qsub8( heat[i],  random8(0, ((COOLING * 10) / NUM_LEDS) + 2));
    }
  
    // Step 2.  Heat from each cell drifts 'up' and diffuses a little
    for( int k= NUM_LEDS - 1; k >= 2; k--) {
      heat[k] = (heat[k - 1] + heat[k - 2] + heat[k - 2] ) / 3;
    }
    
    // Step 3.  Randomly ignite new 'sparks' of heat near the bottom
    if( random8() < SPARKING ) {
      int y = random8(7);
      heat[y] = qadd8( heat[y], random8(160,255) );
    }

    // Step 4.  Map from heat cells to LED colors
    for( int j = 0; j < NUM_LEDS; j++) {
      // Scale the heat value from 0-255 down to 0-240
      // for best results with color palettes.
      byte colorindex = scale8( heat[j], 240);
      CRGB color = ColorFromPalette( gPal, colorindex);
      int pixelnumber;
      if( gReverseDirection ) {
        pixelnumber = (NUM_LEDS-1) - j;
      } else {
        pixelnumber = j;
      }
      leds[pixelnumber] = color;
    }
}
