/*
   * Tansaku
   * A search engine of sorts (written more as a proof of concept)
   * 2016 Gautam Mittal
*/

const nj = require('./numjs.min'); // Scientific computing

function vector_magnitude(v) {
  v = nj.multiply(v, v);
  var magnitude = 0;
  for (var i = 0; i < v.shape[0]; i++)
    magnitude += v.get(i);
  return Math.sqrt(magnitude);
}

function cosine_similarity(v, u) {
  return nj.dot(v, u).get(0) / (vector_magnitude(v) * vector_magnitude(u));
}

function search(query, docs) {
  for (var i = 0; i < docs.length; i++) {
    console.log(cosine_similarity(query, docs[i]));
  }
}

search(nj.array([0, 1, 2, 3, 4, 5]), [nj.array([0, 1, 2, 3, 4, 0]), nj.array([0, 1, 2, 3, 4, 5])]);
