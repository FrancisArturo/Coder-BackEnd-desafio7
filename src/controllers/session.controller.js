import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../config/config.js";
import UserManager from "../dao/managers/dbManagers/user.manager.js";
import {generateJWT} from "../utils/jwt.js";


export default class SessionController {
    userManager;
    constructor() {
        this.userManager = new UserManager(); 
    }

    createUserController = async (req, res) => {
        try {
            const newUser = await this.userManager.createUser(req.body);
            if (newUser === "User already exists") {
            return res.status(400).json({message: "User already exists"})
            }
            return res.send("User added successfully");
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    loginUserController = async (req, res) => {
        try {
            const userSubmitted = req.body
            if (userSubmitted.email == ADMIN_EMAIL && userSubmitted.password == ADMIN_PASSWORD) {
                const signUser = {
                    firstName: "adminCoder",
                    email: ADMIN_EMAIL,
                    role: "admin",
                };
                const token = generateJWT({...signUser});
                console.log(token)
                return res.cookie("cookieToken", token, {
                    maxAge:60*60*1000,
                    httpOnly: true
                }).redirect('/views/home');
            }
            const userLogin = await this.userManager.loginUser(userSubmitted);
            //console.log(req.body)
            if (userLogin === "User not found") {
                return res.status(401).json({message: "User not found"});
            }
            if (userLogin === "Incorrect password") {
                return res.status(401).json({message: "Incorrect password"});
            }
            const signUser = {
                user: userLogin._id,
                firstName: userLogin.firstName,
                lastName: userLogin.lastName,
                email: userLogin.email,
                role: userLogin.role,
            };
            const token = generateJWT({...signUser});
            console.log(token)
            return res.cookie("cookieToken", token, {
                maxAge:60*60*1000,
                httpOnly: true
            }).redirect('/views/home');
        } catch (error) {
            return res.status(400).json({ message: error.message});
        }
    }
    logoutUserController = (req, res) => {
        try {
            res.clearCookie("cookieToken");
            return res.redirect('/views/login');
        } catch (error) {
            return console.log(error);
        }
    }

    recoverPasswordController = async (req, res) => {
        try {
            const user = await this.userManager.recoverPassword(req.body);
            if (user === "User not found") {
                return res.render("recover", {error: "User not found"});
            }
            return res.redirect("/views/login");
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    currentPublicController = async (req, res) => {
        return res.json({message: "Public access"})
    }
    currentAdminController = async (req, res) => {
        const user = req.user;
        return res.json({message: "admin access", user})
    }
    currentUserController = async (req, res) => {
        const user = req.user;
        return res.json({message: "admin and user access", user})
    }

    githubLoginController  = async (req, res) => {
        try {
            const userLogin = req.user;
            const signUser = {
                user: userLogin._id,
                firstName: userLogin.firstName,
                lastName: userLogin.lastName,
                email: userLogin.email,
                role: userLogin.role,
            };
            const token = generateJWT({...signUser});
                console.log(token)
                return res.cookie("cookieToken", token, {
                    maxAge:60*60*1000,
                    httpOnly: true
                }).redirect('/views/home');
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}