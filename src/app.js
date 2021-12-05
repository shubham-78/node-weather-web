const express = require('express')
const path = require('path')
const app = express()
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
//define path for express confi
const publicDirectorPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')
//setup static directory
app.use(express.static(publicDirectorPath))

//setup handlebars engine
app.set('view engine', 'hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)
//if we change the views folder name to something else it will fail beacuse b deafualt it sets views folder
//so if we change then we have to add some extra line like this 
// const viewsPath = path.join(__dirname, '../templates/views')
// app.set('views',viewsPath)

app.get('',(req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Shubham'
    })
})

app.get('/help',(req,res) => {
    res.render('help',{
        title: 'Help',
        name: 'Shubham'
    })
})

app.get('/about',(req, res)=>{
    res.render('about',{
        title: 'About me',
        name: 'Shubham'
    })
})
app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error: 'You must provide address'
        })
    }
    geocode(req.query.address, (error, {latitude, logitude, location} = {}) => {
        if(error){
            return res.send({ error})
        }

        forecast(latitude, logitude, (error, forecastData) => {
            if(error){
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
    // res.send({
    //     forecast: "It is raining",
    //     location: "Indore",
    //     address: req.query.address
    // })
})

app.get('/help/*',(req,res)=>{
    res.render('404',{
        title:'404',
        name:'Shubham',
        errorMessage: "Help article not found"
    })
})
app.get('*',(req,res)=>{
    res.render('404',{
        title: "404",
        name: 'SHubham',
        errorMessage: "Page not found"
    })
})
app.listen(3000, () => {
    console.log("Server is running on port 3000")
})