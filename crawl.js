/*
    * Tansaku Crawl
    * A very simple webcrawler that traverses the web given a seed URL
    * 2016 Gautam Mittal
*/

const cheerio = require('cheerio');
const fs = require('graceful-fs');
const loki = require('lokijs');
const natural = require('natural');
const read = require('node-readability');
const util = require(__dirname+'/util/util');
const uuid = require('node-uuid');

var count = 0;
var vectorIndex = {};
var storage = {};
var links = {};

var db = new loki(__dirname+'/data/index.json');
db.loadDatabase({}, function() {
  vectorIndex = db.getCollection('vocab') == null ? db.addCollection('vocab') : db.getCollection('vocab');
  storage = db.getCollection('index') == null ? db.addCollection('index') : db.getCollection('index');
  links = db.getCollection('links') == null ? db.addCollection('links') : db.getCollection('links');
  if (links.data.length == 0) {
    links.insert({l: "http://www.gautam.cc"});
    links.insert({l: "https://www.nytimes.com/"});
    links.insert({l: "https://www.nytimes.com/2017/02/16/opinion/the-man-who-let-india-out-of-the-closet.html"});
    links.insert({l: "https://news.ycombinator.com/"});
  }

  crawl();
});


// var tokenizer = new natural.WordTokenizer();
// natural.PorterStemmer.attach();


Array.prototype.unique = function() {
    return this.reduce(function(accum, current) {
        if (accum.indexOf(current) < 0) {
            accum.push(current);
        }
        return accum;
    }, []);
}




function crawl() {
    const url = links.data[0].l;

    read(url, function(err, article, meta) {
      if (typeof article == "undefined") {
        links.remove(links.get(links.data[0]['$loki']));

        if (links.data.length != 0) {
          crawl();
        }

        return;
      }

      count++;
      const $ = cheerio.load(article.html);

      console.log("["+(links.data.length).toString() +"] [v: "+ vectorIndex.data.length +"] " + url);

      var chunked = util.tokenize(article.title + ' ' + article.textBody);

      // All unique words
      var vocab = chunked.unique();
      // console.log(vocab);

      for (var j = 0; j < vocab.length; j++) {
        if (vectorIndex.find({w: { '$eq' : vocab[j] }}).length == 0) {
          vectorIndex.insert({w: vocab[j]});
        }
      }

      var v = [];
      for (var k = 0; k < vectorIndex.data.length; k++) {
          v.push(vectorIndex.data[k].w);
      }

      storage.insert({
        'title': article.title,
        'url': url,
        'data': util.vectorize(chunked, v)
      });


      // Finds all URLs the current page links to
      for (var i = 0; i < $("a")["length"]; i++) {
          const urls = util.rel_to_abs(url, $("a")[i.toString()].attribs.href);
          links.insert({l: urls});
      }

      links.remove(links.get(links.data[0]['$loki']));

      if (links.data.length != 0) {
        article.close();
        crawl();
      }

    });
}

process.on('SIGINT', function() {
    console.log("Saving.");

    db.saveDatabase(function() {
      console.log("Done.");
      process.exit();
    });
});
