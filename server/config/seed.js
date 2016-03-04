/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Pedal from '../api/pedal/pedal.model';

Thing.find({}).removeAsync()
  .then(() => {
    Thing.create({
      name: 'Development Tools',
      info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
             'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
             'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
             'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep ' +
             'tests alongside code. Automatic injection of scripts and ' +
             'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more ' +
             'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript ' +
             'payload, minifies your scripts/css/images, and rewrites asset ' +
             'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
             'and openshift subgenerators'
    });
  });

User.find({}).removeAsync()
  .then(() => {
    User.createAsync({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });

Pedal.find({}).removeAsync()
  .then(() => {
    Pedal.create({
      name: 'Overdrive',
      type: 'Distortion',
      color: 'yellow',
      active: false,
      knobs: [{
          name: 'level',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: "overdriveLevel"
      }, {
          name: 'drive',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: "overdriveDrive"
      }, {
          name: 'tone',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: "overdriveTone"
      }, {
          name: 'color',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: "overdriveColor"
      }]
    }, {
      name: 'Digital',
      type: 'Delay',
      color: 'beige',
      active: false,
      knobs: [{
          name: 'repeat',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: "delayLevel"
      }, {
          name: 'feedback',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: "delayFeedback"
      }, {
          name: 'time',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: "delayTime"
      }]
    },
    {
      name: 'COMING SOON',
      type: 'Filter',
      color: 'slategrey',
      active: false,
      knobs: [{
          name: 'sense',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: "delayLevel"
      }, {
          name: 'cutoff',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: "delayFeedback"
      }, {
          name: 'q',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: "delayTime"
      }]
    },
    {
      name: 'COMING SOON',
      type: 'Flanger',
      color: 'purple',
      active: false,
      knobs: [{
          name: 'manual',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: "delayLevel"
      }, {
          name: 'depth',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: "delayFeedback"
      }, {
          name: 'rate',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: "delayTime"
      }]
    });
  });
