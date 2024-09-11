const mongoose = require('mongoose');

const ImageDetailSchema = new mongoose.Schema(
    {
        image: String
    },
    {
        collection: "ImageDetail",
    })

mongoose.model("ImageDetail", ImageDetailSchema);
