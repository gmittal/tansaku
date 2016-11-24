/*
    * Tansaku Crawl Data Formatter
    * Formats the data ccumulated in the crawl into a vector readable format suitable for search
    * 2016 Gautam Mittal
*/

const fs = require('graceful-fs');
const util = require(__dirname+'/util/util');

function format() {
  fs.readFile(__dirname+'/index.json', 'utf-8', function (err, data) {
    var d = JSON.parse(data);
    Object.keys(d).forEach(function (id) {
      if (id != "vectorIndex" && id != "links") {
        console.log(d[id].url);
        var indexJSON = {};
        for (var i = 0; i < util.index(d[id].data)[0].length; i++) {
          indexJSON[util.index(d[id].data)[0][i]] = util.index(d[id].data)[1][i];
        }

        var vector = [];
        for (var j = 0; j < d.vectorIndex.length; j++) {
          typeof indexJSON[d.vectorIndex[j]] != "undefined" ? vector.push(indexJSON[d.vectorIndex[j]]) :
          vector.push(0);
        }

        d[id].data = vector;
      }

    });

    fs.writeFile(__dirname+'/formatted.json', JSON.stringify(d));

  });
}

format();
