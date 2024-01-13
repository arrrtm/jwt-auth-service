const userModel = require('../model/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dto/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {

    async registration(email, password) {
        const candidate = await userModel.findOne({email})
        if (candidate) throw ApiError.BadRequestError(`User with email ${email} already exists`)

        const hashPassword = await bcrypt.hash(password, 3)
        const accessLink = uuid.v4()
        const user = await userModel.create({email, password: hashPassword, accessLink})

        // The activation email function is now disabled to simplify testing APIs
        
        // await mailService.sendActivationMail(
        //     email, 
        //     `${process.env.API_URL}/api/v1/activate/${accessLink}`
        // )

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        
        return {
            ...tokens,
            userDto
        }
    }

    async login(email, password) {
        const user = await userModel.findOne({email})
        if (!user) throw ApiError.BadRequestError(`User with email ${email} not found`)

        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) throw ApiError.BadRequestError(`User data is not correct`)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        
        return {
            ...tokens,
            userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async activation(accessLink) {
        const user = await userModel.findOne({accessLink})
        if (!user) throw ApiError.BadRequestError('Access link is not correct')

        user.isActivated = true;
        await user.save()
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError()
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError()
        const user = await userModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        
        return {
            ...tokens,
            userDto
        }
    }

    async users() {
        const users = await userModel.find()
        return users
    }

}

module.exports = new UserService()