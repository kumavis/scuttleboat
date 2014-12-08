![sailboat upsidedown](https://cloud.githubusercontent.com/assets/1474978/4873103/2392582a-6202-11e4-9a42-4afc8b988648.png)

### Sail the high seas with ScuttleBoat

Like [Scuttlebucket](https://github.com/dominictarr/scuttlebucket), but allows for dynamically adding records later

```js
var ScuttleBoat = require('scuttleboat')
var Model = require('scuttlebutt/model')


// Define sub-document constructor types

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
```

### API

Add a sub-document to the boat.
The sub-document instance will be created automatically.
Provide:
* the key (string)
* the type from the list of constructors (string)
* an (optional) argument to instantiate the instance with.
Argument must be serializable.
Cannot provide more than one initialization argument.

```js
boat.add(key, type, opts)
```

Clone a scuttleboat instance
```js
boat.clone()
```

Listen for new subdocs
```js
boat.on('create', function(key, subdoc){ /* ... */ })
```
