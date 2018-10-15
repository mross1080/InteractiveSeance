int ledPin = 3;      // select the pin for the LED
#include <Servo.h>
int pos = 0;    // variable to store the servo position
Servo myservo;  // create servo object to control a servo
#include <Adafruit_NeoPixel.h>
#define N_LEDS 11
Adafruit_NeoPixel strip = Adafruit_NeoPixel(N_LEDS, 12);

void setup() {
  strip.begin();
  strip.setPixelColor(1, 200, 10, 10);
  strip.show();
  // declare the ledPin as an OUTPUT:
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  myservo.attach(9);  // attaches the servo on pin 9 to the servo object
  // Move Servo To Confirm It's Connected
  for (pos = 0; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
    // in steps of 1 degree
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
  for (pos = 180; pos >= 0; pos -= 1) { // goes from 180 degrees to 0 degrees
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
}

void loop() {
  strip.begin();
  if (Serial.available()) {
    byte byteFromSerial = Serial.read();
    int intFromSerial = Serial.read();
    analogWrite(3, byteFromSerial);
    myservo.write(byteFromSerial);
    int led = map(byteFromSerial, 0, 255, 0, 11);
    strip.setPixelColor(led, 200, 10, 10);
    strip.show();

  }

}
