/*
    * Tansaku Crawl
    * A very simple webcrawler that traverses the web
    * 2016 Gautam Mittal
*/

const cheerio = require('cheerio');
const read = require('node-readability');
const seed = "http://gautam.cc/magical-mathematics-part-i";
var links = [seed];

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

      const $ = cheerio.load(article.html);

      console.log("["+(links.length).toString() +"] " + url);

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

      // Finds all URLs the current page links to
      for (var i = 0; i < $("a")["length"]; i++) {
          const urls = rel_to_abs(url, $("a")[i.toString()].attribs.href);
          links.push(urls);
      }

      links.shift();
      if (links.length != 0) {
        crawl();
      }

      article.close();
    });
}

crawl();
