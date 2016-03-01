'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var pedalCtrlStub = {
  index: 'pedalCtrl.index',
  show: 'pedalCtrl.show',
  create: 'pedalCtrl.create',
  update: 'pedalCtrl.update',
  destroy: 'pedalCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var pedalIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './pedal.controller': pedalCtrlStub
});

describe('Pedal API Router:', function() {

  it('should return an express router instance', function() {
    pedalIndex.should.equal(routerStub);
  });

  describe('GET /api/pedals', function() {

    it('should route to pedal.controller.index', function() {
      routerStub.get
        .withArgs('/', 'pedalCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/pedals/:id', function() {

    it('should route to pedal.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'pedalCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/pedals', function() {

    it('should route to pedal.controller.create', function() {
      routerStub.post
        .withArgs('/', 'pedalCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/pedals/:id', function() {

    it('should route to pedal.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'pedalCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/pedals/:id', function() {

    it('should route to pedal.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'pedalCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/pedals/:id', function() {

    it('should route to pedal.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'pedalCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
