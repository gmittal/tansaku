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
        d[id].data = util.vectorize(d[id].data, d.vectorIndex);
      }

    });

    fs.writeFile(__dirname+'/formatted.json', JSON.stringify(d));

  });
}

format();
