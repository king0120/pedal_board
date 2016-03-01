'use strict';

var app = require('../..');
import request from 'supertest';

var newPedal;

describe('Pedal API:', function() {

  describe('GET /api/pedals', function() {
    var pedals;

    beforeEach(function(done) {
      request(app)
        .get('/api/pedals')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          pedals = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      pedals.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/pedals', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/pedals')
        .send({
          name: 'New Pedal',
          info: 'This is the brand new pedal!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newPedal = res.body;
          done();
        });
    });

    it('should respond with the newly created pedal', function() {
      newPedal.name.should.equal('New Pedal');
      newPedal.info.should.equal('This is the brand new pedal!!!');
    });

  });

  describe('GET /api/pedals/:id', function() {
    var pedal;

    beforeEach(function(done) {
      request(app)
        .get('/api/pedals/' + newPedal._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          pedal = res.body;
          done();
        });
    });

    afterEach(function() {
      pedal = {};
    });

    it('should respond with the requested pedal', function() {
      pedal.name.should.equal('New Pedal');
      pedal.info.should.equal('This is the brand new pedal!!!');
    });

  });

  describe('PUT /api/pedals/:id', function() {
    var updatedPedal;

    beforeEach(function(done) {
      request(app)
        .put('/api/pedals/' + newPedal._id)
        .send({
          name: 'Updated Pedal',
          info: 'This is the updated pedal!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPedal = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPedal = {};
    });

    it('should respond with the updated pedal', function() {
      updatedPedal.name.should.equal('Updated Pedal');
      updatedPedal.info.should.equal('This is the updated pedal!!!');
    });

  });

  describe('DELETE /api/pedals/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/pedals/' + newPedal._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when pedal does not exist', function(done) {
      request(app)
        .delete('/api/pedals/' + newPedal._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
