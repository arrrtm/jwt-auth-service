module.exports = class UserDto {
    email
    id
    isActivated
    accessLink

    constructor(model) {
        this.email = model.email
        this.id = model._id
        this.isActivated = model.isActivated
        this.accessLink = model.accessLink
    }

}