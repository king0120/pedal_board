'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var PedalSchema = new mongoose.Schema({
  name: String,
  type: String,
  color: String,
  active: Boolean,
  knobs: Array
});

export default mongoose.model('Pedal', PedalSchema);
