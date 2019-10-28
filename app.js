import express from "express";
// import bodyParser from "body-parser";
import imageToSlices from "image-to-slices";

let app = express();
// app.use(bodyParser().json());

imageToSlices.configure({
  clipperOptions: {
    canvas: require("canvas")
  }
});

app.get("/", async (req, res) => {
  const resource = "./assets/img/bonobono_400x400.jpg";
  const lineXArray = [400 / 3, (400 / 3) * 2];
  const lineYArray = [400 / 3, (400 / 3) * 2];

  let imgBucket = [];

  let img = await imageToSlices(
    resource,
    lineXArray,
    lineYArray,
    {
      saveToDataUrl: true
    },
    dataUrlList => {
      dataUrlList.map(async data => {
        // imgBucket.push(`<img src="${data.dataURI}" />`);
        imgBucket.push(data.dataURI);
      });

      console.log("TCL: imgBucket", imgBucket);
      res.json(imgBucket);
      // res.send(imgBucket.join());
    }
  );
});

app.listen(8888, function() {
  console.log("Example app listening on port 8888!");
});
