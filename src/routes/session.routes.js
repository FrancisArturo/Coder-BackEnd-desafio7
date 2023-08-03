import { Router } from "express";
import UserManager from "../dao/managers/dbManagers/user.manager.js";
import passport from "passport";
//import userModel from "../dao/models/user.models.js";
import {generateJWT} from "../utils/jwt.js";
import handlePolicies from "../middleware/handle-police.middleware.js";




export default class sessionRoutes {
    path = "/session";
    router = Router();
    userManager = new UserManager();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(`${this.path}/register`, async (req, res) => {
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
        );


        this.router.post(`${this.path}/login`, async (req, res) => {
            try {
                const userLogin = await this.userManager.loginUser(req.body);
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
                }).send({message: "Welcome: " + signUser.firstName + ", login success."});
                //return res.redirect("/views/home");
            } catch (error) {
                return res.status(400).json({ message: error.message});
            }
            
            
        }
        );
        this.router.post(`${this.path}/recover`, async (req, res) => {
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
        );
        this.router.get(`${this.path}/github`, passport.authenticate("github", { scope: ["user:email"] }));
        this.router.get(`${this.path}/github/callback`, passport.authenticate("github", { failureRedirect: "/api/v1/session/failedlogin" }),
            async (req, res) => {
                try {
                    return res.redirect("/views/home");
                } catch (error) {
                    return res.status(400).json({ message: error.message });
                }
            }
        );
        this.router.get(`${this.path}/current`,  handlePolicies(["public"]), async (req, res) =>{
            const user = req.user;
            return res.json({message: "Public access", user})
        } )
        this.router.get(`${this.path}/current/admin`,  handlePolicies(["admin"]), async (req, res) =>{
            const user = req.user;
            return res.json({message: "admin access", user})
        })
        this.router.get(`${this.path}/current/user`,  handlePolicies(["admin", "user"]), async (req, res) =>{
            const user = req.user;
            return res.json({message: "admin and user access", user})
        })
    }
}

