'use strict';

var AudioSynth = require('audiosynth');
var Leap = require('leapjs');

var AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext();
var synth = new AudioSynth(context);

synth.setOscWave(3); // Triangle Wave

// function(MIDINote, amplitude, filterOffset, currentTime)
synth.playNote(69, 1.0, 1.0, 0);

var fingers = [0, 1, 2, 3, 4];
var stretchedFingers0 = [0, 0, 0, 0, 0];
var stretchedFingers1 = stretchedFingers0.slice(0);
var prevNum = 0;
var currentNum = 0;

/* finger counter */
Leap.loop(function(frame){
  // One hand
  if (frame.hands[0] && !frame.hands[1]) {
    stretchedFingers0 = fingers.map(function(finger) {
      return frame.hands[0].fingers[finger].extended == false ? 0 : 1;
    });
    stretchedFingers1 = [0, 0, 0, 0];
  }

  // Two hands
  if (frame.hands[0] && frame.hands[1]) {
    stretchedFingers0 = fingers.map(function(finger) {
      return frame.hands[0].fingers[finger].extended == false ? 0 : 1;
    });
    stretchedFingers1 = fingers.map(function(finger) {
      return frame.hands[1].fingers[finger].extended == false ? 0 : 1;
    });
  }

  currentNum =
    stretchedFingers0.reduce(function(pv, cv) { return pv + cv; }, 0) +
    stretchedFingers1.reduce(function(pv, cv) { return pv + cv; }, 0);
  if (currentNum != prevNum) {
    prevNum = currentNum;
    synth.playNote(69 + 2* currentNum , 1.0, 1.0, 0);
  }
});
