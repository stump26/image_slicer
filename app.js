import express from "express";
import imageToSlices from "image-to-slices";

let imgBucket = [];
let app = express();

imageToSlices.configure({
  clipperOptions: {
    canvas: require("canvas")
  }
});

const init_image = async resource => {
  const lineXArray = [400 / 3, (400 / 3) * 2];
  const lineYArray = [400 / 3, (400 / 3) * 2];

  let img = await imageToSlices(
    resource,
    lineXArray,
    lineYArray,
    {
      saveToDataUrl: true
    },
    dataUrlList => {
      dataUrlList.map(async (data, index) => {
        // imgBucket.push(`<img src="${data.dataURI}" />`);
        imgBucket[index] = data.dataURI;
      });
    }
  );
};

let tempImage;
app.post("/parse/", async (req, res) => {
  console.log("=====================================");
  console.log("=====================================");
  //console.log("parser_req >>", req.body);
  tempImage = await new Buffer(req.body, "base64");
  console.log("TCL: targetImage", tempImage);
  // await init_image(tempImage);

  res.end();
});

app.get("/img/:id", async (req, res) => {
  const { id } = req.params;
  console.log("TCL: req.params.id", req.params.id);
  if (imgBucket.length === 0) {
    res.writeHead(500);
    res.end();
  }
  var targetImage = new Buffer(imgBucket[id - 1].slice(23), "base64");
  console.log("TCL: targetImage", targetImage);
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": targetImage.length
  });
  res.end(targetImage);
});

app.get("/", async (req, res) => {
  const id = Math.floor(Math.random() * 5 + 1);

  init_image(`./assets/img/bonobono${id}.jpg`);
  res.end();
  // const picImg = require(`./assets/img/bonobono${id}.jpg`);
  // res.send(`
  // <img src=${picImg}/>
  // `);
});
init_image("./assets/img/bonofriend.jpg");

app.listen(8888, function() {
  console.log("Example app listening on port 8888!");
});
