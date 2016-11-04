/*
    * Tansaku Crawl
    * A very simple webcrawler that traverses the web
    * 2016 Gautam Mittal
*/

const cheerio = require('cheerio');
const read = require('node-readability');
const seed = "http://gautam.cc/magical-mathematics-part-i";

Array.prototype.unique = function() {
    return this.reduce(function(accum, current) {
        if (accum.indexOf(current) < 0) {
            accum.push(current);
        }
        return accum;
    }, []);
}

/* Handles wacky URLs */
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

function crawl(url) {
  read(url, function(err, article, meta) {
    if (typeof article == "undefined") return;

    const $ = cheerio.load(article.html);
    var chunked = (article.title + ' ' + article.textBody)
    .toLowerCase()
    .replace(/\W/g, ' ')
    .split(" ")
    .filter(function(element) {
      return element !== "";
    });

    var vocab = chunked.unique();

    // console.log(chunked.length);
    // console.log(vocab.length);

    // Finds all URLs the current page links to
    for (var i = 0; i < $("a")["length"]; i++) {
        const urls = rel_to_abs(url, $("a")[i.toString()].attribs.href);
        crawl(urls);
    }

    article.close();
  });
}

crawl(seed);
