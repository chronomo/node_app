const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const Activity = require('../models/Activity');

// show add page -> actually route is GET / activities/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('activities/add');
})

// process add form -> actually route is POST / activities/add
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Activity.create(req.body)
        res.redirect('/dashboard')
    } catch(err) {
        console.log(err);
        res.render('error/500');
    }
})

//show all activities - 
router.get('/', ensureAuth, async (req, res) => {
    try {
        const activities = await Activity.find({ status: 'open' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('activities/index', {
            activities
        })

    } catch(err) {
        console.log(err);
        res.render('error/500')
    }
})


// show 1 activity -> actually route is GET / activities/:id
router.get('/:id', ensureAuth, async(req, res) => {
    try {
        let activity = await Activity.findById(req.params.id)
        .populate('user')
        .lean()

        if(!activity) {
            return res.render('error/404')
        }

        res.render('activities/show', {
            activity
        })

    } catch(err) {
        console.error(err)
        res.render('error/404')
    }
    
})

// show edit page -> actually route is GET / activities/edit/:id
router.get('/edit/:id', ensureAuth, async(req, res) => {

    try {
        const activity = await Activity.findOne({_id: req.params.id }).lean()

        if(!activity) {
            return res.render('error/404')
        }

        if(activity.user != req.user.id) {
            res.redirect('/activites')
        } else {
            res.render('activities/edit', {
                activity
            })
        }

    } catch(err) {
        console.error(err)
        return res.render('error/500')
    } 
})

// update activity -> PUT request / activities/:id
router.put('/:id', ensureAuth, async (req, res) => {

    try{
        let activity = await Activity.findById(req.params.id).lean()

        if(!activity) {
            return res.render('error/404')
        }

        if(activity.user != req.user.id) {
            res.redirect('/activites')
        } else {
            activity = await Activity.findByIdAndUpdate({ _id: req.params.id}, req.body, {
                new: true,
                runValidators: true
            })

            res.redirect('/dashboard')
        }

    } catch(err) {
        console.error(err)
        return res.render('error/500')
    }
    
})

// delete activity -> actually route is GET / activities/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Activity.remove({ _id: req.params.id })
        res.redirect('/dashboard')

    } catch(err) {
        console.error(err)
        return res.render('error/500')
    }
})

// user activities -> actually route is GET / activities/user/:userId
router.get('/user/:userId', ensureAuth, async(req, res) => {
    try {
        const activities = await Activity.find({
            user: req.params.userId
        })
        .populate('user')
        .lean()

        res.render('activities/index', {
            activities
        })
    } catch(err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router;