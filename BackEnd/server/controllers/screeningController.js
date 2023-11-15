import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import Screening from "../models/screeningModel.js";

export const getAllScreenings = async (req, res) => {
  try {
    const screeningsCollection = mongoose.connection.collection("screenings");
    const screenings = await screeningsCollection
      .aggregate([
        {
          $lookup: {
            from: "movies",
            localField: "movieId",
            foreignField: "_id",
            as: "movie",
          },
        },
        {
          $lookup: {
            from: "seats",
            localField: "salonId",
            foreignField: "_id",
            as: "salon",
          },
        },
        {
          $unwind: "$movie",
        },
        {
          $unwind: "$salon",
        },
      ])
      .toArray();

    for (let i = 0; i < screenings.length; i++) {
      const totalCapacity = screenings[i].salon.capacity;
      // Find the number of bookings for this screening.
      const bookedSeatsCount = await Booking.find({
        screeningId: screenings[i]._id,
      }).countDocuments();
      
      screenings[i].availableSeats = totalCapacity - bookedSeatsCount;
    }

    res.json(screenings);
  } catch (error) {
    console.error("Error fetching screenings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const addScreenings = async (req, res) => {
  try{
    const screeningsCollection = mongoose.connection.collection("screenings");

    let body = req.body; 

    body = ({ ...body, bookings: []});

    let { movieId, salonId, startTime, endTime, bookings } = body;

    const newTime = new Date(startTime);

    const findScreenings = await screeningsCollection.find({
      salonId: { $eq: new mongoose.Types.ObjectId(salonId)},
      startTime: newTime
    }).toArray([]);

    if(findScreenings.length > 0) {
      return res.status(403).send({ status: 403, msg: "Screening already exist in this salon at this time"});
    }else {
      const newScreening = new Screening({
        movieId,
        salonId,
        startTime,
        endTime,
        bookings
      });
      
      await newScreening.save();
      res.status(200).send({ msg: `New screening added to database`});  
    }
  }catch(err) {
    console.log(err)
  }
};

export const deleteScreening = async (req, res) => {

  const param = req.params.id;

  console.log("Para: ", param)

  try{

    const id = new mongoose.Types.ObjectId(param);

    const collection = mongoose.connection.collection('screenings');

    const findScreening = await collection.findOne({_id: id});

    if(findScreening.bookings.length === 0){
      const deleteScreening = await collection.deleteOne({_id: id});

      if(deleteScreening.deletedCount === 1) {
        res.status(200).send({ msg: `Screening ${param} deleted succesfully`});
      }else {
        res.status(500).send({ msg: `Something went wrong` });
      }
    }else {
      res.status(403).send({ msg: `Screening ${param} contains customer bookings and therefore can't be deleted` });
    }

  }catch(err){
    console.log(err);
  }
} 