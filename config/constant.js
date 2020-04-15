module.exports = {
    /* Validation related  constants starts */
    PASSWORD_NOT_FOUND: 'password can\'t be empty',
    USER_FIRSTNAME_NOT_FOUND: 'First name can\'t be empty',
    USER_NOT_FOUND: 'User not found',
    USER_LASTNAME_NOT_FOUND: 'Last name can\'t be empty',
    USERID_NOT_FOUND: 'User Id can\'t be empty',
    EMAIL_NOT_FOUND: 'Email can\'t be empty',
    INVALID_EMAIL_FOUND: 'Email is invalid',
    EMAIL_NOT_AVAILABLE: 'This email is taken',
    EMAIL_IS_AVAILABLE: 'This email is available',
    DUPLICATE_EMAIL_FOUND: 'User already exists with this Email',
    GENDER_NOT_FOUND: 'Gender can\'t be empty',
    PASSWORD_NOT_FOUND: 'Password can\'t be empty',
    WRONG_PASSWORD: 'The entered password is wrong',
    CONFIRM_PASSWORD_AND_PASSWORD_MISMATCH: 'Enter the same password',
    NAME_NOT_FOUND: 'Name can\'t be empty',
    MOBILE_NOT_FOUND: 'Mobile number can\'t be empty',
    ADDRESS_NOT_FOUND: `Address can't be empty`,

    DB_STAGING_URI: "mongodb+srv://sarvottam:staging_123@cluster0-rmgpa.mongodb.net/test?retryWrites=true&w=majority",
    DB_PRODUCTION_URI: "",
    DB_NAME: "easypillers_staging",

    ROLE_ADMIN: "admin",
    ROLE_INVESTOR: "investor",
    ROLE_PROPERTY_OWNER: "property_owner",

    USER_COLLECTION: "users",
    API_VERSION: "v1",
    JWT_PRIVATE_KEY: "07d21cd6421a039f8405730136ff57f77cc73b9a19961510f597d908ac923e7500b68244f91db77e9d5089b5d047b178c0411a7aafb54ceb44cdf40bb8678a7b",
    ADMIN_ROUTES: ["pendingKyc"],
    INVESTOR_ROUTES: ["update"],
    ROLE_PROPERTY_OWNER_ROUTES: ["update"],

    //Facebook Credentials 
    FACEBOOK_API_KEY: "18983234566822102019",
    FACEBOOK_API_SECRET: "b37fe78a2c9223458421cdc8ee61ccb1c3bc",

    //Recaptcha Secret Credentials
    RECAPTCHA_SECRET: "6LcHlNUUAAAA65434567ugbyAPrkxh35434rBV54je2WWwvHo2qseLjXz",
    RECAPTCHA_URL: 'https://www8765tytgy.google.com/recaptcha/api/siteverify?',

    //File Path
    FILE_PATH: '././public/uploads/',

    //Enum for Kyc Status
    KYC_STATUS_ADMIN:Object.freeze({
        0: 'Rejected',
        1: 'Approved',
    }),
    //Enum for Investor Type
    INVESTOR_TYPE:Object.freeze({
        0: 'US Citizen & accedited',
        1: 'US Citizen & not accedited',
        2:'not US Citizen'
    }),
    
    IMAGE_RESTRICTION:["govtphotoid"],
    EMAIL_USER:"sayma.r@rejolut.com",
    EMAIL_PASSWORD:"munis0202",
    FROM_MAIL:"noreply@minuteman.com",

    kafka_server: 'localhost:9867',
    
}
