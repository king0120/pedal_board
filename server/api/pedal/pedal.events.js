/**
 * Pedal model events
 */

'use strict';

import {EventEmitter} from 'events';
var Pedal = require('./pedal.model');
var PedalEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PedalEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Pedal.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PedalEvents.emit(event + ':' + doc._id, doc);
    PedalEvents.emit(event, doc);
  }
}

export default PedalEvents;
