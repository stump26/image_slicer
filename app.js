import express from "express";
import bodyParser from "body-parser";
import imageToSlices from "image-to-slices";

let imgBucket = [];
let app = express();

app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
app.post("/parse/", async (req, res) => {
  console.log("=====================================");
  console.log("=====================================");
  //console.log("parser_req >>", req.body);
  const targetImage = await new Buffer(req.body, "base64");
  console.log("TCL: targetImage", targetImage);
  await init_image(targetImage);

  res.end();
});
app.get("/img/:id", async (req, res) => {
  const { id } = req.params;
  console.log("TCL: req.params.id", req.params.id);
  if (imgBucket.length === 0) {
    res.writeHead(500);
    res.end();
  }
  var targetImage = new Buffer(imgBucket[id].slice(23), "base64");
  console.log("TCL: targetImage", targetImage);
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": targetImage.length
  });
  res.end(targetImage);
});

init_image("./assets/img/bonofriend.jpg");

app.listen(8888, function() {
  console.log("Example app listening on port 8888!");
});
