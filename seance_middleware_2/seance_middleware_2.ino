#include <FastLED.h>
#include <Servo.h>
Servo myServo; // create servo object to control a servo
// all credit to Mark Kriegman and FastLED
FASTLED_USING_NAMESPACE

#if defined(FASTLED_VERSION) && (FASTLED_VERSION < 3001000)
#warning "Requires FastLED 3.1 or later; check github for latest code."
#endif

#define DATA_PIN    3
#define SERVO_PIN   5
#define LED_TYPE    WS2811
#define COLOR_ORDER GRB
#define NUM_LEDS    50
uint8_t stepRate = 100;
uint8_t sat = 0;
int upOrDown = 0;
byte intFromSerial; //define empty byte for state setting later
CRGB leds[NUM_LEDS];
boolean started_interaction = false;
int pos = 60;
#define BRIGHTNESS          96
// is this useful? #define FRAMES_PER_SECOND  120
uint8_t gHue = 0; // rotating "base color" used by many of the patterns

void setup() {
  Serial.begin(9600);
  myServo.attach(SERVO_PIN);
  myServo.write(pos);
  delay(3000);
  // put your setup code here, to run once:
  // delay(3000); // 3 second delay for recovery
  
  // tell FastLED about the LED strip configuration
  FastLED.addLeds<LED_TYPE,DATA_PIN,COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  //FastLED.addLeds<LED_TYPE,DATA_PIN,CLK_PIN,COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);

  // set master brightness control
  FastLED.setBrightness(BRIGHTNESS);

}

void loop() {
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
   stepRate = 100;
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
