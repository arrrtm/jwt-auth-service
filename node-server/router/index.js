const Router = require('express').Router
const userController = require('../controller/user-controller')
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')

const router = new Router()

router.post('/registration',
        body('email').isEmail(),
        body('password').isLength({min: 8, max: 32}),
        userController.registration
)

router.post('/login', 
        body('email').isEmail(),
        body('password').isLength({min: 8, max: 32}),
        userController.login
)

router.post('/logout', userController.logout)

router.get('/activate/:link', userController.activate)

router.get('/refresh', userController.refresh)

router.get('/users', 
        authMiddleware,
        userController.users
)

module.exports = router