/*
    * Tansaku Crawl
    * A very simple webcrawler that traverses the web given a seed URL
    * 2016 Gautam Mittal
*/

const cheerio = require('cheerio');
const fs = require('graceful-fs');
const read = require('node-readability');
const uuid = require('node-uuid');

const seed = "http://gautam.cc/magical-mathematics-part-i";
const MAX_LINKS = 100;
var count = 0;
var links = [seed];
var prev = [];
var vectorIndex = [];
var storage = {};

Array.prototype.unique = function() {
    return this.reduce(function(accum, current) {
        if (accum.indexOf(current) < 0) {
            accum.push(current);
        }
        return accum;
    }, []);
}

/* Handles wacky relative URLs */
function rel_to_abs(base, url){
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
}

function crawl() {
    const url = links[0];
    read(url, function(err, article, meta) {
      if (typeof article == "undefined") {
        links.shift();
        if (links.length != 0) {
          crawl();
          return;
        }
      }

      count++;
      const $ = cheerio.load(article.html);

      console.log("["+(links.length).toString() +"] [v: "+ (vectorIndex.length).toString() +"] " + url);

      // All words
      var chunked = (article.title + ' ' + article.textBody)
      .toLowerCase()
      .replace(/\W/g, ' ')
      .split(" ")
      .filter(function(element) {
        return element !== "";
      });

      // All unique words
      var vocab = chunked.unique();

      for (var j = 0; j < vocab.length; j++) {
        if (vectorIndex.indexOf(vocab[j])) {
          vectorIndex.push(vocab[j]);
        }
      }

      storage.vectorIndex = vectorIndex.slice();
      storage[uuid.v1()] = {
        'title': article.title,
        'url': url,
        'data': chunked
      };

      // fs.writeFile(__dirname+"/index.json", JSON.stringify(storage));

      // Finds all URLs the current page links to
      for (var i = 0; i < $("a")["length"]; i++) {
          const urls = rel_to_abs(url, $("a")[i.toString()].attribs.href);
          if (prev.indexOf(urls) == -1) {
              links.push(urls);
              prev.push(urls);
          }
      }

      links.shift();
      links = links.unique();
      if (links.length != 0) {
        article.close();
        crawl();
      }


    });
}

function index(arr) {
    var a = [], b = [], prev;
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }
    return [a, b];
}

process.on('SIGINT', function() {
    console.log("Reformatting.");

    var d = storage;

    // Object.keys(d).forEach(function (id) {
    //   if (id !== "vectorIndex") {
    //     var indexJSON = {};
    //     for (var i = 0; i < index(d[id].data)[0].length; i++) {
    //       indexJSON[index(d[id].data)[0][i]] = index(d[id].data)[1][i];
    //     }
    //
    //     var vector = [];
    //     for (var j = 0; j < d.vectorIndex.length; j++) {
    //       typeof indexJSON[d.vectorIndex[j]] != "undefined" ? vector.push(indexJSON[d.vectorIndex[j]]) :
    //       vector.push(0);
    //     }
    //
    //     d[id].data = vector;
    //   }
    //
    // });

    fs.writeFile(__dirname+'/index.json', JSON.stringify(d), function (e) {
      console.log("Done.");
      process.exit();
    });
});



crawl();
