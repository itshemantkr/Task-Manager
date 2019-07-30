require('../src/db/mongoose')
const Task = require('../src/models/task')

Task.findByIdAndDelete('5d2d8ab34e4c40316419d2b0').then((task) => {
    console.log(task)
    return Task.countDocuments({ completed : false })
}).then((result) => {
    console.log(result) 
}).catch((e) => {
    console.log(e)
})