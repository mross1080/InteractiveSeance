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
//#define CLK_PIN   4
#define LED_TYPE    NEOPIXEL
#define COLOR_ORDER GRB
#define NUM_LEDS    60
uint8_t sat = 0;
int upOrDown = 0;
CRGB leds[NUM_LEDS];

#define BRIGHTNESS          96
// is this useful? #define FRAMES_PER_SECOND  120

void setup() {
  Serial.begin(9600);
  myServo.attach(SERVO_PIN);
  // put your setup code here, to run once:
  // delay(3000); // 3 second delay for recovery
  
  // tell FastLED about the LED strip configuration
  FastLED.addLeds<LED_TYPE,DATA_PIN,COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  //FastLED.addLeds<LED_TYPE,DATA_PIN,CLK_PIN,COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);

  // set master brightness control
  FastLED.setBrightness(BRIGHTNESS);

}

void loop() {
    EVERY_N_MILLISECONDS(100) {
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
  if (Serial.available()) {

    byte intFromSerial = Serial.read();
    if(intFromSerial == 12) {
        digitalWrite(12, HIGH);
     }

    
  // put your main code here, to run repeatedly:
  if (intFromSerial == 1) {
   initialState();
   myServo.write(60);
   delay(15);
  }
  
  if (intFromSerial == 2) {
    speedUp();
    myServo.write(120);
    delay(15);
  }
  if (intFromSerial == 3) {
    redRing();
    myServo.write(180);
    delay(15);
  }
  }
}

void initialState() {
  fill_solid(leds, NUM_LEDS, CHSV(255, 0, sat));
  FastLED.show();
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
    fill_solid(leds, NUM_LEDS, CHSV(255, 255, sat));
    FastLED.show();
 }
