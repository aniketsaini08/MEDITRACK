import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {User} from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js";
import cloudinary from "cloudinary";


export const patientRegister = catchAsyncErrors(
    async(req,res,next)=> {
        const {firstName,lastName,email,phone,password,gender ,dob,nic,role} = req.body;
    // if(!firstName ||
    //    ! lastName ||
    //    ! email ||
    //    ! phone ||
    //    ! password ||
    //    ! gender  ||
    //    ! dob ||
    //    ! nic ||
    //    ! role){
    //     return next(new ErrorHandler("Please Fill full form",400));
    //    }

       let user= await User.findOne({email});
       if(user){
        return next(new ErrorHandler("Email already exist",400));
       }

       user= await User.create({
        firstName,lastName,email,phone,password,gender ,dob,nic,role
       });
       generateToken(user,"user registered!",200,res);
       

    
    }
);




export const login= catchAsyncErrors(async(req,res,next)=> {
    const {email,password,confirmPassword,role}=req.body;
    if(!email ||! password ||!confirmPassword ||!role){
        return next(new ErrorHandler("Please provide all details",400));
    }
    if(password!==confirmPassword){
        return next(new ErrorHandler("Password do not match",400));

    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid password or email",));
    }

    const isPasswordMatched= await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid password or email",400));
    }
    if(role!==user.role){
        return next(new ErrorHandler("User with this role not found",400));
    }

    generateToken(user,"User logged in succesfully",200,res);

});


export const addNewAdmin= catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,phone,password,gender ,dob,nic} = req.body;
    if(!firstName ||
        ! lastName ||
        ! email ||
        ! phone ||
        ! password ||
        ! gender  ||
        ! dob ||
        ! nic ){
         return next(new ErrorHandler("Please Fill full form",400));
        }
        const isRegistered= await User.findOne({email});
        if(isRegistered){
            return next(new ErrorHandler(`${isRegistered.role} with this mail exists`,400));
        }

        const admin=await User.create({firstName,lastName,email,phone,password,gender ,dob,nic,role:"Admin"});
        res.status(200).json(
        {success:true,
        message :"new admin registered" }
        )

})


export const getAllDoctors = catchAsyncErrors(async(req,res,next)=>{
    const doctors = await User.find({role:"Doctor"});
    res.status(200).json(
        {success:true,
        doctors,
        }
    );
});


export const getUserDetails =catchAsyncErrors(async(req,res,next)=>{
    const user= req.user;
    res.status(200).json({
        success:true,
        user,
    });
    


});




export const logoutAdmin= catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("adminToken", "",{
        httpOnly:true,
        expires:new Date(Date.now() + 0),
    })
    .json({success:true,
        message :"User log out success",
    });
})


export const logoutPatient= catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("patientToken", "",{
        httpOnly:true,
        expires:new Date(Date.now() + 0),
    })
    .json({success:true,
        message :"User log out success",
    });
})



export const addNewDoctor=catchAsyncErrors(async(req,res,next)=>{
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Doctor Avatar required",400));
    }
    const {docAvatar}=req.files;

    const allowedFormats=["image/png","image/jpg","image/webp","image/jpeg"];


    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("File format not supported",400))
    }
    const{firstName,lastName,email,phone,password,gender ,dob,nic,doctorDepartment}=req.body;
    if(!firstName ||
        ! lastName ||
        ! email ||
        ! phone ||
        ! password ||
        ! gender  ||
        ! dob ||
        ! nic ||
        ! doctorDepartment){
            return next(new ErrorHandler("please provide full details",400));
        }

        const isRegistered=await User.findOne({email});
        if(isRegistered){
            return next(new ErrorHandler(`${isRegistered.role} already registered with this email`,400));
        }

        const cloudinaryResponse= await cloudinary.uploader.upload(docAvatar.tempFilePath);
        if(!cloudinaryResponse||cloudinaryResponse.error){
           
           console.error ("cloudinary error:",
            cloudinaryResponse.error || "unknown Cloudinary Error"
        );
    }

    const doctor=await User.create({
        firstName,lastName,email,phone,password,gender ,dob,nic,role:"Doctor",docAvatar:{
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    })

    res.status(200).json({
        success: true,
        message: "New doctor registered",
        doctor
    })



})