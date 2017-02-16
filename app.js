/*
   * Tansaku
   * A search engine of sorts (written more as a proof of concept)
   * 2016 Gautam Mittal
*/

const fs = require('graceful-fs');
const natural = require('natural');
const loki = require('lokijs');
const nj = require(__dirname+'/util/numjs.min');
const util = require(__dirname+'/util/util');

var db = new loki(__dirname+'/data/index.json');
var vectorIndex = {};
var storage = {};
var links = {};
var vc = [];
db.loadDatabase({}, function() {
  vectorIndex = db.getCollection('vocab') == null ? db.addCollection('vocab') : db.getCollection('vocab');
  storage = db.getCollection('index') == null ? db.addCollection('index') : db.getCollection('index');
  links = db.getCollection('links') == null ? db.addCollection('links') : db.getCollection('links');

  for (var k = 0; k < vectorIndex.data.length; k++) {
      vc.push(vectorIndex.data[k].w);
  }

  search(process.argv[2]);
});

function vectorMagnitude(v) {
  v = nj.multiply(v, v);
  var magnitude = 0;
  for (var i = 0; i < v.shape[0]; i++) { magnitude += v.get(i); }
  return Math.sqrt(magnitude);
}

function cosineSimilarity(v1, v2) {
  return nj.dot(v1, v2).get(0) / (vectorMagnitude(v1) * vectorMagnitude(v2));
}

function search(query) {
  query = util.tokenize(query);

  var queryVector = nj.array(util.vectorize(query, vc));

  var raw_ranks = [];
  var raw_results = [];
  var ranks = [];
  var results = [];

  storage.data.forEach(function (id) {
      var vector_diff = queryVector.shape[0] - id.data.length;
      var updated_id = id.data.slice();

      for (var i = 0; i < vector_diff; i++) {
        updated_id.push(0);
      }

      raw_ranks.push(cosineSimilarity(queryVector, nj.array(updated_id)));
      raw_results.push({"title": id.title, "url": id.url});
  });

  for (var i = 0; i < raw_ranks.length; i++) {
    if (raw_ranks[i] != 0 && !isNaN(raw_ranks[i])) {
      ranks.push(raw_ranks[i]);
      results.push(raw_results[i]);
    }
  }

  console.log(util.sortFromArray(ranks, results)[1]);

}

// If search query contains terms that is not in vectorIndex, cosineSimilarity will return NaN (e.g. "hello world")
