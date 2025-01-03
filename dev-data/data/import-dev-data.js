const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

// dotenv.config({ path: './config.env' })
dotenv.config({ path: require('path').resolve(__dirname, '../../config.env') });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connection successful');
});

// Read JSON File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// Import Data into Database

const importData = async () => {
    try {
        await User.create(users, { validateBeforeSave: false });
        await Tour.create(tours);
        await Review.create(reviews, { validateBeforeSave: false });
        console.log('Data successfully loaded.')
        process.exit();
    } catch (error) {
        console.log(error)
    }
}

// Delete all data from DB

const deleteData = async () => {
    try {
        await User.deleteMany();
        await Tour.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully deleted.')
        process.exit();
    } catch (error) {
        console.log(error)
    }
}

if(process.argv[2] === '--import') {
    importData();
} else if(process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);