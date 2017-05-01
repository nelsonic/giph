const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)
global.sinon = sinon
global.expect = chai.expect
