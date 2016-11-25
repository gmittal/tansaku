/*
   * Utilities for better abstraction
   * 2016 Gautam Mittal
*/

function index(array) {
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
}

module.exports = {
  vectorize: function (q, vectorIndex) {
    var indexJSON = {};
    for (var i = 0; i < index(q)[0].length; i++) {
      indexJSON[index(q)[0][i]] = index(q)[1][i];
    }

    var vector = [];
    for (var j = 0; j < vectorIndex.length; j++) {
      typeof indexJSON[vectorIndex[j]] != "undefined" ?
        vector.push(indexJSON[vectorIndex[j]]) :
        vector.push(0);
    }

    return vector;
  },
  rel_to_abs: function (base, url) {
    if(/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(url))
           return url;
      var base_url = base.match(/^(.+)\/?(?:#.+)?$/)[0]+"/";
      if(url.substring(0,2) == "//")
          return base.split("/")[0] + url;
      else if(url.charAt(0) == "/")
          return base.split("/")[0] + "//" + base.split("/")[2] + url;
      else if(url.substring(0,2) == "./")
          url = "." + url;
      else if(/^\s*$/.test(url))
          return "";
      else url = "../" + url;
      url = base_url + url;
      var i=0
      while(/\/\.\.\//.test(url = url.replace(/[^\/]+\/+\.\.\//g,"")));
      url = url.replace(/\.$/,"").replace(/\/\./g,"").replace(/"/g,"%22")
              .replace(/'/g,"%27").replace(/</g,"%3C").replace(/>/g,"%3E");
      return url;
  },
  sortFromArray: function (A, B) {
    var all = [];
    for (var i = 0; i < B.length; i++) {
        all.push({ 'A': A[i], 'B': B[i] });
    }

    all.sort(function(a, b) {
      return  b.A - a.A;
    });

    A = [];
    B = [];

    for (var i = 0; i < all.length; i++) {
       A.push(all[i].A);
       B.push(all[i].B);
    }

    return [A, B];
  }
}
