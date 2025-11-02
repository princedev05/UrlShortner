const express = require("express");
const {connectToMongoDB}  = require("./connect");

const urlRoute = require("./routes/url");
connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>{
    console.log('mongodb connected');
    
})

const app = express();
const PORT = 8001;
//routes connected
app.use("/url",urlRoute);

app.get('/test',async (req,res) => {
    const allUrls = await URL.find({});
    return res.render("home",{
        urls: allUrls,
        name:'Prince'
    });

});


// Routes
app.use("/url", urlRoute);
app.use('/',staticRoute);
app.use("/user",UserRoute);

app.get('/:shortID',async(req,res)=>{
  const shortID = req.params.shortID;
  const entry = await URL.findOneAndUpdate(
    { shortId: shortID },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );
  if (!entry || !entry.redirectURL) {
    return res.status(404).json({ error: "Short URL not found" });
  }
  return res.redirect(entry.redirectURL);
})

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));


