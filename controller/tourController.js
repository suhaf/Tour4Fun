
const Tour = require('./../model/tourModel');
const ApiFeatures = require('./../util/ApiFeatures');
const AppError = require('./../util/AppError');
const catchAsync = require('./../util/catchAsync')
const objectId = require('mongoose').Types.ObjectId;

//console.log(Tour);



aliasRoutes = (req, res, next) => {
    //console.log(req.path)
    const result = req.path.split('-')
    const input = result[1] * 1;
    console.log(Tour.length);
    if(Tour.length < input){
        req.query.limit = input;
        req.query.sort = '-ratings, -price'
        next();
    }
    else{
        res.json({ Error: 'Count is exceeding' })
        console.log('count is exceeding actual')
    }

}

createTour = catchAsync(async (req, res) => {

    const newTour = await Tour.create(req.body)
    res.status(200).json({
        message: 'tour created',
        tour: newTour
    })

}) 

getAlltours =  catchAsync (async (req, res) =>{
    let features = new ApiFeatures(Tour, req.query).filter().sort().limit().pagination()
    let tours = await features.query;
    res.json({
        Count: tours.length,
        status: 200,
        tours
    })
});

getTour = catchAsync(async (req, res,next) => {
    
    let tour = {}
    if((objectId.isValid(req.params.id))){
        tour = await Tour.findById(req.params.id)
    }else {
        tour = await Tour.find({ name: req.params.id })
    }


    
    

    //const tour = await Tour.findById(req.params.id)
   
     //const tour = await Tour.find({ name: lookFor })
    
    
    if(!tour){
        return next(new AppError(`tour with id ${req.params.id} not found`, 404)); 
    
    }

    res.json({
        count:tour.length,
        status: 200,
        data: tour
    });       
});

deleteTour = catchAsync(async(req, res) => {
    
    const tour = await Tour.findByIdAndDelete(req.params.id)
    if (!tour) {
         return next(new AppError(`tour with id ${req.params.id} not found`, 404));

    }
    res.json({
        status: 200,
        data: `deleted tour ${tour}`
        })
          
    });
   



updateTour = catchAsync  (async (req, res)=>{

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,
                {
                    runValidators: true,
                    new: true
                });
    if (!tour) {
        return next(new AppError(`tour with id ${req.params.id} not found`, 404));

    }
    res.json({
        status: 200,
        data: `the updated tour is below`,
        tour: tour
    });

});


getTourStats = catchAsync (async (req, res, next)=>{
    
        const stats = await Tour.aggregate([
            {
                $match: { rating: {$gte: 4} }
            },
            {
                $group: {
                   // _id: null, or 
                    _id: '$price', 
                    count: { $sum: 1 },
                    totalPrice: { $sum: '$price'},
                    avgRating: {$avg :'$rating'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'} 
                }
            }
        ]);
            res.json({
                status: 200,
                stats
            }); 
     
});

getMonthlyPlan = catchAsync (async (req, res, next) => {
    
        const year = req.params.year
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates',  
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group:{
                    _id:{$month:'$startDates'},
                    count: {$sum: 1},
                    names: {$push: '$name'}
                  
                }  
            },

            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {_id : 0}
            },

            {
                $sort: {count:-1}
            } 

        ]);

        res.json({
            Count : plan.length,
            status: 200,
            plan
        });
    
    
});

module.exports = {
    getAlltours,
    getTour,
    deleteTour,
    createTour,
    updateTour,
    aliasRoutes,
    getTourStats,
    getMonthlyPlan
   // checkId,
    //checkBody
}
