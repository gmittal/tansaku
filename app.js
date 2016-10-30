/*
   * Tansaku
   * A search engine of sorts (written more as a proof of concept)
   * 2016 Gautam Mittal
*/

const nj = require('./numjs.min');

function vectorMagnitude(v) {
  v = nj.multiply(v, v);
  var magnitude = 0;
  for (var i = 0; i < v.shape[0]; i++)
    magnitude += v.get(i);
  return Math.sqrt(magnitude);
}

function cosineSimilarity(v, u) {
  return nj.dot(v, u).get(0) / (vectorMagnitude(v) * vectorMagnitude(u));
}

function search(query, docs) {
  for (var i = 0; i < docs.length; i++) {
    console.log(cosineSimilarity(query, docs[i]));
  }
}

search(nj.array([0, 1, 2, 2, 9, 5, 12]), [nj.array([0, -5, 2, 3, 4, 0, -12]), nj.array([0, 1, 2, 3, 4, 5, 16])]);
