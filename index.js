var ScuttleBucket = require('scuttlebucket')
var CRDT = require('crdt')
var inherits    = require('util').inherits

module.exports = ScuttleBoat


inherits(ScuttleBoat, ScuttleBucket)

function ScuttleBoat(opts) {
  if (!(this instanceof ScuttleBoat)) return new ScuttleBoat(opts)
  this._initialize(opts || {})
}

var boat = ScuttleBoat.prototype
var bucket = ScuttleBucket.prototype

boat._add = bucket.add

boat._initialize = function(opts) {
  this._opts = opts
  this._constructors = opts.constructors || {}
  ScuttleBucket.call(this, opts)
  var manifest = this._manifest = new CRDT()
  this._add('__manifest__', manifest)
  manifest.on('create', this._create.bind(this))
}

boat._create = function(record) {
  var data = record.state
  var constructor = this._constructors[data.type]
  if (constructor) {
    this._add(data.key, constructor(data.opts))
  } else {
    throw new Error('UnknownTypeError - "'+data.type+'" was not a registered constructor')
  }
}

// Public Interface

boat.add = function(key, type, opts) {
  this._manifest.add({
    key: key,
    type: type,
    opts: opts,
  })
  return this.get(key)
}

/* from https://github.com/dominictarr/scuttlebutt/blob/8217ec7f96091838be3b56122d16176ba2b63fa6/index.js#L287-L313 */

//create another instance of this scuttlebutt,
//that is in sync and attached to this instance.
boat.clone = function () {
  var A = this
  var B = new (A.constructor)(A._opts)
  B.setId(A.id) //same id. think this will work...

  A._clones = (A._clones || 0) + 1

  var a = A.createStream({wrapper: 'raw'})
  var b = B.createStream({wrapper: 'raw'})

  //all updates must be sync, so make sure pause never happens.
  a.pause = b.pause = function noop(){}

  streamDone(b, function () {
    A._clones--
    emit.call(A, 'unclone', A._clones)
  })

  a.pipe(b).pipe(a)
  //resume both streams, so that the new instance is brought up to date immediately.
  a.resume()
  b.resume()

  return B
}

function streamDone(stream, listener) {

  function remove () {
    stream.removeListener('end',   onDone)
    stream.removeListener('error', onDone)
    stream.removeListener('close',   onDone)
  }
  function onDone (arg) {
    remove()
    listener.call(this, arg)
  }

  //this makes emitter.removeListener(event, listener) still work
  onDone.listener = listener

  stream.on('end',   onDone)
  stream.on('error', onDone)
  stream.on('close', onDone)
}