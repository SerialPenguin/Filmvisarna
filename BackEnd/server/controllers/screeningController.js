import mongoose from 'mongoose';

export const getAllScreenings = async (req, res) => {
  try {
    const screeningsCollection = mongoose.connection.collection('Screenings');
    const screenings = await screeningsCollection.aggregate([
      {
        $lookup: {
          from: 'Movies',
          localField: 'movieId',
          foreignField: '_id',
          as: 'movie'
        }
      },
      {
        $lookup: {
          from: 'Seats',
          localField: 'salonId',
          foreignField: '_id',
          as: 'salon'
        }
      },
      {
        $unwind: "$movie"
      },
      {
        $unwind: "$salon"
      }
    ]).toArray();

    for (let i = 0; i < screenings.length; i++) {
      const totalCapacity = screenings[i].salon.capacity;
      const bookedSeatsCount = screenings[i].bookedSeats.length;
      screenings[i].availableSeats = totalCapacity - bookedSeatsCount;
    }

    // Logging the desired information
    screenings.forEach(screening => {
      console.log('Movie title:', screening.movie.title);
      console.log('Salon name:', screening.salon.name);
      console.log('Available seats:', screening.availableSeats);
    });

    res.json(screenings);
  } catch (error) {
    console.error('Error fetching screenings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};