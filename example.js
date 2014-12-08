var ScuttleBoat = require('./index.js')
var Model = require('scuttlebutt/model')

// Define sub-document constructors

opts = {
  constructors: {
    Model: Model,
  },
}


// Setup ScuttleBoats

A = new ScuttleBoat(opts)
B = new ScuttleBoat(opts)

var as = A.createStream()
var bs = B.createStream()

as.pipe(bs).pipe(as)


// Debuggery

A.on('create', function(key, subdoc){ console.log('A saw new sub-doc:', key) })
B.on('create', function(key, subdoc){ console.log('B saw new sub-doc:', key) })


// Dynamically add sub-documents

aMeta = A.add('meta', 'Model')
aMeta.set('a',9)


// Subdocuments are created and synced

setTimeout(function(){

  console.log( B.get('meta').get('a') ) // => 9

}, 200)



