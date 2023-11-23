import mongoose, { mongo } from "mongoose";
import Movie from "../models/movieModel.js";
import Screening from "../models/screeningModel.js";
import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";
import generatorService from "../service/generatorService.js.js";
import bcrypt from "bcrypt";
import { sendNewMember } from "../service/mailService.js";

 //GET REQUESTS
 export const getMovieByTitle = async (req, res) => {
  const param = req.params
  
  try {
    const collection = mongoose.connection.collection('movies');
    const movie = await collection.findOne({title: param.title});

    if (!movie) {
      return res.status(404).json({ error: 'Film kunde inte hittas, var god kontroller stavningen' });
    }

    res.json(movie);
  }catch(err) {
    console.log(err);
  }
}

export const getSalon = async (req, res) => {

  try{
    const collection = mongoose.connection.collection('seats');
    const salon = await collection.find({}).toArray();

    res.json(salon);
    
  }catch(err) {
    console.log(err);
  }
}

export const getScreeningByTitle = async(req, res) => {
  const param = req.params

  try {
    const moviesCollection = mongoose.connection.collection('movies');
    const screeningsCollection = mongoose.connection.collection('screenings');

    const movie = await moviesCollection.findOne({title: param.title});
    const screenings = await screeningsCollection.find({movieId: movie._id}).toArray([]);

    res.json(screenings);
  }catch(err){
    console.log(err)
  }
}

export const getBookingByQuery = async (req, res) => {
  const param = req.params;

  try {

    const bookingCollection = mongoose.connection.collection('bookings');
    const booking = await bookingCollection.findOne({bookingNumber: param.query});

    if(!booking) {
      res.status(404).send({ msg: "Bokningen hittades inte, var god kontrollera bokningsnumret"});
    }else {
      res.status(200).send({ status: 200, booking: booking});     
    }

  }catch(err) {
    console.log(err);
  }
}

export const getUserById = async (req, res) => {
  const param = req.params;

  try {

    const id = new mongoose.Types.ObjectId(param.id);
    
    const collection = mongoose.connection.collection('users');
    const user = await collection.findOne({_id: id});

    if(user) {
      res.status(200).send({status: 200, user: user});
    }else {
      res.status(404).send({msg: "Kunde inte hitta användaren"});
    }
  }catch(err) {
    console.log(err)
  }
}

export const getUserByEmail = async (req, res) => {
  const param = req.params;

  try {
    
    const collection = mongoose.connection.collection('users');
    const user = await collection.findOne({emailAdress: param.email});

    if(user) {
      res.status(200).send({status: 200, user: user});
    }else {
      res.status(404).send({msg: "Kunde inte hitta användaren"});
    }
  }catch(err) {
    console.log(err)
  }
}

//POST REQUESTS
export const addScreening = async (req, res) => {
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
      return res.status(403).send({ status: 403, msg: "En visning finns redan på den här salongen den här tiden"});
    }else {
      const newScreening = new Screening({
        movieId,
        salonId,
        startTime,
        endTime,
        bookings
      });
      
      await newScreening.save();
      res.status(200).send({ msg: `Ny visning tillagd`});  
    }
  }catch(err) {
    console.log(err)
  }
};

export const addMovie = async (req, res) => {
  try{

    let {
      title, productionCountries, productionYear, 
      length, genre, distributor, language, 
      subtitles, director, actors, description, 
      images, youtubeTrailers, age
    } = req.body;

    productionCountries = productionCountries.split(",");
    actors = actors.split(",");
    images = images.split(",");
    youtubeTrailers = youtubeTrailers.split(",");

    const newMovie = new Movie({
      title, 
      productionCountries, 
      productionYear, 
      
      length, 
      genre, 
      distributor, 
      language, 
      subtitles, 
      director, 
      actors, 
      description, 
      images, 
      youtubeTrailers,
      age
    })

    await newMovie.save();

    res.status(200).send({msg: `Ny film, ${newMovie.title} tillagd`});

  }catch(err) {
    console.log(err)
  }
};
export const addMember = async (req, res) => {
  try{
    let body = req.body;

    const generatedPassword = generatorService.generatePassword();

    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    body = ({ ...body, password: hashedPassword });
    body = ({ ...body, userRole: "USER" });
    body = ({ ...body, bookingHistory: [] });

    const { firstName, lastName, emailAdress, password, userRole, bookingHistory } = body;

    const collection = mongoose.connection.collection('users');
    const user = await collection.findOne({ emailAdress: emailAdress });

    if(user) return res.status(403).send({status: 403, msg: "Den här e-posten är redan i bruk, var god välj en annan"});

    const newUser = new User({
      firstName, 
      lastName, 
      emailAdress, 
      password, 
      userRole, 
      bookingHistory
    })

    await newUser.save()

    if(newUser) {
      res.status(200).send({status: 200, msg: "Ny användare skapad"});
      sendNewMember({emailAdress, generatedPassword});
    }
    else res.status(500).send({msg: "Något gick snett"});

  }catch(err) {
    console.log(err);
    res.send(err.message);
  }
}

//PATCH REQUESTS
export const editMovie = async (req, res) => {
  
  const body = req.body;

  try {
    const collection = mongoose.connection.collection('movies');
    const movie = await collection.findOne({title: body.title});

    if (!movie) {
      return res.status(404).json({ error: 'Filmen kunde inte hittas, kontrollera stavningen' });
    }

    delete body.title;

    const update = await collection.updateOne({ _id: movie._id },{$set: body});

    if(update)
    res.status(200).send({ msg: `Redigering av filmen ${movie.title} lyckades`});

  }catch(err) {
    console.log(err);
  }
}

export const editMember = async (req, res) => {
  
  const body = req.body;

  try {

    const id = new mongoose.Types.ObjectId(body._id);

    const collection = mongoose.connection.collection('users');
    const user = await collection.findOne({_id: id});

    if (!user) {
      return res.status(404).json({ error: 'Användaren kunde inte hittas, kontrollera stavningen' });
    }

    delete body._id; 
    delete body.password;
    delete body.bookingHistory;

    const result = await collection.updateOne({ _id: id },{$set: body});
    if(result.modifiedCount > 0) res.status(200).send({ status: 200, msg: `Redigering av medlem lyckades`});
    else res.status(500).send({status: 500, msg: "Något gick snett"});

  }catch(err) {
    console.log(err);
  }
}


//DELETE REQUESTS
export const deleteMovie = async (req, res) => {

  const param = req.params;

  try{
    const movieCollection = mongoose.connection.collection('movies');
    const screeningCollection = mongoose.connection.collection('screenings');

    const movie = await movieCollection.findOne({title: param.title})

    const screenings = await screeningCollection.find({movieId: movie._id}).toArray([])

    const bookingLength = screenings.map((screening) => screening.bookings.length > 0);

    if(bookingLength.includes(true)) {
      res.status(403).send({ msg: `Den här filmen finns med i ${bookingLength.filter(value => (value === true)).length} antal visningar som innehåller kund bokningar och kan därför inte tas bort.`})
    }else {
      const movie = await movieCollection.deleteOne({title: param.title});

      if(movie.deletedCount === 1) {
        res.status(200).send({status: 200, msg: `Borttagning av filmen ${param.title} lyckades`});
      }else {
        res.status(500).send({status: 500, msg: `Något gick snett` })
      }
    }
    
  }catch(err){
    console.log(err)
  }
}

export const deleteScreening = async (req, res) => {

  const param = req.params.id;

  try{

    const id = new mongoose.Types.ObjectId(param);

    const collection = mongoose.connection.collection('screenings');

    const findScreening = await collection.findOne({_id: id});

    if(findScreening.bookings.length === 0){
      const deleteScreening = await collection.deleteOne({_id: id});

      if(deleteScreening.deletedCount === 1) {
        res.status(200).send({ status: 200, msg: `Borttagning av visning ${param} lyckades`});
      }else {
        res.status(500).send({status: 500, msg: `Något gick snett` });
      }
    }else {
      res.status(403).send({ status: 403, msg: `Visning ${param} innehåller kundbokningar och kan därför inte tas bort` });
    }

  }catch(err){
    console.log(err);
  }
}

export const deleteUser = async (req, res) => {

  const param = req.params;

  try{
    const collection = mongoose.connection.collection('users');

    const id = new mongoose.Types.ObjectId(param.id);

    const user = await collection.deleteOne({_id: id});

    if(user.deletedCount === 1) {
      res.status(200).send({status: 200, msg: `Borttagning av användare ${param._id} lyckades`});
    }else {
      res.status(500).send({status: 500, msg: `Något gick snett` })
    }
  }catch(err){
    console.log(err)
  }
}

export const adminDeleteBooking = async (req, res) => {

  const param = req.params;

  try {
    let bookingId = new mongoose.Types.ObjectId(param?.id);

    const bookingCollection = mongoose.connection.collection('bookings');
    const booking = await bookingCollection.findOne({_id: bookingId});

    if(!booking) return res.status(400).send({ msg: "Ingen bokning hittades"});

    if(booking.bookedBy.user !== "GUEST") {

      const userCollection = mongoose.connection.collection('users');
      const user = await userCollection.findOne({bookingHistory: bookingId});

      if(!user) res.status(400).send({ msg: "Ingen användare hittades"});

      await User.updateOne({_id: user._id}, {$pull: {bookingHistory: bookingId}});
    }

    const updateBooking = await Booking.findByIdAndDelete(bookingId);

    if(updateBooking) res.status(200).send({status: 200, msg: "Bokningen avbokad."});
    else res.status(400).send({status: 400, msg: "Kunde inte avboka."});

  }catch(err) {
    res.status(500).send({msg: err});
  }  
}
