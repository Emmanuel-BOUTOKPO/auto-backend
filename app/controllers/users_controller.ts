import User from '#models/user'
import { signinValidator, signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
    signup = async ({request, response} : HttpContext) =>{
        const {fullName,email, password} = await request.validateUsing(signupValidator)
        await User.create({fullName,email,password})
        response.status(201).json({messages : 'Signup successfuly !'})
    }

    login = async ({request, response} : HttpContext) =>{
        const {email, password} = await request.validateUsing(signinValidator)
        const users = await User.verifyCredentials(email, password);
         
        response.json({users})
    }

}