export const createUserValidationSchema = {
    username: {
        isLength:{
            options:{
                min:5,
                max:32,
            },
            errorMessage:"Username must be at least 5 carachters"
        },
        notEmpty:{
            errorMessage:"Username is required",
        },
        isString:{
            errorMessage:"Username must be a string",
        }
    },
    name:{
        notEmpty:{
            errorMessage:"Name is required"
        },
        isString:true,
    }
}