import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
    },
    publicId: {
        type: String
    },
    isPreviewFree: {
        type: Boolean

    },
    views:{
        type:Number,
        default:0,
    },
    dropOff:{
        type:Number,
        default:0,
    },
    avgTime:{
        type:String,
        default:"0.00"
    },
  



},{timestamps:true});

export const Lecture=mongoose.model("Lecture",lectureSchema);