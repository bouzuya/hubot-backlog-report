{Robot, User, TextMessage} = require 'hubot'
assert = require 'power-assert'
path = require 'path'
sinon = require 'sinon'

describe 'hello', ->
  beforeEach (done) ->
    @sinon = sinon.sandbox.create()
    # for warning: possible EventEmitter memory leak detected.
    # process.on 'uncaughtException'
    @sinon.stub process, 'on', -> null
    @robot = new Robot(path.resolve(__dirname, '..'), 'shell', false, 'hubot')
    @robot.adapter.on 'connected', =>
      @robot.load path.resolve(__dirname, '../../src/scripts')
      done()
    @robot.run()

  afterEach (done) ->
    @robot.brain.on 'close', =>
      @sinon.restore()
      done()
    @robot.shutdown()

  describe 'listeners[0].regex', ->
    describe 'receive valid messages', ->
      it 'matches', ->
        tests = [
          message: '@hubot backlog-report project user'
          matches: ['@hubot backlog-report project user', 'project', 'user']
        ,
          message: '@hubot backlog-report project'
          matches: ['@hubot backlog-report project', 'project', undefined]
        ]
        tests.forEach ({ message, matches }) =>
          sender = new User 'bouzuya', room: 'hitoridokusho'
          cb = @sinon.spy()
          @robot.listeners[0].callback = cb
          @robot.adapter.receive new TextMessage(sender, message)
          assert cb.callCount is 1
          assert.deepEqual cb.firstCall.args[0].match.map((i) -> i), matches
          @sinon.restore()

    describe 'receive invalid messages', ->
      it 'does not match', ->
        tests = [
          message: '@hubot backlog-report'
        ]
        tests.forEach ({ message }) =>
          sender = new User 'bouzuya', room: 'hitoridokusho'
          cb = @sinon.spy()
          @robot.listeners[0].callback = cb
          @robot.adapter.receive new TextMessage(sender, message)
          assert cb.callCount is 0
          @sinon.restore()
