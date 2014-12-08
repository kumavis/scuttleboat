var ScuttleBoat = require('./scuttleboat.js')
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


// Dynamically add sub-documents

aMeta = A.add('meta', 'Model')
aMeta.set('a',9)


// Subdocuments are created and synced

setTimeout(function(){

  console.log( B.get('meta').get('a') ) // => 9

}, 200)



