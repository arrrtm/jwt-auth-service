const userService = require('../service/user-service')
const ApiError = require('../exceptions/api-error')
const {validationResult} = require('express-validator')

class UserController {

    async registration(req, res, next) {
        try {
            if (!req.body || !req.body.password || !req.body.email)
                throw ApiError.BadRequestError('Email or Password is missing')

            const validationErrors = validationResult(req)
            if (!validationErrors.isEmpty()) {
                return next(ApiError.BadRequestError(
                    "Check the Email and Password for correctness", 
                    validationErrors.array()))
            }

            const {email, password} = req.body;
            const userData = await userService.registration(email, password)

            res.cookie( 'refreshToken', 
                        userData.refreshToken, 
                        {maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true}
                    )
            return res.json(userData)

        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            if (!req.body || !req.body.password || !req.body.email)
                throw ApiError.BadRequestError('Email or Password is missing')

            const validationErrors = validationResult(req)
            if (!validationErrors.isEmpty()) {
                return next(ApiError.BadRequestError(
                    "Check the Email and Password for correctness", 
                    validationErrors.array()))
            }

            const {email, password} = req.body;
            const userData = await userService.login(email, password)
            
            res.cookie( 'refreshToken', 
                        userData.refreshToken, 
                        {maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true}
                    )
            return res.json(userData)
            
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)

        } catch (error) {
            next(error)
        }
    }

    async activate(req, res, next) {
        try {
            const accessLink = req.params.link
            await userService.activation(accessLink)
            return res.redirect(process.env.CLIENT_URL)
            
        } catch (error) {
            next(error)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken)
            
            res.cookie( 'refreshToken', 
                        userData.refreshToken, 
                        {maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true}
                    )
            return res.json(userData)

        } catch (error) {
            next(error)
        }
    }

    async users(req, res, next) {
        try {
            return res.json(await userService.users())
            
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new UserController()