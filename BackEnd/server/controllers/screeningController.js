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

    console.log("ST: ", startTime + " " + "ET: ", endTime);

    const newScreening = new Screening({
      movieId,
      salonId,
      startTime,
      endTime,
      bookings
    });

    console.log(newScreening);


    const screenings = await screeningsCollection.aggregate(
      [
         {
            $match:
               {
                  $expr:
                     {
                        $gt:
                           [ 
                              newScreening._id,
                              {
                                $dateAdd: {
                                  startDate: "$startTime",
                                  unit: "hour",
                                  amount: 1,
                                }
                              }
                           ]
                     }
               }
          },
          {
            $project: {
              startTime: {
                $dateAdd: {
                  startDate: "$startTime", unit: "hour", amount: 1
                }
              },
              endTime: {
                $dateAdd: {
                  startDate: "$endTime", unit: "hour", amount: 1
                }
              },
            }
          }
      ]
   ).toArray([])

    console.log("Screenings: ", screenings);
    console.log("SL: ", screenings.length)

    // await newScreening.save();
    // res.status(200).send({msg: `New screening added to database`});

  }catch(err) {
    console.log(err)
  }
};