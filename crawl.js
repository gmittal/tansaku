/*
    * Tansaku Crawl
    * A very simple webcrawler that traverses the web given a seed URL
    * 2016 Gautam Mittal
*/

const cheerio = require('cheerio');
const fs = require('graceful-fs');
const lemmer = require('lemmer');
const read = require('node-readability');
const sw = require('stopword');
const util = require(__dirname+'/util/util');
const uuid = require('node-uuid');

const seed = "http://gautam.cc/magical-mathematics-part-i";
const MAX_LINKS = 100;
var count = 0;
var links = [];
var seen = [];
var vectorIndex = [];
var storage = {};

// Update storage if crawling has happened in the past.
try {
  fs.accessSync(__dirname+'/index.json');
  storage = JSON.parse(fs.readFileSync(__dirname+'/index.json', 'utf-8'));
  links = storage.links.slice();
  vectorIndex = storage.vectorIndex.slice();
} catch (e) {
  fs.writeFileSync(__dirname+'/index.json', '{}', 'utf-8');
  links = [seed];
}

Array.prototype.unique = function() {
    return this.reduce(function(accum, current) {
        if (accum.indexOf(current) < 0) {
            accum.push(current);
        }
        return accum;
    }, []);
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

      chunked = sw.removeStopwords(chunked);
      lemmer.lemmatize(chunked, function (e, words) {
        if (e) throw e;
        chunked = words.slice();

        // All unique words without stopwords
        var vocab = sw.removeStopwords(chunked.unique());

        for (var j = 0; j < vocab.length; j++) {
          if (vectorIndex.indexOf(vocab[j])) {
            vectorIndex.push(vocab[j]);
          }
        }

        storage.vectorIndex = vectorIndex.slice();
        storage[uuid.v1()] = {
          'title': article.title,
          'url': url,
          'data': sw.removeStopwords(chunked)
        };

        // fs.writeFile(__dirname+"/index.json", JSON.stringify(storage));

        // Finds all URLs the current page links to
        for (var i = 0; i < $("a")["length"]; i++) {
            console.log(typeof url)
            const urls = util.rel_to_abs(url, $("a")[i.toString()].attribs.href);
            if (seen.indexOf(urls) == -1) {
                links.push(urls);
                seen.push(urls);
            }
        }

        links.shift();
        links = links.unique();
        if (links.length != 0) {
          article.close();
          crawl();
        }


      });

    });
}

process.on('SIGINT', function() {
    console.log("Saving.");

    var d = storage;
    d.links = links.slice();

    fs.writeFile(__dirname+'/index.json', JSON.stringify(storage), function (e) {
      console.log("Done.");
      process.exit();
    });
});


crawl();
