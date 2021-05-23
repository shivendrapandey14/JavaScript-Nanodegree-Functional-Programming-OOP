require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

// Use of immutable js Map
const { Map } = require('immutable')



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// Send information about the rover
app.post('/roverInfo', async (req, res) => {
    const roverNameCurr = req.body.roverName;
    const roverData = Map({
        curiosity: Map({
            about: "Curiosity is a car-sized rover designed to explore the Gale crater on Mars as part of NASA's Mars Science Laboratory (MSL) mission.",
            imageUrl: "./assets/images/curiosity.jpg"
        }),
        opportunity: Map({
            about: "Opportunity, also known as MER-B or MER-1, and nicknamed 'Oppy', is a robotic rover that was active on Mars from 2004 until the middle of 2018",
            imageUrl: "./assets/images/opportunity.jpg"
        }),
        spirit: Map({
            about: "Spirit, also known as MER-A or MER-2, is a robotic rover on Mars, active from 2004 to 2010. It was one of two rovers of NASA's Mars Exploration Rover Mission.",
            imageUrl: "./assets/images/spirit.jpg"
        }),
    
    });
    try {
        const NASA_ROVER_INFO_API_URL=`https://api.nasa.gov/mars-photos/api/v1/manifests/${req.body.roverName}?api_key=${process.env.API_KEY}`
        //console.log(NASA_ROVER_INFO_API_URL)
        let data = await fetch(NASA_ROVER_INFO_API_URL)
            .then(res => res.json())
        data.photo_manifest.imageUrl = roverData.getIn([req.body.roverName, 'imageUrl'])
        data.photo_manifest.about = roverData.getIn([req.body.roverName, 'about'])
        res.send(data.photo_manifest)
    
    } catch (err) {
        console.log('error:', err);
    }
})

// Fetch images from NASA API
app.post('/fetchImage', async (req, res) => {
    try {
        const NASA_API_URL=`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.body.roverName}/latest_photos?api_key=${process.env.API_KEY}`
        //console.log(NASA_API_URL)
        let data = await fetch(NASA_API_URL)
            .then(res => res.json())
        //send data
        res.send(data.latest_photos)

    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))