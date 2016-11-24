/*
   * Utilities for better abstraction
   * 2016 Gautam Mittal
*/

module.exports = {
  index: function (array) {
    var a = [], b = [], prev;
    array.sort();
    for (var i = 0; i < array.length; i++) {
        if (array[i] !== prev) {
            a.push(array[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = array[i];
    }
    return [a, b];
  },
  vectorize: function(q, vectorIndex) {
    var indexJSON = {};
    for (var i = 0; i < util.index(d[id].data)[0].length; i++) {
      indexJSON[index(q)[0][i]] = index(q)[1][i];
    }

    var vector = [];
    for (var j = 0; j < vectorIndex.length; j++) {
      typeof indexJSON[vectorIndex[j]] != "undefined" ? vector.push(indexJSON[vectorIndex[j]]) :
      vector.push(0);
    }

    return vector;
  }
}
