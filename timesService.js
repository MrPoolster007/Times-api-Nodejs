var http = require("http");
const https = require("https");
const url = "https://time.com/";

http
  .createServer(async function (req, resAPI) {
    if (req.url === "/getTimeStories" && req.method === "GET") {
      //response headers
      resAPI.writeHead(200, { "Content-Type": "application/json" });
      https.get(url, function (res) {
        res.on("data", (d) => {
          var linkReg =
            /<section class="homepage-module latest"(.*)\n((.+\n)+(.*)<\/section>)/g;
          var linksInText = d.toString().match(linkReg);
          if (linksInText != null) {
            var hrefRegex = /(<[Aa]\s(.*)<\/[Aa]>)/g;
            var hrefData = linksInText[0].match(hrefRegex);
            var resArr = [];
            hrefData.forEach((element) => {
              var a = element.split("/>");
              resArr.push({
                url: a[0].replace("<a href=/", ""),
                title: a[1].replace("</a>", ""),
              });
            });
            resAPI.write(JSON.stringify(resArr));
            resAPI.end();
          }
        });
      });
    }
  })
  .listen(8080);
