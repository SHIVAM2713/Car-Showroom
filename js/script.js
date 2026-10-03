"use strict";

/* ==========================================================
PREMIUM MOTORS
STEP 5 — AUTHENTICATION SYSTEM
========================================================== */

/* ==========================================================
STORAGE KEYS
========================================================== */

const STORAGE_KEYS = {

 
USER: "premiumMotorsUser",

SESSION: "premiumMotorsSession",

REMEMBER: "premiumMotorsRemember"
 

};

/* =====================================================
   PASSWORD VISIBILITY TOGGLE
   ===================================================== */

const passwordToggle = document.getElementById("passwordToggle");
const loginPassword = document.getElementById("loginPassword");
const passwordToggleIcon = document.getElementById("passwordToggleIcon");

if (
    passwordToggle &&
    loginPassword &&
    passwordToggleIcon
) {

    passwordToggle.addEventListener("click", function () {

        const isPassword =
            loginPassword.type === "password";

        if (isPassword) {

            loginPassword.type = "text";

            passwordToggleIcon.classList.remove(
                "bi-eye"
            );

            passwordToggleIcon.classList.add(
                "bi-eye-slash"
            );

            passwordToggle.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            loginPassword.type = "password";

            passwordToggleIcon.classList.remove(
                "bi-eye-slash"
            );

            passwordToggleIcon.classList.add(
                "bi-eye"
            );

            passwordToggle.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    });

}


/* =====================================================
   REMEMBER ME
   ===================================================== */

const rememberMe = document.getElementById("rememberMe");

if (rememberMe) {

    /* Restore previous preference */

    const savedRemember =
        localStorage.getItem("premiumRememberMe");

    if (savedRemember === "true") {
        rememberMe.checked = true;
    }


    /* Save preference when changed */

    rememberMe.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "premiumRememberMe",
                rememberMe.checked
            );

        }
    );

}

/* ==========================================================
GENERAL HELPERS
========================================================== */

function getStoredUser() {

 
const user =
    localStorage.getItem(
        STORAGE_KEYS.USER
    );

if (!user) {
    return null;
}

try {

    return JSON.parse(user);

} catch (error) {

    console.error(
        "Unable to read stored user:",
        error
    );

    return null;

}
 

}

function saveUser(user) {

 
localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(user)
);
 

}

function getCurrentSession() {

 
const session =
    localStorage.getItem(
        STORAGE_KEYS.SESSION
    );

if (!session) {
    return null;
}

try {

    return JSON.parse(session);

} catch (error) {

    return null;

}
 

}

function createSession(user) {

 
const session = {

    name: user.name,

    email: user.email,

    loginTime: new Date().toISOString()

};


localStorage.setItem(

    STORAGE_KEYS.SESSION,

    JSON.stringify(session)

);
 

}

function logoutUser() {

 
localStorage.removeItem(
    STORAGE_KEYS.SESSION
);
 

}

/* ==========================================================
EMAIL VALIDATION
========================================================== */

function isValidEmail(email) {

 
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
);
 

}

/* ==========================================================
LOGIN PAGE
========================================================== */

const loginForm =
document.getElementById("loginForm");

if (loginForm) {

 
const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const rememberMe =
    document.getElementById("rememberMe");

const loginMessage =
    document.getElementById("loginMessage");

const loginButton =
    document.getElementById("loginSubmitButton");


/* ------------------------------------------------------
   SHOW MESSAGE
   ------------------------------------------------------ */

function showLoginMessage(
    message,
    type = ""
) {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        message;


    loginMessage.className =
        `login-message show ${type}`;

}


/* ------------------------------------------------------
   PASSWORD TOGGLE
   ------------------------------------------------------ */

const loginPasswordToggle =
    document.getElementById(
        "loginPasswordToggle"
    );


if (loginPasswordToggle) {

    loginPasswordToggle.addEventListener(
        "click",
        () => {

            const icon =
                document.getElementById(
                    "loginPasswordIcon"
                );


            const show =
                loginPassword.type ===
                "password";


            loginPassword.type =
                show
                    ? "text"
                    : "password";


            if (icon) {

                icon.className =
                    show
                        ? "bi bi-eye-slash"
                        : "bi bi-eye";

            }


            loginPasswordToggle.setAttribute(
                "aria-label",
                show
                    ? "Hide password"
                    : "Show password"
            );

        }
    );

}


/* ------------------------------------------------------
   LOGIN SUBMIT
   ------------------------------------------------------ */

loginForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const email =
            loginEmail.value
                .trim()
                .toLowerCase();

        const password =
            loginPassword.value;


        /* VALIDATE EMAIL */

        if (!email) {

            showLoginMessage(
                "Please enter your email address.",
                "error"
            );

            loginEmail.focus();

            return;

        }


        if (!isValidEmail(email)) {

            showLoginMessage(
                "Please enter a valid email address.",
                "error"
            );

            loginEmail.focus();

            return;

        }


        /* VALIDATE PASSWORD */

        if (!password) {

            showLoginMessage(
                "Please enter your password.",
                "error"
            );

            loginPassword.focus();

            return;

        }


        /* GET REGISTERED USER */

        const user =
            getStoredUser();


        if (!user) {

            showLoginMessage(
                "No account found. Please create an account first.",
                "error"
            );

            return;

        }


        /* CHECK EMAIL */

        if (
            user.email.toLowerCase() !==
            email
        ) {

            showLoginMessage(
                "Email or password is incorrect.",
                "error"
            );

            return;

        }


        /* CHECK PASSWORD */

        if (
            user.password !==
            password
        ) {

            showLoginMessage(
                "Email or password is incorrect.",
                "error"
            );

            return;

        }


        /* REMEMBER ME */

        if (rememberMe) {

            if (rememberMe.checked) {

                localStorage.setItem(
                    STORAGE_KEYS.REMEMBER,
                    "true"
                );

            } else {

                localStorage.removeItem(
                    STORAGE_KEYS.REMEMBER
                );

            }

        }


        /* CREATE LOGIN SESSION */

        createSession(user);


        /* LOADING STATE */

        if (loginButton) {

            loginButton.classList.add(
                "loading"
            );


            const buttonText =
                loginButton.querySelector(
                    ".login-button-text"
                );


            if (buttonText) {

                buttonText.textContent =
                    "ENTERING EXPERIENCE...";

            }

        }


        showLoginMessage(
            "Welcome back. Preparing your experience...",
            "success"
        );


        /* ------------------------------------------------
           TEMPORARY HOME REDIRECT
           ------------------------------------------------ */

        setTimeout(
            () => {

                /*
                 * The real showroom homepage will
                 * replace this destination in Step 6.
                 */

                window.location.href =
                    "pages/home.html";

            },
            1000
        );

    }
);


/* ------------------------------------------------------
   FORGOT PASSWORD
   ------------------------------------------------------ */

const forgotPassword =
    document.getElementById(
        "forgotPassword"
    );


if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            showLoginMessage(
                "Password recovery will be connected in a later step.",
                ""
            );

        }
    );

}

 

}

/* ==========================================================
REGISTER PAGE
========================================================== */

const registerForm =
document.getElementById(
"registerForm"
);

if (registerForm) {

 
/* ------------------------------------------------------
   ELEMENTS
   ------------------------------------------------------ */

const nameInput =
    document.getElementById(
        "registerName"
    );


const emailInput =
    document.getElementById(
        "registerEmail"
    );


const passwordInput =
    document.getElementById(
        "registerPassword"
    );


const confirmInput =
    document.getElementById(
        "confirmPassword"
    );


const termsCheckbox =
    document.getElementById(
        "termsCheckbox"
    );


const message =
    document.getElementById(
        "registerMessage"
    );


/* ------------------------------------------------------
   MESSAGE
   ------------------------------------------------------ */

function showRegisterMessage(
    text,
    type = ""
) {

    message.textContent =
        text;

    message.className =
        `login-message show ${type}`;

}


/* ------------------------------------------------------
   ERROR
   ------------------------------------------------------ */

function showError(
    input,
    errorElement,
    text
) {

    const wrapper =
        input.closest(
            ".login-input-wrapper"
        );


    if (wrapper) {

        wrapper.classList.remove(
            "valid"
        );

        wrapper.classList.add(
            "invalid"
        );

    }


    errorElement.textContent =
        text;

}


/* ------------------------------------------------------
   CLEAR ERROR
   ------------------------------------------------------ */

function clearError(
    input,
    errorElement
) {

    const wrapper =
        input.closest(
            ".login-input-wrapper"
        );


    if (wrapper) {

        wrapper.classList.remove(
            "invalid"
        );

        wrapper.classList.add(
            "valid"
        );

    }


    errorElement.textContent =
        "";

}


/* ------------------------------------------------------
   PASSWORD TOGGLE
   ------------------------------------------------------ */

function setupPasswordToggle(
    buttonId,
    inputId,
    iconId
) {

    const button =
        document.getElementById(
            buttonId
        );


    const input =
        document.getElementById(
            inputId
        );


    const icon =
        document.getElementById(
            iconId
        );


    if (
        !button ||
        !input ||
        !icon
    ) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            const show =
                input.type ===
                "password";


            input.type =
                show
                    ? "text"
                    : "password";


            icon.className =
                show
                    ? "bi bi-eye-slash"
                    : "bi bi-eye";


            button.setAttribute(
                "aria-label",
                show
                    ? "Hide password"
                    : "Show password"
            );

        }
    );

}


setupPasswordToggle(
    "registerPasswordToggle",
    "registerPassword",
    "registerPasswordIcon"
);


setupPasswordToggle(
    "confirmPasswordToggle",
    "confirmPassword",
    "confirmPasswordIcon"
);


/* ------------------------------------------------------
   PASSWORD MATCH
   ------------------------------------------------------ */

confirmInput.addEventListener(
    "input",
    () => {

        const error =
            document.getElementById(
                "confirmPasswordError"
            );


        if (
            confirmInput.value &&
            confirmInput.value !==
            passwordInput.value
        ) {

            showError(
                confirmInput,
                error,
                "Passwords do not match."
            );

        } else if (
            confirmInput.value
        ) {

            clearError(
                confirmInput,
                error
            );

        } else {

            error.textContent =
                "";

        }

    }
);


/* ------------------------------------------------------
   REGISTER SUBMIT
   ------------------------------------------------------ */

registerForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const name =
            nameInput.value.trim();

        const email =
            emailInput.value
                .trim()
                .toLowerCase();

        const password =
            passwordInput.value;

        const confirm =
            confirmInput.value;


        const nameError =
            document.getElementById(
                "nameError"
            );


        const emailError =
            document.getElementById(
                "registerEmailError"
            );


        const passwordError =
            document.getElementById(
                "registerPasswordError"
            );


        const confirmError =
            document.getElementById(
                "confirmPasswordError"
            );


        const termsError =
            document.getElementById(
                "termsError"
            );


        let valid = true;


        /* NAME */

        if (!name) {

            showError(
                nameInput,
                nameError,
                "Full name is required."
            );

            valid = false;

        } else if (name.length < 2) {

            showError(
                nameInput,
                nameError,
                "Please enter your full name."
            );

            valid = false;

        } else {

            clearError(
                nameInput,
                nameError
            );

        }


        /* EMAIL */

        if (!email) {

            showError(
                emailInput,
                emailError,
                "Email address is required."
            );

            valid = false;

        } else if (
            !isValidEmail(email)
        ) {

            showError(
                emailInput,
                emailError,
                "Please enter a valid email address."
            );

            valid = false;

        } else {

            clearError(
                emailInput,
                emailError
            );

        }


        /* PASSWORD */

        if (!password) {

            showError(
                passwordInput,
                passwordError,
                "Password is required."
            );

            valid = false;

        } else if (
            password.length < 6
        ) {

            showError(
                passwordInput,
                passwordError,
                "Password must contain at least 6 characters."
            );

            valid = false;

        } else {

            clearError(
                passwordInput,
                passwordError
            );

        }


        /* CONFIRM */

        if (!confirm) {

            showError(
                confirmInput,
                confirmError,
                "Please confirm your password."
            );

            valid = false;

        } else if (
            password !== confirm
        ) {

            showError(
                confirmInput,
                confirmError,
                "Passwords do not match."
            );

            valid = false;

        } else {

            clearError(
                confirmInput,
                confirmError
            );

        }


        /* TERMS */

        if (!termsCheckbox.checked) {

            termsError.textContent =
                "Please accept the terms to continue.";

            valid = false;

        } else {

            termsError.textContent =
                "";

        }


        if (!valid) {

            showRegisterMessage(
                "Please correct the highlighted fields.",
                "error"
            );

            return;

        }


        /* ------------------------------------------------
           CHECK EXISTING ACCOUNT
           ------------------------------------------------ */

        const existingUser =
            getStoredUser();


        if (
            existingUser &&
            existingUser.email.toLowerCase() ===
            email
        ) {

            showRegisterMessage(
                "An account with this email already exists.",
                "error"
            );

            return;

        }


        /* ------------------------------------------------
           CREATE USER
           ------------------------------------------------ */

        const user = {

            name: name,

            email: email,

            password: password,

            createdAt:
                new Date().toISOString(),

            favorites: [],

            recentlyViewed: [],

            savedConfigurations: [],

            comparisonHistory: []

        };


        saveUser(user);


        /* ------------------------------------------------
           SUCCESS STATE
           ------------------------------------------------ */

        const button =
            document.getElementById(
                "registerSubmitButton"
            );


        button.classList.add(
            "loading"
        );


        button.querySelector(
            ".login-button-text"
        ).textContent =
            "ACCOUNT CREATED";


        showRegisterMessage(
            "Account created successfully. Redirecting to login...",
            "success"
        );


        /* ------------------------------------------------
           REDIRECT TO LOGIN
           ------------------------------------------------ */

        setTimeout(
            () => {

                window.location.href =
                    "../index.html?registered=true";

            },
            1200
        );

    }
);


/* ------------------------------------------------------
   TERMS BUTTON
   ------------------------------------------------------ */

const termsButton =
    document.getElementById(
        "termsButton"
    );


if (termsButton) {

    termsButton.addEventListener(
        "click",
        () => {

            showRegisterMessage(
                "Terms and Privacy Policy will be added as a dedicated page later.",
                ""
            );

        }
    );

}
 

}

/* ==========================================================
AUTO LOGIN / SESSION INFORMATION
========================================================== */

function checkAuthenticationState() {

 
const session =
    getCurrentSession();


if (!session) {
    return;
}


console.log(
    `Premium Motors session active for ${session.name}`
);
 

}

checkAuthenticationState();

/* ==========================================================
PREMIUM SHOWROOM
STEP 6 — HOME EXPERIENCE
========================================================== */

/* ==========================================================
PAGE LOADER
========================================================== */

const showroomLoader =
document.getElementById(
"showroomLoader"
);

if (showroomLoader) {

 
window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                showroomLoader.classList.add(
                    "loaded"
                );

            },
            500
        );

    }
);
 

}

/* ==========================================================
SHOWROOM HEADER
========================================================== */

const showroomHeader =
document.getElementById(
"showroomHeader"
);

function updateShowroomHeader() {

 
if (!showroomHeader) {
    return;
}


if (window.scrollY > 30) {

    showroomHeader.classList.add(
        "scrolled"
    );

} else {

    showroomHeader.classList.remove(
        "scrolled"
    );

}
 

}

window.addEventListener(
"scroll",
updateShowroomHeader,
{
passive: true
}
);

updateShowroomHeader();

/* ==========================================================
MOBILE NAVIGATION
========================================================== */

const mobileMenuButton =
document.getElementById(
"mobileMenuButton"
);

const mobileNavigation =
document.getElementById(
"mobileNavigation"
);

const mobileMenuClose =
document.getElementById(
"mobileMenuClose"
);

function openMobileMenu() {

 
if (!mobileNavigation) {
    return;
}


mobileNavigation.classList.add(
    "active"
);


document.body.style.overflow =
    "hidden";


if (mobileMenuButton) {

    mobileMenuButton.setAttribute(
        "aria-expanded",
        "true"
    );

}
 

}

function closeMobileMenu() {

 
if (!mobileNavigation) {
    return;
}


mobileNavigation.classList.remove(
    "active"
);


document.body.style.overflow =
    "";


if (mobileMenuButton) {

    mobileMenuButton.setAttribute(
        "aria-expanded",
        "false"
    );

}
 

}

if (mobileMenuButton) {

 
mobileMenuButton.addEventListener(
    "click",
    openMobileMenu
);
 

}

if (mobileMenuClose) {

 
mobileMenuClose.addEventListener(
    "click",
    closeMobileMenu
);
 

}

/* CLOSE AFTER NAVIGATION */

document
.querySelectorAll(
".mobile-nav-links a"
)
.forEach(
(link) => {

 
        link.addEventListener(
            "click",
            closeMobileMenu
        );

    }
);
 

/* ESCAPE KEY */

document.addEventListener(
"keydown",
(event) => {

 
    if (
        event.key ===
        "Escape"
    ) {

        closeMobileMenu();

    }

}
 

);

/* ==========================================================
SMOOTH SCROLL
========================================================== */

document
.querySelectorAll(
'a[href^="#"]'
)
.forEach(
(link) => {

 
        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {

                    return;

                }


                event.preventDefault();


                target.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });


                closeMobileMenu();

            }
        );

    }
);
 

/* ==========================================================
PREMIUM NOTIFICATION
========================================================== */

const premiumNotification =
document.getElementById(
"premiumNotification"
);

const notificationText =
document.getElementById(
"notificationText"
);

let notificationTimer;

function showPremiumNotification(
text
) {

 
if (
    !premiumNotification ||
    !notificationText
) {

    return;

}


notificationText.textContent =
    text;


premiumNotification.classList.add(
    "show"
);


clearTimeout(
    notificationTimer
);


notificationTimer =
    setTimeout(
        () => {

            premiumNotification.classList.remove(
                "show"
            );

        },
        3000
    );
 

}

/* ==========================================================
   PREMIUM NAVIGATION SEARCH
========================================================== */

const searchButton =
    document.getElementById("searchButton");

const mobileSearchButton =
    document.getElementById("mobileSearchButton");

const carSearchInput =
    document.getElementById("carSearch");


function openVehicleSearch() {

    /* Search field does not exist on this page */
    if (!carSearchInput) {
        return;
    }

    /* Close mobile menu if open */
    closeMobileMenu();

    /* Scroll to vehicle collection */
    carSearchInput.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    /* Focus search field */
    setTimeout(() => {

        carSearchInput.focus();

        /* Select existing text */
        carSearchInput.select();

    }, 500);

}


/* DESKTOP SEARCH */

if (searchButton) {

    searchButton.addEventListener(
        "click",
        openVehicleSearch
    );

}


/* MOBILE SEARCH */

if (mobileSearchButton) {

    mobileSearchButton.addEventListener(
        "click",
        openVehicleSearch
    );

}


/* ==========================================================
PROFILE PLACEHOLDER
========================================================== */

function openProfileMessage() {

    const session =
        getCurrentSession();


    if (!session) {

        showPremiumNotification(
            "Please sign in to access your profile."
        );

        return;

    }


    window.location.href =
        "profile.html";

}

const profileButton =
document.getElementById(
"profileButton"
);

const mobileProfileButton =
document.getElementById(
"mobileProfileButton"
);

if (profileButton) {

 
profileButton.addEventListener(
    "click",
    openProfileMessage
);
 

}

if (mobileProfileButton) {

 
mobileProfileButton.addEventListener(
    "click",
    () => {

        closeMobileMenu();

        openProfileMessage();

    }
);
 

}

/* ==========================================================
LOGOUT
========================================================== */

function performShowroomLogout() {

 
logoutUser();


showPremiumNotification(
    "Signed out successfully."
);


setTimeout(
    () => {

        window.location.href =
            "../index.html";

    },
    600
);
 

}

const logoutButton =
document.getElementById(
"logoutButton"
);

const mobileLogoutButton =
document.getElementById(
"mobileLogoutButton"
);

if (logoutButton) {

 
logoutButton.addEventListener(
    "click",
    performShowroomLogout
);
 

}

if (mobileLogoutButton) {

 
mobileLogoutButton.addEventListener(
    "click",
    () => {

        closeMobileMenu();

        performShowroomLogout();

    }
);
 

}

/* ==========================================================
SESSION GUARD
========================================================== */

if (
document.body.classList.contains(
"showroom-page"
)
) {

 
const activeSession =
    getCurrentSession();


if (!activeSession) {

    window.location.href =
        "../index.html";

}
 

}


/* =========================================
   PREMIUM CAR COLLECTION DATA
========================================= */

const carCollection = [

    {
    id: "ferrari-296-gtb",
    brand: "Ferrari",
    model: "296 GTB",
    category: "supercar",
    categoryName: "SUPERCAR",

    price: "₹5.40 Cr",
    priceValue: 5.40,

    horsepower: "819 HP",
horsepowerValue: 819,

torque: "740 NM",
torqueValue: 740,

acceleration: "2.9 SEC",
    topSpeed: "330 KM/H",

    fuel: "hybrid",
    transmission: "dct",
    drive: "rwd",

    image:"../assets/images/ferrari-296-gtb.jpg"
},

    {
    id: "lamborghini-revuelto",
    brand: "Lamborghini",
    model: "Revuelto",
    category: "supercar",
    categoryName: "SUPERCAR",

    price: "₹8.89 Cr",
    priceValue: 8.89,

    horsepower: "1001 HP",
horsepowerValue: 1001,

torque: "725 NM",
torqueValue: 725,

acceleration: "2.5 SEC",
    topSpeed: "350 KM/H",

    fuel: "hybrid",
    transmission: "dct",
    drive: "awd",

    image:
        "../assets/images/lamborghini-revuelto.jpg"
},

    {
    id: "bmw-m4",
    brand: "BMW",
    model: "M4 Competition",
    category: "sports",
    categoryName: "SPORTS",

    price: "₹1.56 Cr",
    priceValue: 1.56,

    horsepower: "530 HP",
horsepowerValue: 530,

torque: "650 NM",
torqueValue: 650,

acceleration: "3.5 SEC",
    topSpeed: "250 KM/H",

    fuel: "petrol",
    transmission: "automatic",
    drive: "rwd",

    image:
        "../assets/images/bmw-m4.jpg"
},

    {
    id: "mercedes-amg-gt",
    brand: "Mercedes-Benz",
    model: "AMG GT",
    category: "luxury",
    categoryName: "LUXURY",

    price: "₹2.75 Cr",
    priceValue: 2.75,

    horsepower: "585 HP",
horsepowerValue: 585,

torque: "800 NM",
torqueValue: 800,

acceleration: "3.2 SEC",
    topSpeed: "315 KM/H",

    fuel: "petrol",
    transmission: "automatic",
    drive: "awd",

    image:
        "../assets/images/mercedes-amg-gt.jpg"
},

    {
    id: "audi-rs-e-tron",
    brand: "Audi",
    model: "RS e-tron GT",
    category: "electric",
    categoryName: "ELECTRIC",

    price: "₹1.95 Cr",
    priceValue: 1.95,

    horsepower: "637 HP",
horsepowerValue: 637,

torque: "830 NM",
torqueValue: 830,

acceleration: "3.3 SEC",
    topSpeed: "250 KM/H",

    fuel: "electric",
    transmission: "automatic",
    drive: "awd",

    image:
        "../assets/images/audi-rs-e-tron-gt.png"
},

    {
    id: "porsche-911",
    brand: "Porsche",
    model: "911 Carrera",
    category: "sports",
    categoryName: "SPORTS",

    price: "₹1.99 Cr",
    priceValue: 1.99,

    horsepower: "394 HP",
horsepowerValue: 394,

torque: "450 NM",
torqueValue: 450,

acceleration: "4.1 SEC",
    topSpeed: "294 KM/H",

    fuel: "petrol",
    transmission: "automatic",
    drive: "rwd",

    image:
        "../assets/images/porsche-911.png"
}

];

/* =========================================================
   PREMIUM FAVORITES SYSTEM
========================================================= */

const FAVORITES_KEY = "premiumMotorsFavorites";

let favoriteCars = [];

/* =========================================================
   LOAD FAVORITES
========================================================= */

function loadFavorites() {

    const storedFavorites =
        localStorage.getItem(FAVORITES_KEY);

    if (!storedFavorites) {

        favoriteCars = [];

        return;
    }

    try {

        favoriteCars =
            JSON.parse(storedFavorites);

        if (!Array.isArray(favoriteCars)) {

            favoriteCars = [];

        }

    } catch (error) {

        console.error(
            "Unable to load favorites:",
            error
        );

        favoriteCars = [];

    }

}

/* =========================================================
   SAVE FAVORITES
========================================================= */

function saveFavorites() {

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favoriteCars)
    );

}

/* =========================================================
   CHECK FAVORITE
========================================================= */

function isFavorite(carId) {

    return favoriteCars.includes(carId);

}

/* =========================================================
   ADD / REMOVE FAVORITE
========================================================= */

function toggleFavorite(carId) {

    const car =
        carCollection.find(
            item => item.id === carId
        );

    if (!car) {

        console.error(
            "Favorite car not found:",
            carId
        );

        return;

    }

    const existingIndex =
        favoriteCars.indexOf(carId);

    if (existingIndex === -1) {

        favoriteCars.push(carId);

        showPremiumNotification(
            `${car.brand} ${car.model} added to favorites.`
        );

    } else {

        favoriteCars.splice(
            existingIndex,
            1
        );

        showPremiumNotification(
            `${car.brand} ${car.model} removed from favorites.`
        );

    }

    saveFavorites();

    updateFavoriteButtons();

}

/* =========================================================
   UPDATE FAVORITE BUTTONS
========================================================= */

function updateFavoriteButtons() {

    document
        .querySelectorAll(".car-favorite")
        .forEach(button => {

            const carId =
                button.dataset.carId;

            if (!carId) {
                return;
            }

            const active =
                isFavorite(carId);

            button.classList.toggle(
                "active",
                active
            );

            button.textContent =
                active ? "♥" : "♡";

            button.setAttribute(
                "aria-label",
                active
                    ? "Remove from favorites"
                    : "Add to favorites"
            );

        });

}

/* =========================================================
   INITIALIZE FAVORITES
========================================================= */

loadFavorites();


/* =========================================
   CAR GRID ELEMENT
========================================= */

const carGrid = document.getElementById("carGrid");

const carCount = document.getElementById("carCount");

const categoryButtons =
    document.querySelectorAll(".car-category-btn");


/* =========================================
   RENDER CAR COLLECTION
========================================= */

function renderCars(cars) {

    if (!carGrid) {
        return;
    }

    carGrid.innerHTML = "";


    /* No results */

    if (cars.length === 0) {

        carGrid.innerHTML = `
            <div class="car-no-results">

                <h3>No vehicles found</h3>

                <p>
                    Try selecting another category.
                </p>

            </div>
        `;

        if (carCount) {
            carCount.textContent = "00 VEHICLES";
        }

        return;
    }


    /* Create cards */

    cars.forEach(car => {

        const card = document.createElement("article");

        card.className = "car-card";

        card.dataset.carId = car.id;


        card.innerHTML = `

            <div class="car-image">

                <span class="car-badge">
                    ${car.categoryName}
                </span>

                <button
    class="car-favorite ${isFavorite(car.id) ? "active" : ""}"
    type="button"
    data-car-id="${car.id}"
    aria-label="${
        isFavorite(car.id)
            ? "Remove from favorites"
            : "Add to favorites"
    }">

    ${isFavorite(car.id) ? "♥" : "♡"}

</button>

                <img
                    src="${car.image}"
                    alt="${car.brand} ${car.model}"
                    loading="lazy"
                    onerror="this.style.opacity='0'">

            </div>


            <div class="car-card-content">

                <span class="car-brand">
                    ${car.brand}
                </span>

                <h3 class="car-name">
                    ${car.model}
                </h3>

                <div class="car-price">
                    ${car.price}
                </div>


                <div class="car-specs">

                    <div class="car-spec">

                        <strong>
                            ${car.horsepower}
                        </strong>

                        <span>
                            POWER
                        </span>

                    </div>


                    <div class="car-spec">

                        <strong>
                            ${car.acceleration}
                        </strong>

                        <span>
                            0-100 KM/H
                        </span>

                    </div>


                    <div class="car-spec">

                        <strong>
                            ${car.topSpeed}
                        </strong>

                        <span>
                            TOP SPEED
                        </span>

                    </div>

                </div>


                <div class="car-actions">

                    <button
                        type="button"
                        class="explore-car-btn"
                        data-car-id="${car.id}"
                    >
                        EXPLORE
                    </button>

                    <button
                        class="car-action-btn compare-car compare-car-btn"
                        type="button"
                        data-car="${car.id}"
                        data-car-id="${car.id}">

                        COMPARE

                    </button>

                </div>

            </div>

        `;


        carGrid.appendChild(card);

    });


    if (carCount) {

        carCount.textContent =
            `${String(cars.length).padStart(2, "0")} VEHICLES`;

    }

    updateFavoriteButtons();

}


/* =========================================
   CATEGORY FILTER
========================================= */

function filterCars(category) {

    if (category === "all") {

        renderCars(carCollection);

        return;

    }


    const filteredCars =
        carCollection.filter(car =>
            car.category === category
        );


    renderCars(filteredCars);

}


/* =========================================
   CATEGORY EVENTS
========================================= */

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");


        const category =
            button.dataset.category;


        /* Synchronize dropdown */

        if (categoryFilter) {

            categoryFilter.value =
                category;

        }


        applyCarFilters();

    });

});


/* =========================================
   INITIAL COLLECTION
========================================= */

renderCars(carCollection);

/* =========================================
   PREMIUM SEARCH & FILTER SYSTEM
========================================= */

const carSearch =
    document.getElementById("carSearch");

const clearSearch =
    document.getElementById("clearSearch");

const brandFilter =
    document.getElementById("brandFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const fuelFilter =
    document.getElementById("fuelFilter");

const transmissionFilter =
    document.getElementById("transmissionFilter");

const driveFilter =
    document.getElementById("driveFilter");

const clearFilters =
    document.getElementById("clearFilters");


/* =========================================
   APPLY ALL FILTERS
========================================= */

function applyCarFilters() {

    const searchValue =
        carSearch ?
        carSearch.value.trim().toLowerCase() :
        "";


    const selectedBrand =
        brandFilter ?
        brandFilter.value :
        "all";


    const selectedCategory =
        categoryFilter ?
        categoryFilter.value :
        "all";


    const selectedFuel =
        fuelFilter ?
        fuelFilter.value :
        "all";


    const selectedTransmission =
        transmissionFilter ?
        transmissionFilter.value :
        "all";


    const selectedDrive =
        driveFilter ?
        driveFilter.value :
        "all";


    const filteredCars =
        carCollection.filter(car => {


            /* Search */

            const searchableText =
                `${car.brand} ${car.model} ${car.category}`
                .toLowerCase();

            const matchesSearch =
                searchValue === "" ||
                searchableText.includes(searchValue);


            /* Brand */

            const matchesBrand =
                selectedBrand === "all" ||
                car.brand === selectedBrand;


            /* Category */

            const matchesCategory =
                selectedCategory === "all" ||
                car.category === selectedCategory;


            /* Fuel */

            const matchesFuel =
                selectedFuel === "all" ||
                car.fuel === selectedFuel;


            /* Transmission */

            const matchesTransmission =
                selectedTransmission === "all" ||
                car.transmission === selectedTransmission;


            /* Drive */

            const matchesDrive =
                selectedDrive === "all" ||
                car.drive === selectedDrive;


            return (
                matchesSearch &&
                matchesBrand &&
                matchesCategory &&
                matchesFuel &&
                matchesTransmission &&
                matchesDrive
            );

        });


    renderCars(filteredCars);

}


/* =========================================
   SEARCH EVENT
========================================= */

if (carSearch) {

    carSearch.addEventListener(
        "input",
        applyCarFilters
    );

}


/* =========================================
   CLEAR SEARCH
========================================= */

if (clearSearch) {

    clearSearch.addEventListener("click", () => {

        if (carSearch) {
            carSearch.value = "";
        }

        applyCarFilters();

        if (carSearch) {
            carSearch.focus();
        }

    });

}


/* =========================================
   SELECT FILTER EVENTS
========================================= */

[
    brandFilter,
    categoryFilter,
    fuelFilter,
    transmissionFilter,
    driveFilter
].forEach(filter => {

    if (filter) {

        filter.addEventListener(
            "change",
            applyCarFilters
        );

    }

});


/* =========================================
   RESET ALL FILTERS
========================================= */

if (clearFilters) {

    clearFilters.addEventListener("click", () => {

        if (carSearch) {
            carSearch.value = "";
        }

        if (brandFilter) {
            brandFilter.value = "all";
        }

        if (categoryFilter) {
            categoryFilter.value = "all";
        }

        if (fuelFilter) {
            fuelFilter.value = "all";
        }

        if (transmissionFilter) {
            transmissionFilter.value = "all";
        }

        if (driveFilter) {
            driveFilter.value = "all";
        }

        if (driveFilter) {
            driveFilter.value = "all";
        }


        /* Reset quick category buttons */

        categoryButtons.forEach(button => {
            button.classList.remove("active");
        });

        const allButton =
            document.querySelector(
                '.car-category-btn[data-category="all"]'
            );

        if (allButton) {
            allButton.classList.add("active");
        }


        renderCars(carCollection);

    });

}

/* =================================================
PREMIUM CAR DETAILS SYSTEM
================================================= */

const carDetailsModal =
    document.getElementById("carDetailsModal");

const carDetailsClose =
    document.getElementById("carDetailsClose");

const carDetailsBackdrop =
    document.querySelector(".car-details-backdrop");

const detailsCarImage =
    document.getElementById("detailsCarImage");

const detailsCarBrand =
    document.getElementById("detailsCarBrand");

const detailsCarCategory =
    document.getElementById("detailsCarCategory");

const detailsCarModel =
    document.getElementById("detailsCarModel");

const detailsCarDescription =
    document.getElementById("detailsCarDescription");

const detailsCarPrice =
    document.getElementById("detailsCarPrice");

const detailsCarHorsepower =
    document.getElementById("detailsCarHorsepower");

const detailsCarAcceleration =
    document.getElementById("detailsCarAcceleration");

const detailsCarTopSpeed =
    document.getElementById("detailsCarTopSpeed");

const detailsCarFuel =
    document.getElementById("detailsCarFuel");

const detailsCarTransmission =
    document.getElementById("detailsCarTransmission");

const detailsCarDrive =
    document.getElementById("detailsCarDrive");

let selectedCar = null;


/* =================================================
OPEN CAR DETAILS
================================================= */

function openCarDetails(carId) {

    /* Find selected car */

    const car = carCollection.find(
        item => item.id === carId
    );


    /* Safety check */

    if (!car) {

        console.error(
            "Car not found:",
            carId
        );

        return;

    }


    selectedCar = car;


    /* =================================================
    CAR IMAGE
    ================================================= */

    if (detailsCarImage) {

        detailsCarImage.src = car.image;

        detailsCarImage.alt =
            `${car.brand} ${car.model}`;

    }


    /* =================================================
    BASIC INFORMATION
    ================================================= */

    if (detailsCarBrand) {

        detailsCarBrand.textContent =
            car.brand.toUpperCase();

    }


    if (detailsCarCategory) {

        detailsCarCategory.textContent =
            car.categoryName;

    }


    if (detailsCarModel) {

        detailsCarModel.textContent =
            car.model;

    }


    if (detailsCarPrice) {

        detailsCarPrice.textContent =
            car.price;

    }


    /* =================================================
    DESCRIPTION
    ================================================= */

    if (detailsCarDescription) {

        detailsCarDescription.textContent =
            `${car.brand} ${car.model} combines exceptional performance, advanced engineering and distinctive design in a truly premium automotive experience.`;

    }


    /* =================================================
    PERFORMANCE
    ================================================= */

    if (detailsCarHorsepower) {

        detailsCarHorsepower.textContent =
            car.horsepower;

    }


    if (detailsCarAcceleration) {

        detailsCarAcceleration.textContent =
            car.acceleration;

    }


    if (detailsCarTopSpeed) {

        detailsCarTopSpeed.textContent =
            car.topSpeed;

    }


    /* =================================================
    POWERTRAIN
    ================================================= */

    if (detailsCarFuel) {

        detailsCarFuel.textContent =
            formatCarValue(car.fuel);

    }


    if (detailsCarTransmission) {

        detailsCarTransmission.textContent =
            formatCarValue(car.transmission);

    }


    if (detailsCarDrive) {

        detailsCarDrive.textContent =
            formatCarValue(car.drive);

    }


    /* =================================================
    OPEN MODAL
    ================================================= */

    if (carDetailsModal) {

        carDetailsModal.classList.add("active");

        carDetailsModal.setAttribute(
            "aria-hidden",
            "false"
        );

        /*
         * Prevent background page scrolling
         * while keeping the modal itself scrollable.
         */

        

    }

}


/* =================================================
FORMAT CAR VALUES
================================================= */

function formatCarValue(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "—";

    }


    return value
        .toString()
        .replace(/-/g, " ")
        .toUpperCase();

}


/* =================================================
CLOSE CAR DETAILS
================================================= */

function closeCarDetails() {

    if (!carDetailsModal) {

        return;

    }


    carDetailsModal.classList.remove(
        "active"
    );


    carDetailsModal.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
     * IMPORTANT:
     * Restore normal page scrolling.
     */

    document.body.classList.remove(
        "car-modal-open"
    );


    selectedCar = null;

}


/* =================================================
CLOSE BUTTON
================================================= */

if (carDetailsClose) {

    carDetailsClose.addEventListener(
        "click",
        closeCarDetails
    );

}


/* =================================================
CLOSE BACKDROP
================================================= */

if (carDetailsBackdrop) {

    carDetailsBackdrop.addEventListener(
        "click",
        closeCarDetails
    );

}


/* =================================================
ESCAPE KEY
================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            carDetailsModal &&
            carDetailsModal.classList.contains(
                "active"
            )
        ) {

            closeCarDetails();

        }

    }
);


/* =================================================
CONNECT EXPLORE BUTTONS
================================================= */

document.addEventListener(
    "click",
    function(event) {

        const exploreButton =
            event.target.closest(
                ".explore-car-btn"
            );


        if (!exploreButton) {

            return;

        }


        const carId =
            exploreButton.getAttribute(
                "data-car-id"
            );


        console.log(
            "Explore clicked:",
            carId
        );


        if (!carId) {

            console.error(
                "Explore button has no car ID."
            );

            return;

        }


        openCarDetails(carId);

    }
);

/* =========================================================
   FAVORITE BUTTON EVENT
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const favoriteButton =
            event.target.closest(
                ".car-favorite"
            );

        if (!favoriteButton) {
            return;
        }

        event.stopPropagation();

        const carId =
            favoriteButton.getAttribute(
                "data-car-id"
            );

        if (!carId) {

            console.error(
                "Favorite button has no car ID."
            );

            return;

        }

        toggleFavorite(carId);

    }
);

/* =================================================
   CLOSE EVENTS
================================================= */

if (carDetailsClose) {

    carDetailsClose.addEventListener(
        "click",
        closeCarDetails
    );

}


if (carDetailsBackdrop) {

    carDetailsBackdrop.addEventListener(
        "click",
        closeCarDetails
    );

}


/* =================================================
   ESC KEY
================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            carDetailsModal &&
            carDetailsModal.classList.contains("active")
        ) {

            closeCarDetails();

        }

    }
);




/* =========================================================
   PREMIUM CAR COMPARISON SYSTEM
========================================================= */

let comparisonCars = [];



/* =========================================================
   SAVE FAVORITES
========================================================= */

function saveFavorites() {

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favoriteCars)
    );

}

/* =========================================================
   CHECK FAVORITE
========================================================= */

function isFavorite(carId) {

    return favoriteCars.includes(carId);

}


/* =========================================================
   UPDATE FAVORITE BUTTONS
========================================================= */

function updateFavoriteButtons() {

    document
        .querySelectorAll(".car-favorite")
        .forEach(button => {

            const carId =
                button.dataset.carId;

            if (!carId) {
                return;
            }

            const active =
                isFavorite(carId);

            button.classList.toggle(
                "active",
                active
            );

            button.textContent =
                active ? "♥" : "♡";

            button.setAttribute(
                "aria-label",
                active
                    ? "Remove from favorites"
                    : "Add to favorites"
            );

        });

}

/* =========================================================
   INITIALIZE FAVORITES
========================================================= */

loadFavorites();


/* =========================================================
   PREMIUM RECENTLY VIEWED SYSTEM
========================================================= */

const RECENTLY_VIEWED_KEY =
    "premiumMotorsRecentlyViewed";

let recentlyViewedCars = [];


/* =========================================================
   LOAD RECENTLY VIEWED
========================================================= */

function loadRecentlyViewed() {

    const stored =
        localStorage.getItem(
            RECENTLY_VIEWED_KEY
        );

    if (!stored) {

        recentlyViewedCars = [];

        return;

    }

    try {

        recentlyViewedCars =
            JSON.parse(stored);

        if (!Array.isArray(recentlyViewedCars)) {

            recentlyViewedCars = [];

        }

    } catch (error) {

        console.error(
            "Unable to load recently viewed cars:",
            error
        );

        recentlyViewedCars = [];

    }

}


/* =========================================================
   SAVE RECENTLY VIEWED
========================================================= */

function saveRecentlyViewed() {

    localStorage.setItem(
        RECENTLY_VIEWED_KEY,
        JSON.stringify(recentlyViewedCars)
    );

}


/* =========================================================
   ADD RECENTLY VIEWED CAR
========================================================= */

function addRecentlyViewed(carId) {

    const car =
        carCollection.find(
            item => item.id === carId
        );

    if (!car) {

        console.error(
            "Recently viewed car not found:",
            carId
        );

        return;

    }


    /* Remove existing occurrence */

    recentlyViewedCars =
        recentlyViewedCars.filter(
            id => id !== carId
        );


    /* Add newest car at the beginning */

    recentlyViewedCars.unshift(carId);


    /* Keep maximum 6 cars */

    if (recentlyViewedCars.length > 6) {

        recentlyViewedCars =
            recentlyViewedCars.slice(0, 6);

    }


    saveRecentlyViewed();

}


/* =========================================================
   INITIALIZE
========================================================= */

loadRecentlyViewed();

/* =========================================================
   ELEMENTS
========================================================= */

const comparisonModal =
    document.getElementById("comparisonModal");

const comparisonClose =
    document.getElementById("comparisonClose");

const comparisonBackdrop =
    document.querySelector(".comparison-backdrop");

const comparisonCarsContainer =
    document.getElementById("comparisonCars");

const comparisonClear =
    document.getElementById("comparisonClear");


/* =========================================================
   ADD CAR TO COMPARISON
========================================================= */

function addToComparison(carId) {

    const car =
        carCollection.find(
            item => item.id === carId
        );


    if (!car) {

        console.error(
            "Comparison car not found:",
            carId
        );

        return;

    }


    /* Prevent duplicate */

    if (
        comparisonCars.some(
            item => item.id === car.id
        )
    ) {

        openComparison();

        return;

    }


    /* Maximum two cars */

    if (comparisonCars.length >= 2) {

        showComparisonMessage(
            "Only two cars can be compared at a time."
        );

        return;

    }


    comparisonCars.push(car);


    if (comparisonCars.length === 2) {

        openComparison();

    } else {

        showComparisonMessage(
            `${car.brand} ${car.model} added. Select one more car to compare.`
        );

    }

}


/* =========================================================
   OPEN COMPARISON
========================================================= */

function openComparison() {

    if (!comparisonModal) {
        return;
    }


    renderComparison();


    comparisonModal.classList.add(
        "active"
    );


    comparisonModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "car-modal-open"
    );

}


/* =========================================================
   RENDER COMPARISON
========================================================= */

function renderComparison() {

    if (!comparisonCarsContainer) {
        return;
    }


    comparisonCarsContainer.innerHTML = "";


    comparisonCars.forEach(car => {

        const card =
            document.createElement("div");


        card.className =
            "comparison-car";


        card.innerHTML = `

            <img
                src="${car.image}"
                alt="${car.brand} ${car.model}"
            >

            <div class="comparison-car-brand">
                ${car.brand}
            </div>

            <div class="comparison-car-name">
                ${car.model}
            </div>

        `;


        comparisonCarsContainer.appendChild(
            card
        );

    });


    updateComparisonValue(
        "Price",
        "price"
    );

    updateComparisonValue(
        "Horsepower",
        "horsepower"
    );

    updateComparisonValue(
        "Torque",
        "torque"
    );

    updateComparisonValue(
        "Acceleration",
        "acceleration"
    );

    updateComparisonValue(
        "TopSpeed",
        "topSpeed"
    );

    updateComparisonValue(
        "Fuel",
        "fuel"
    );

    updateComparisonValue(
        "Transmission",
        "transmission"
    );

    updateComparisonValue(
        "Drive",
        "drive"
    );

    updateComparisonValue(
        "Category",
        "categoryName"
    );

}


/* =========================================================
   UPDATE COMPARISON VALUE
========================================================= */

function updateComparisonValue(
    label,
    property
) {

    const first =
        document.getElementById(
            `compare${label}1`
        );

    const second =
        document.getElementById(
            `compare${label}2`
        );


    if (first) {

        first.textContent =
            comparisonCars[0]
                ? formatComparisonValue(
                    comparisonCars[0][property]
                )
                : "—";

    }


    if (second) {

        second.textContent =
            comparisonCars[1]
                ? formatComparisonValue(
                    comparisonCars[1][property]
                )
                : "—";

    }

}


/* =========================================================
   FORMAT VALUE
========================================================= */

function formatComparisonValue(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "—";

    }


    return value
        .toString()
        .replace("-", " ")
        .toUpperCase();

}


/* =========================================================
   CLOSE COMPARISON
========================================================= */

function closeComparison() {

    if (!comparisonModal) {
        return;
    }


    comparisonModal.classList.remove(
        "active"
    );


    comparisonModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "car-modal-open"
    );

}


/* =========================================================
   CLEAR COMPARISON
========================================================= */

function clearComparison() {

    comparisonCars = [];


    if (comparisonCarsContainer) {

        comparisonCarsContainer.innerHTML = "";

    }


    closeComparison();

}


/* =========================================================
   COMPARISON MESSAGE
========================================================= */

function showComparisonMessage(message) {

    /*
       Simple notification for now.
       We will replace this with the premium
       notification system later.
    */

    console.log(
        "COMPARISON:",
        message
    );

    alert(message);

}


/* =========================================================
   COMPARE BUTTON
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const compareButton =
            event.target.closest(
                ".compare-car-btn"
            );


        if (!compareButton) {
            return;
        }


        const carId =
            compareButton.getAttribute(
                "data-car-id"
            );


        if (!carId) {

            console.error(
                "Compare button has no car ID."
            );

            return;

        }


        addToComparison(carId);

    }
);


/* =========================================================
   CLOSE EVENTS
========================================================= */

if (comparisonClose) {

    comparisonClose.addEventListener(
        "click",
        closeComparison
    );

}


if (comparisonBackdrop) {

    comparisonBackdrop.addEventListener(
        "click",
        closeComparison
    );

}


if (comparisonClear) {

    comparisonClear.addEventListener(
        "click",
        clearComparison
    );

}


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            comparisonModal &&
            comparisonModal.classList.contains(
                "active"
            )
        ) {

            closeComparison();

        }

    }
);
 


/* =========================================================
   CONFIGURATOR VEHICLES
========================================================= */

const configuratorCars = {

    ferrari: {

        brand: "FERRARI",

        model: "296 GTB",

        price: 5.40,

        image:
            "../assets/images/ferrari-296-gtb.jpg"

    },


    lamborghini: {

        brand: "LAMBORGHINI",

        model: "REVUELTO",

        price: 8.89,

        image:
            "../assets/images/lamborghini-revuelto.jpg"

    },


    bmw: {

        brand: "BMW",

        model: "M4 COMPETITION",

        price: 1.56,

        image:
            "../assets/images/bmw-m4.jpg"

    },


    mercedes: {

        brand: "MERCEDES-AMG",

        model: "GT",

        price: 2.75,

        image:
            "../assets/images/mercedes-amg-gt.jpg"

    },


    audi: {

        brand: "AUDI",

        model: "RS E-TRON GT",

        price: 1.95,

        image:
            "../assets/images/audi-rs-e-tron-gt.png"

    },


    porsche: {

        brand: "PORSCHE",

        model: "911 CARRERA",

        price: 1.99,

        image:
            "../assets/images/porsche-911.png"

    }

};

/* =========================================================
   PREMIUM CAR CONFIGURATOR — ELEMENTS
========================================================= */

const configuratorModal =
    document.getElementById("configuratorModal");

const openConfiguratorButton =
    document.getElementById("openConfiguratorButton");

const configuratorClose =
    document.getElementById("configuratorClose");

const configuratorBackdrop =
    document.getElementById("configuratorBackdrop");

const configuratorCarImage =
    document.getElementById("configuratorCarImage");

const configuratorBrand =
    document.getElementById("configuratorBrand");

const configuratorModel =
    document.getElementById("configuratorModel");

const configuratorVariantLabel =
    document.getElementById("configuratorVariantLabel");

const configuratorModelSelect =
    document.getElementById("configuratorModelSelect");

const configuratorVariant =
    document.getElementById("configuratorVariant");

const configuratorWheels =
    document.getElementById("configuratorWheels");

const configuratorInterior =
    document.getElementById("configuratorInterior");

const configuratorTrim =
    document.getElementById("configuratorTrim");

const configuratorTotalPrice =
    document.getElementById("configuratorTotalPrice");

const resetConfigurator =
    document.getElementById("resetConfigurator");

const saveConfigurationButton =
    document.getElementById("saveConfigurationButton");

/* =========================================================
   OPEN CONFIGURATOR
========================================================= */

function openConfigurator() {

    if (!configuratorModal) {

        console.error(
            "Configurator modal not found."
        );

        return;

    }


    configuratorModal.classList.add(
        "active"
    );


    configuratorModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "car-modal-open"
    );


    updateConfigurator();

}


/* =========================================================
   CLOSE CONFIGURATOR
========================================================= */

function closeConfigurator() {

    if (!configuratorModal) {
        return;
    }


    configuratorModal.classList.remove(
        "active"
    );


    configuratorModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "car-modal-open"
    );

}


/* =========================================================
   OPEN BUTTON
========================================================= */

if (openConfiguratorButton) {

    openConfiguratorButton.addEventListener(
        "click",
        openConfigurator
    );

}


/* =========================================================
   CLOSE BUTTON
========================================================= */

if (configuratorClose) {

    configuratorClose.addEventListener(
        "click",
        closeConfigurator
    );

}


/* =========================================================
   BACKDROP
========================================================= */

if (configuratorBackdrop) {

    configuratorBackdrop.addEventListener(
        "click",
        closeConfigurator
    );

}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            configuratorModal &&
            configuratorModal.classList.contains(
                "active"
            )
        ) {

            closeConfigurator();

        }

    }
);


/* =========================================================
   GET SELECT PRICE
========================================================= */

function getSelectPrice(selectElement) {

    if (!selectElement) {
        return 0;
    }


    const option =
        selectElement.options[
            selectElement.selectedIndex
        ];


    if (!option) {
        return 0;
    }


    return Number(
        option.dataset.price || 0
    );

}


/* =========================================================
   GET SELECTED OPTIONS PRICE
========================================================= */

function getConfiguratorOptionsPrice() {

    let total = 0;


    document
        .querySelectorAll(
            ".configurator-option:checked"
        )
        .forEach(option => {

            total += Number(
                option.dataset.price || 0
            );

        });


    return total;

}


/* =========================================================
   GET EXTERIOR COLOR PRICE
========================================================= */

function getConfiguratorColorPrice() {

    const activeColor =
        document.querySelector(
            ".configurator-color.active"
        );


    if (!activeColor) {
        return 0;
    }


    return Number(
        activeColor.dataset.colorPrice || 0
    );

}


/* =========================================================
   UPDATE CONFIGURATOR
========================================================= */

function updateConfigurator() {

    if (!configuratorModelSelect) {
        return;
    }


    const selectedModel =
        configuratorCars[
            configuratorModelSelect.value
        ];


    if (!selectedModel) {
        return;
    }


    /* UPDATE IMAGE */

    if (configuratorCarImage) {

        configuratorCarImage.style.opacity =
            "0.4";


        setTimeout(
            () => {

                configuratorCarImage.src =
                    selectedModel.image;

                configuratorCarImage.alt =
                    `${selectedModel.brand} ${selectedModel.model}`;

                configuratorCarImage.style.opacity =
                    "1";

            },
            120
        );

    }


    /* UPDATE BRAND */

    if (configuratorBrand) {

        configuratorBrand.textContent =
            selectedModel.brand;

    }


    /* UPDATE MODEL */

    if (configuratorModel) {

        configuratorModel.textContent =
            selectedModel.model;

    }


    /* UPDATE VARIANT */

    if (configuratorVariantLabel) {

        const variantText =
            configuratorVariant.options[
                configuratorVariant.selectedIndex
            ].text;


        configuratorVariantLabel.textContent =
            variantText.toUpperCase();

    }


    /* BASE PRICE */

    let total =
        selectedModel.price;


    /* VARIANT PRICE */

    const variantPrices = {

        standard: 0,

        performance: 0.35,

        signature: 0.75

    };


    total +=
        variantPrices[
            configuratorVariant.value
        ] || 0;


    /* COLOR */

    total +=
        getConfiguratorColorPrice() /
        10000000;


    /* WHEELS */

    total +=
        getSelectPrice(
            configuratorWheels
        ) /
        10000000;


    /* INTERIOR */

    total +=
        getSelectPrice(
            configuratorInterior
        ) /
        10000000;


    /* TRIM */

    total +=
        getSelectPrice(
            configuratorTrim
        ) /
        10000000;


    /* OPTIONAL FEATURES */

    total +=
        getConfiguratorOptionsPrice() /
        10000000;


    /* DISPLAY PRICE */

    if (configuratorTotalPrice) {

        configuratorTotalPrice.textContent =
            `₹${total.toFixed(2)} Cr`;

    }

}


/* =========================================================
   MODEL CHANGE
========================================================= */

if (configuratorModelSelect) {

    configuratorModelSelect.addEventListener(
        "change",
        updateConfigurator
    );

}


/* =========================================================
   VARIANT CHANGE
========================================================= */

if (configuratorVariant) {

    configuratorVariant.addEventListener(
        "change",
        updateConfigurator
    );

}


/* =========================================================
   WHEELS
========================================================= */

if (configuratorWheels) {

    configuratorWheels.addEventListener(
        "change",
        updateConfigurator
    );

}


/* =========================================================
   INTERIOR
========================================================= */

if (configuratorInterior) {

    configuratorInterior.addEventListener(
        "change",
        updateConfigurator
    );

}


/* =========================================================
   TRIM
========================================================= */

if (configuratorTrim) {

    configuratorTrim.addEventListener(
        "change",
        updateConfigurator
    );

}


/* =========================================================
   EXTERIOR COLOR
========================================================= */

document
    .querySelectorAll(
        ".configurator-color"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".configurator-color"
                    )
                    .forEach(
                        colorButton => {

                            colorButton.classList.remove(
                                "active"
                            );

                        }
                    );


                button.classList.add(
                    "active"
                );


                updateConfigurator();

            }
        );

    });


/* =========================================================
   OPTIONAL FEATURES
========================================================= */

document
    .querySelectorAll(
        ".configurator-option"
    )
    .forEach(option => {

        option.addEventListener(
            "change",
            updateConfigurator
        );

    });


/* =========================================================
   RESET CONFIGURATION
========================================================= */

if (resetConfigurator) {

    resetConfigurator.addEventListener(
        "click",
        () => {

            if (configuratorModelSelect) {

                configuratorModelSelect.value =
                    "ferrari";

            }


            if (configuratorVariant) {

                configuratorVariant.value =
                    "standard";

            }


            if (configuratorWheels) {

                configuratorWheels.value =
                    "standard";

            }


            if (configuratorInterior) {

                configuratorInterior.value =
                    "black";

            }


            if (configuratorTrim) {

                configuratorTrim.value =
                    "aluminium";

            }


            document
                .querySelectorAll(
                    ".configurator-option"
                )
                .forEach(
                    option => {

                        option.checked =
                            false;

                    }
                );


            document
                .querySelectorAll(
                    ".configurator-color"
                )
                .forEach(
                    colorButton => {

                        colorButton.classList.remove(
                            "active"
                        );

                    }
                );


            const blackColor =
                document.querySelector(
                    '.configurator-color[data-color="black"]'
                );


            if (blackColor) {

                blackColor.classList.add(
                    "active"
                );

            }


            updateConfigurator();

        }
    );

}


/* =========================================================
   SAVE CONFIGURATION
========================================================= */

if (saveConfigurationButton) {

    saveConfigurationButton.addEventListener(
        "click",
        () => {

            const selectedModel =
                configuratorCars[
                    configuratorModelSelect.value
                ];


            const activeColor =
                document.querySelector(
                    ".configurator-color.active"
                );


            const configuration = {

                model:
                    selectedModel.model,

                brand:
                    selectedModel.brand,

                variant:
                    configuratorVariant.value,

                exteriorColor:
                    activeColor
                        ? activeColor.dataset.colorName
                        : "Standard",

                wheels:
                    configuratorWheels.value,

                interior:
                    configuratorInterior.value,

                trim:
                    configuratorTrim.value,

                total:
                    configuratorTotalPrice.textContent,

                savedAt:
                    new Date().toISOString()

            };


            localStorage.setItem(
                "premiumMotorsConfiguration",
                JSON.stringify(
                    configuration
                )
            );


            showPremiumNotification(
                "Your vehicle configuration has been saved."
            );


            saveConfigurationButton.textContent =
                "CONFIGURATION SAVED";

        }
    );

}

/* =========================================================
   STEP 17 — PREMIUM USER PROFILE
========================================================= */

(function initPremiumProfile() {

    const profilePage =
        document.body.classList.contains("profile-page");

    if (!profilePage) {
        return;
    }


    /* =========================================
       GET USER
    ========================================== */

    const user =
        getStoredUser();


    const session =
        getCurrentSession();


    /* =========================================
       SESSION GUARD
    ========================================== */

    if (!user || !session) {

        window.location.href =
            "../index.html";

        return;

    }


    /* =========================================
       ELEMENTS
    ========================================== */

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const accountName =
        document.getElementById("accountName");

    const accountEmail =
        document.getElementById("accountEmail");

    const accountCreated =
        document.getElementById("accountCreated");

    const favoriteCount =
        document.getElementById("favoriteCount");

    const recentCount =
        document.getElementById("recentCount");

    const comparisonCount =
        document.getElementById("comparisonCount");

    const configurationCount =
        document.getElementById("configurationCount");

    const profileFavorites =
        document.getElementById("profileFavorites");

    const profileRecent =
        document.getElementById("profileRecent");

    const logoutButton =
        document.getElementById("profileLogout");


    /* =========================================
       ACCOUNT INFORMATION
    ========================================== */

    const displayName =
        user.name || "Premium Member";

    const displayEmail =
        user.email || "—";


    if (profileName) {

        profileName.textContent =
            displayName;

    }


    if (profileEmail) {

        profileEmail.textContent =
            displayEmail;

    }


    if (accountName) {

        accountName.textContent =
            displayName;

    }


    if (accountEmail) {

        accountEmail.textContent =
            displayEmail;

    }


    if (accountCreated) {

        if (user.createdAt) {

            const date =
                new Date(user.createdAt);

            accountCreated.textContent =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

        } else {

            accountCreated.textContent =
                "—";

        }

    }


    /* =========================================
   USER GARAGE DATA
========================================= */

/* FAVORITES */

let profileFavoritesData = [];

try {

    profileFavoritesData =
        JSON.parse(
            localStorage.getItem(
                "premiumMotorsFavorites"
            )
        ) || [];

} catch (error) {

    profileFavoritesData = [];

}


/* RECENTLY VIEWED */

let profileRecentData = [];

try {

    profileRecentData =
        JSON.parse(
            localStorage.getItem(
                "premiumMotorsRecentlyViewed"
            )
        ) || [];

} catch (error) {

    profileRecentData = [];

}


/* COMPARISONS */

let profileComparisonData = [];

try {

    profileComparisonData =
        JSON.parse(
            localStorage.getItem(
                "premiumMotorsComparisonHistory"
            )
        ) || [];

} catch (error) {

    profileComparisonData = [];

}


/* CONFIGURATION */

let profileConfigurationData = [];

const savedConfiguration =
    localStorage.getItem(
        "premiumMotorsConfiguration"
    );

if (savedConfiguration) {

    try {

        profileConfigurationData = [
            JSON.parse(
                savedConfiguration
            )
        ];

    } catch (error) {

        profileConfigurationData = [];

    }

}

    /* =========================================
   PROFILE STATISTICS
========================================= */

if (favoriteCount) {

    favoriteCount.textContent =
        profileFavoritesData.length;

}


if (recentCount) {

    recentCount.textContent =
        profileRecentData.length;

}


if (comparisonCount) {

    comparisonCount.textContent =
        profileComparisonData.length;

}


if (configurationCount) {

    configurationCount.textContent =
        profileConfigurationData.length;

}

    /* =========================================
       FIND CAR
    ========================================== */

    function findProfileCar(id) {

        if (
            typeof carCollection ===
            "undefined"
        ) {

            return null;

        }


        return carCollection.find(
            car => car.id === id
        );

    }


    /* =========================================
       RENDER FAVORITES
    ========================================== */

    function renderProfileCars(
        container,
        ids,
        emptyTitle,
        emptyText,
        emptyIcon
    ) {

        if (!container) {
            return;
        }


        container.innerHTML = "";


        const cars =
            ids
                .map(id =>
                    findProfileCar(id)
                )
                .filter(Boolean);


        if (cars.length === 0) {

            container.innerHTML = `

                <div class="profile-empty">

                    <i class="bi ${emptyIcon}"></i>

                    <h3>
                        ${emptyTitle}
                    </h3>

                    <p>
                        ${emptyText}
                    </p>

                </div>

            `;

            return;

        }


        cars.forEach(car => {

            const card =
                document.createElement("article");


            card.className =
                "profile-vehicle-card";


            card.innerHTML = `

                <img
                    class="profile-vehicle-image"
                    src="${car.image}"
                    alt="${car.brand} ${car.model}"
                    loading="lazy"
                >


                <div class="profile-vehicle-info">

                    <div class="profile-vehicle-brand">
                        ${car.brand}
                    </div>

                    <div class="profile-vehicle-name">
                        ${car.model}
                    </div>

                </div>

            `;


            container.appendChild(card);

        });

    }


    /* =========================================
       FAVORITES
    ========================================== */

renderProfileCars(

    profileFavorites,

    profileFavoritesData,

    "No favorite vehicles yet",

    "Add vehicles to your favorites from the showroom.",

    "bi-heart"

);


    /* =========================================
       RECENTLY VIEWED
    ========================================== */

renderProfileCars(

    profileRecent,

    profileRecentData,

    "No recently viewed vehicles",

    "Explore vehicles to build your personal automotive history.",

    "bi-clock-history"

);


    /* =========================================
       LOGOUT
    ========================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                logoutUser();

                window.location.href =
                    "../index.html";

            }
        );

    }

})();

/* =========================================================
   STEP 18 — SHOWROOM APPOINTMENT SYSTEM
========================================================= */

(function initAppointmentSystem() {

    const appointmentForm =
        document.getElementById(
            "appointmentForm"
        );

    if (!appointmentForm) {
        return;
    }


    /* =========================================
       ELEMENTS
    ========================================== */

    const nameInput =
        document.getElementById(
            "appointmentName"
        );

    const emailInput =
        document.getElementById(
            "appointmentEmail"
        );

    const phoneInput =
        document.getElementById(
            "appointmentPhone"
        );

    const carInput =
        document.getElementById(
            "appointmentCar"
        );

    const dateInput =
        document.getElementById(
            "appointmentDate"
        );

    const timeInput =
        document.getElementById(
            "appointmentTime"
        );

    const messageInput =
        document.getElementById(
            "appointmentMessage"
        );

    const result =
        document.getElementById(
            "appointmentResult"
        );


    /* =========================================
       AUTO-FILL LOGGED-IN USER
    ========================================== */

    const currentUser =
        typeof getStoredUser === "function"
            ? getStoredUser()
            : null;


    if (currentUser) {

        if (nameInput && currentUser.name) {

            nameInput.value =
                currentUser.name;

        }


        if (emailInput && currentUser.email) {

            emailInput.value =
                currentUser.email;

        }

    }


    /* =========================================
       MINIMUM DATE
    ========================================== */

    if (dateInput) {

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        dateInput.min =
            `${year}-${month}-${day}`;

    }


    /* =========================================
       CLEAR ERROR
    ========================================== */

    function clearAppointmentErrors() {

        document
            .querySelectorAll(
                ".appointment-field small"
            )
            .forEach(
                element => {

                    element.textContent = "";

                }
            );

    }


    /* =========================================
       SHOW ERROR
    ========================================== */

    function setAppointmentError(
        id,
        text
    ) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                text;

        }

    }


    /* =========================================
       SUBMIT
    ========================================== */

    appointmentForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            clearAppointmentErrors();


            if (result) {

                result.className =
                    "appointment-result";

                result.textContent =
                    "";

            }


            const name =
                nameInput.value.trim();

            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const phone =
                phoneInput.value.trim();

            const car =
                carInput.value;

            const date =
                dateInput.value;

            const time =
                timeInput.value;

            const message =
                messageInput.value.trim();


            let valid = true;


            /* NAME */

            if (name.length < 2) {

                setAppointmentError(
                    "appointmentNameError",
                    "Please enter your full name."
                );

                valid = false;

            }


            /* EMAIL */

            if (
                typeof isValidEmail ===
                "function"
            ) {

                if (!isValidEmail(email)) {

                    setAppointmentError(
                        "appointmentEmailError",
                        "Please enter a valid email address."
                    );

                    valid = false;

                }

            } else {

                if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        .test(email)
                ) {

                    setAppointmentError(
                        "appointmentEmailError",
                        "Please enter a valid email address."
                    );

                    valid = false;

                }

            }


            /* PHONE */

            const phoneDigits =
                phone.replace(
                    /\D/g,
                    ""
                );


            if (phoneDigits.length < 10) {

                setAppointmentError(
                    "appointmentPhoneError",
                    "Please enter a valid phone number."
                );

                valid = false;

            }


            /* CAR */

            if (!car) {

                setAppointmentError(
                    "appointmentCarError",
                    "Please select a vehicle."
                );

                valid = false;

            }


            /* DATE */

            if (!date) {

                setAppointmentError(
                    "appointmentDateError",
                    "Please select a preferred date."
                );

                valid = false;

            }


            /* TIME */

            if (!time) {

                setAppointmentError(
                    "appointmentTimeError",
                    "Please select a preferred time."
                );

                valid = false;

            }


            if (!valid) {

                if (result) {

                    result.className =
                        "appointment-result error";

                    result.textContent =
                        "Please correct the highlighted fields.";

                }

                return;

            }


            /* =====================================
               SAVE APPOINTMENT
            ====================================== */

            const appointment = {

                id:
                    "appointment-" +
                    Date.now(),

                name,

                email,

                phone,

                car,

                date,

                time,

                message,

                createdAt:
                    new Date().toISOString()

            };


            let appointments = [];


            try {

                appointments =
                    JSON.parse(
                        localStorage.getItem(
                            "premiumMotorsAppointments"
                        )
                    ) || [];

            } catch (error) {

                appointments = [];

            }


            appointments.push(
                appointment
            );


            localStorage.setItem(
                "premiumMotorsAppointments",
                JSON.stringify(
                    appointments
                )
            );


            /* =====================================
               SUCCESS
            ====================================== */

            if (result) {

                result.className =
                    "appointment-result success";

                result.innerHTML = `
                    <strong>
                        REQUEST RECEIVED
                    </strong>
                    <br>
                    Your test drive request for
                    <strong>${car}</strong>
                    has been recorded.
                    Our showroom team can contact you
                    regarding the selected appointment.
                `;

            }


            appointmentForm.reset();


            /* Restore logged-in user */

            if (currentUser) {

                if (
                    nameInput &&
                    currentUser.name
                ) {

                    nameInput.value =
                        currentUser.name;

                }


                if (
                    emailInput &&
                    currentUser.email
                ) {

                    emailInput.value =
                        currentUser.email;

                }

            }

        }
    );

})();

/* =========================================================
   STEP 15 — PREMIUM AI CAR ASSISTANT
========================================================= */

const aiFloatingButton =
    document.getElementById("aiFloatingButton");

const aiAssistant =
    document.getElementById("aiAssistant");

const aiAssistantClose =
    document.getElementById("aiAssistantClose");

const aiAssistantBackdrop =
    document.getElementById("aiAssistantBackdrop");

const aiChatMessages =
    document.getElementById("aiChatMessages");

const aiChatForm =
    document.getElementById("aiChatForm");

const aiChatInput =
    document.getElementById("aiChatInput");

const aiQuickButtons =
    document.querySelectorAll(".ai-quick-btn");


/* =========================================================
   OPEN AI
========================================================= */

function openAIAssistant() {

    if (!aiAssistant) {
        return;
    }

    aiAssistant.classList.add("active");

    aiAssistant.setAttribute(
        "aria-hidden",
        "false"
    );

    if (aiChatInput) {
        setTimeout(() => {
            aiChatInput.focus();
        }, 300);
    }

}

/* =========================================================
   NAVBAR AI BUTTON
========================================================= */

const aiNavButton =
    document.getElementById("aiNavButton");

if (aiNavButton) {

    aiNavButton.addEventListener(
        "click",
        openAIAssistant
    );

}


/* =========================================================
   CLOSE AI
========================================================= */

function closeAIAssistant() {

    if (!aiAssistant) {
        return;
    }

    aiAssistant.classList.remove("active");

    aiAssistant.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   OPEN / CLOSE EVENTS
========================================================= */

if (aiFloatingButton) {

    aiFloatingButton.addEventListener(
        "click",
        openAIAssistant
    );

}

if (aiAssistantClose) {

    aiAssistantClose.addEventListener(
        "click",
        closeAIAssistant
    );

}

if (aiAssistantBackdrop) {

    aiAssistantBackdrop.addEventListener(
        "click",
        closeAIAssistant
    );

}


/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            aiAssistant &&
            aiAssistant.classList.contains("active")
        ) {

            closeAIAssistant();

        }

    }
);


/* =========================================================
   ADD USER MESSAGE
========================================================= */

function addAIUserMessage(text) {

    if (!aiChatMessages) {
        return;
    }

    const message =
        document.createElement("div");

    message.className =
        "ai-message ai-message-user";

    message.innerHTML = `

        <div class="ai-message-label">
            YOU
        </div>

        <div class="ai-message-bubble">
            ${escapeAIHTML(text)}
        </div>

    `;

    aiChatMessages.appendChild(message);

    scrollAIChat();

}


/* =========================================================
   ADD AI MESSAGE
========================================================= */

function addAIMessage(text) {

    if (!aiChatMessages) {
        return;
    }

    const message =
        document.createElement("div");

    message.className =
        "ai-message ai-message-bot";

    message.innerHTML = `

        <div class="ai-message-label">
            PREMIUM AI
        </div>

        <div class="ai-message-bubble">
            ${text}
        </div>

    `;

    aiChatMessages.appendChild(message);

    scrollAIChat();

}


/* =========================================================
   TYPING MESSAGE
========================================================= */

function showAITyping() {

    if (!aiChatMessages) {
        return;
    }

    const typing =
        document.createElement("div");

    typing.id =
        "aiTypingMessage";

    typing.className =
        "ai-message ai-message-bot";

    typing.innerHTML = `

        <div class="ai-message-label">
            PREMIUM AI
        </div>

        <div class="ai-message-bubble">

            <span class="ai-typing">

                <span></span>
                <span></span>
                <span></span>

            </span>

        </div>

    `;

    aiChatMessages.appendChild(typing);

    scrollAIChat();

}


/* =========================================================
   REMOVE TYPING
========================================================= */

function removeAITyping() {

    const typing =
        document.getElementById(
            "aiTypingMessage"
        );

    if (typing) {
        typing.remove();
    }

}


/* =========================================================
   SCROLL CHAT
========================================================= */

function scrollAIChat() {

    if (!aiChatMessages) {
        return;
    }

    aiChatMessages.scrollTop =
        aiChatMessages.scrollHeight;

}


/* =========================================================
   BASIC HTML ESCAPE
========================================================= */

function escapeAIHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   AI DATA HELPERS
========================================================= */

function findAICar(text) {

    if (
        typeof carCollection === "undefined"
    ) {
        return null;
    }

    const query =
        text.toLowerCase();

    return carCollection.find(car => {

        const fullName =
            `${car.brand} ${car.model}`
            .toLowerCase();

        return (
            query.includes(
                car.brand.toLowerCase()
            ) ||
            query.includes(
                car.model.toLowerCase()
            ) ||
            query.includes(fullName)
        );

    });

}


/* =========================================================
   AI RESPONSE ENGINE
========================================================= */

function generateAIResponse(question) {

    const text =
        question
            .toLowerCase()
            .trim();


    if (!text) {

        return "Please ask me something about our vehicles.";

    }


    if (
        text.includes("highest horsepower") ||
        text.includes("most horsepower") ||
        text.includes("powerful")
    ) {

        const sorted =
            [...carCollection]
                .sort(
                    (a, b) =>
                        b.horsepowerValue -
                        a.horsepowerValue
                );

        const car =
            sorted[0];

        return `
            <strong>${car.brand} ${car.model}</strong>
            currently leads our collection with
            <strong>${car.horsepower}</strong>.

            <br><br>

            It reaches 0–100 km/h in
            <strong>${car.acceleration}</strong>
            and has a top speed of
            <strong>${car.topSpeed}</strong>.
        `;

    }


    if (
        text.includes("best") &&
        (
            text.includes("performance") ||
            text.includes("fast")
        )
    ) {

        const sorted =
            [...carCollection]
                .sort(
                    (a, b) =>
                        b.horsepowerValue -
                        a.horsepowerValue
                );

        const car =
            sorted[0];

        return `
            For outright performance,
            I would start with
            <strong>${car.brand} ${car.model}</strong>.

            <br><br>

            Power:
            <strong>${car.horsepower}</strong>

            <br>

            0–100 km/h:
            <strong>${car.acceleration}</strong>

            <br>

            Top speed:
            <strong>${car.topSpeed}</strong>
        `;

    }


    if (
        text.includes("electric") ||
        text.includes("ev")
    ) {

        const electricCars =
            carCollection.filter(
                car =>
                    car.fuel === "electric"
            );

        if (electricCars.length) {

            const car =
                electricCars[0];

            return `
                For a pure electric experience,
                consider the
                <strong>${car.brand} ${car.model}</strong>.

                <br><br>

                It produces
                <strong>${car.horsepower}</strong>
                and uses an
                <strong>electric powertrain</strong>.
            `;

        }

    }


    if (
        text.includes("ferrari") &&
        text.includes("lamborghini")
    ) {

        const ferrari =
            carCollection.find(
                car =>
                    car.brand === "Ferrari"
            );

        const lambo =
            carCollection.find(
                car =>
                    car.brand === "Lamborghini"
            );

        if (ferrari && lambo) {

            return `
                <strong>Ferrari 296 GTB</strong>
                focuses on a refined hybrid
                performance experience.

                <br><br>

                <strong>Lamborghini Revuelto</strong>
                delivers a more extreme
                performance character.

                <br><br>

                Ferrari:
                <strong>${ferrari.horsepower}</strong>

                <br>

                Lamborghini:
                <strong>${lambo.horsepower}</strong>

                <br><br>

                Choose Ferrari for a more
                sophisticated GT-oriented experience;
                choose Lamborghini for a more
                aggressive supercar character.
            `;

        }

    }


    if (
        text.includes("under 2 crore") ||
        text.includes("below 2 crore") ||
        text.includes("under ₹2 crore")
    ) {

        const cars =
            carCollection.filter(
                car =>
                    car.priceValue < 2
            );

        if (cars.length) {

            return `
                Based on the current collection,
                these vehicles are below ₹2 crore:

                <br><br>

                ${cars
                    .map(
                        car =>
                            `• <strong>${car.brand} ${car.model}</strong>
                            — ${car.price}`
                    )
                    .join("<br>")}
            `;

        }

    }


    const requestedCar =
        findAICar(text);

    if (requestedCar) {

        return `
            <strong>
                ${requestedCar.brand}
                ${requestedCar.model}
            </strong>

            <br><br>

            Price:
            <strong>${requestedCar.price}</strong>

            <br>

            Power:
            <strong>${requestedCar.horsepower}</strong>

            <br>

            0–100 km/h:
            <strong>${requestedCar.acceleration}</strong>

            <br>

            Top speed:
            <strong>${requestedCar.topSpeed}</strong>

            <br>

            Fuel:
            <strong>
                ${formatCarValue(requestedCar.fuel)}
            </strong>
        `;

    }


    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
    ) {

        return `
            Welcome to <strong>Premium Motors</strong>.

            <br><br>

            Ask me about performance,
            pricing, brands, electric cars
            or vehicle specifications.
        `;

    }


    return `
        I can help you with:

        <br><br>

        • Vehicle specifications<br>
        • Performance<br>
        • Price<br>
        • Electric vehicles<br>
        • Brand comparisons<br>
        • Car recommendations

        <br><br>

        Try asking:
        <strong>"Which car has the highest horsepower?"</strong>
    `;

}


/* =========================================================
   SEND MESSAGE
========================================================= */

function processAIQuestion(question) {

    const cleanQuestion =
        question.trim();

    if (!cleanQuestion) {
        return;
    }

    addAIUserMessage(
        cleanQuestion
    );

    if (aiChatInput) {
        aiChatInput.value = "";
    }

    showAITyping();

    setTimeout(
        () => {

            removeAITyping();

            const response =
                generateAIResponse(
                    cleanQuestion
                );

            addAIMessage(
                response
            );

        },
        650
    );

}


/* =========================================================
   FORM SUBMIT
========================================================= */

if (aiChatForm) {

    aiChatForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            processAIQuestion(
                aiChatInput.value
            );

        }
    );

}


/* =========================================================
   QUICK QUESTIONS
========================================================= */

aiQuickButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const question =
                button.dataset.question;

            processAIQuestion(
                question
            );

        }
    );

});

/* =========================================================
   PREMIUM AI ASSISTANT — STEP 1
========================================================= */

const premiumAIAssistant =
    document.getElementById("aiAssistant");

const aiCloseButton =
    document.getElementById("aiCloseButton");

const aiUserInput =
    document.getElementById("aiUserInput");

const aiSendButton =
    document.getElementById("aiSendButton");

const aiSuggestionButtons =
    document.querySelectorAll(".ai-suggestion");


/* =========================================================
   OPEN AI
========================================================= */

function openPremiumAI() {

    if (!premiumAIAssistant) {
        return;
    }

    premiumAIAssistant.classList.add("active");

    premiumAIAssistant.setAttribute(
        "aria-hidden",
        "false"
    );

    setTimeout(() => {

        if (aiUserInput) {
            aiUserInput.focus();
        }

    }, 250);
}


/* =========================================================
   CLOSE AI
========================================================= */

function closePremiumAI() {

    if (!premiumAIAssistant) {
        return;
    }

    premiumAIAssistant.classList.remove(
        "active"
    );

    premiumAIAssistant.setAttribute(
        "aria-hidden",
        "true"
    );
}


/* =========================================================
   CONNECT AI BUTTONS
========================================================= */

/*
   These selectors cover both the
   top-right AI button and the
   bottom-right Premium AI button.
*/

const premiumAIButtons =
    document.querySelectorAll(
        "#aiNavButton, #mobileAiButton, .premium-ai-button"
    );


premiumAIButtons.forEach(button => {

    button.addEventListener(
        "click",
        event => {

            event.preventDefault();

            closeMobileMenu();

            openPremiumAI();

        }
    );

});


/* =========================================================
   CLOSE BUTTON
========================================================= */

if (aiCloseButton) {

    aiCloseButton.addEventListener(
        "click",
        closePremiumAI
    );

}


/* =========================================================
   BACKDROP CLOSE
========================================================= */

if (premiumAIAssistant) {

    premiumAIAssistant.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                premiumAIAssistant
            ) {

                closePremiumAI();

            }

        }
    );

}


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            premiumAIAssistant &&
            premiumAIAssistant.classList.contains(
                "active"
            )
        ) {

            closePremiumAI();

        }

    }
);


/* =========================================================
   ADD CHAT MESSAGE
========================================================= */

function addAIMessage(
    message,
    sender = "bot"
) {

    if (!aiChatMessages) {
        return;
    }

    const messageElement =
        document.createElement("div");

    messageElement.className =
        sender === "user"
            ? "ai-message ai-message-user"
            : "ai-message ai-message-bot";


    messageElement.innerHTML = `

        ${
            sender === "bot"
                ? `
                    <div class="ai-message-icon">
                        ✦
                    </div>
                `
                : ""
        }

        <div class="ai-message-content">

            ${
                sender === "bot"
                    ? `<strong>PREMIUM AI</strong>`
                    : ""
            }

            <p></p>

        </div>

    `;


    const paragraph =
    messageElement.querySelector("p");

if (sender === "bot") {
    paragraph.innerHTML = message;
} else {
    paragraph.textContent = message;
}


    aiChatMessages.appendChild(
        messageElement
    );


    aiChatMessages.scrollTop =
        aiChatMessages.scrollHeight;
}


/* =========================================================
   SEND MESSAGE
========================================================= */

/* =========================================================
   PREMIUM AI — CAR INTELLIGENCE
========================================================= */

function generateCarAIResponse(question) {

    const q = question
        .toLowerCase()
        .trim();


    if (!carCollection || carCollection.length === 0) {

        return "The vehicle collection is currently unavailable.";
    }


    /* =========================================
       HIGHEST HORSEPOWER
    ========================================= */

    if (
        q.includes("highest horsepower") ||
        q.includes("most horsepower") ||
        q.includes("maximum horsepower") ||
        q.includes("most powerful")
    ) {

        const car =
            [...carCollection]
                .sort(
                    (a, b) =>
                        b.horsepowerValue -
                        a.horsepowerValue
                )[0];

        return `${car.brand} ${car.model} has the highest horsepower in our collection with ${car.horsepower}.`;
    }


    /* =========================================
       FASTEST CAR
    ========================================= */

    if (
        q.includes("fastest") ||
        q.includes("highest top speed") ||
        q.includes("top speed")
    ) {

        const car =
            [...carCollection]
                .sort(
                    (a, b) =>
                        parseInt(
                            b.topSpeed
                        ) -
                        parseInt(
                            a.topSpeed
                        )
                )[0];

        return `${car.brand} ${car.model} is the fastest vehicle in our current collection, with a top speed of ${car.topSpeed}.`;
    }


    /* =========================================
       CHEAPEST CAR
    ========================================= */

    if (
        q.includes("cheapest") ||
        q.includes("lowest price") ||
        q.includes("most affordable")
    ) {

        const car =
            [...carCollection]
                .sort(
                    (a, b) =>
                        a.priceValue -
                        b.priceValue
                )[0];

        return `${car.brand} ${car.model} is currently the most affordable vehicle in our collection at ${car.price}.`;
    }


    /* =========================================
       ELECTRIC CARS
    ========================================= */

    if (
        q.includes("electric") ||
        q.includes("ev")
    ) {

        const cars =
            carCollection.filter(
                car =>
                    car.fuel === "electric"
            );

        if (cars.length === 0) {

            return "There are currently no fully electric vehicles in the collection.";
        }

        return `Our electric collection includes: ${cars
            .map(
                car =>
                    `${car.brand} ${car.model}`
            )
            .join(", ")}.`;
    }


    /* =========================================
       HYBRID CARS
    ========================================= */

    if (
        q.includes("hybrid")
    ) {

        const cars =
            carCollection.filter(
                car =>
                    car.fuel === "hybrid"
            );

        return `Our hybrid vehicles include: ${cars
            .map(
                car =>
                    `${car.brand} ${car.model}`
            )
            .join(", ")}.`;
    }


    /* =========================================
       SPORTS CARS
    ========================================= */

    if (
        q.includes("sports car") ||
        q.includes("sports cars")
    ) {

        const cars =
            carCollection.filter(
                car =>
                    car.category === "sports"
            );

        return `Our sports collection includes: ${cars
            .map(
                car =>
                    `${car.brand} ${car.model}`
            )
            .join(", ")}.`;
    }


    /* =========================================
       AWD
    ========================================= */

    if (
        q.includes("awd") ||
        q.includes("all wheel drive")
    ) {

        const cars =
            carCollection.filter(
                car =>
                    car.drive === "awd"
            );

        return `The AWD vehicles currently available are: ${cars
            .map(
                car =>
                    `${car.brand} ${car.model}`
            )
            .join(", ")}.`;
    }


    /* =========================================
       CAR-SPECIFIC QUESTIONS
    ========================================= */

    const matchedCar =
        carCollection.find(car => {

            const fullName =
                `${car.brand} ${car.model}`
                    .toLowerCase();

            return q.includes(
                fullName
            ) ||
            q.includes(
                car.brand.toLowerCase()
            ) ||
            q.includes(
                car.model.toLowerCase()
            );

        });


    if (matchedCar) {

        return `${matchedCar.brand} ${matchedCar.model}: ${matchedCar.horsepower}, ${matchedCar.acceleration} 0-100 km/h, top speed ${matchedCar.topSpeed}, priced at ${matchedCar.price}.`;
    }


    /* =========================================
       COLLECTION
    ========================================= */

    if (
        q.includes("collection") ||
        q.includes("cars") ||
        q.includes("vehicles") ||
        q.includes("show me")
    ) {

        return `Premium Motors currently features ${carCollection.length} vehicles: ${carCollection
            .map(
                car =>
                    `${car.brand} ${car.model}`
            )
            .join(", ")}.`;
    }


    /* =========================================
       GREETING
    ========================================= */

    if (
        q.includes("hello") ||
        q.includes("hi") ||
        q.includes("hey")
    ) {

        return "Welcome to Premium Motors. Ask me about performance, pricing, drivetrain, fuel type, or any vehicle in our collection.";
    }


    /* =========================================
       DEFAULT
    ========================================= */

    return "I can help you with our car collection. Try asking: Which car is fastest? Which has the highest horsepower? Which car is cheapest? Show me electric cars. Or ask about a specific vehicle.";
}

function sendAIMessage() {

    if (!aiUserInput) {
        return;
    }


    const question =
        aiUserInput.value.trim();


    if (!question) {
        return;
    }


    addAIMessage(
        question,
        "user"
    );


    aiUserInput.value = "";


    /*
       Temporary response.
       Step 2 will replace this with
       the real automotive intelligence.
    */

    setTimeout(() => {

    const response =
        generateCarAIResponse(question);

    addAIMessage(response);

}, 400);
}


/* =========================================================
   SEND BUTTON
========================================================= */

if (aiSendButton) {

    aiSendButton.addEventListener(
        "click",
        sendAIMessage
    );

}


/* =========================================================
   ENTER KEY
========================================================= */

if (aiUserInput) {

    aiUserInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                sendAIMessage();

            }

        }
    );

}


/* =========================================================
   SUGGESTED QUESTIONS
========================================================= */

aiSuggestionButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const question =
                button.dataset.question;


            if (!question) {
                return;
            }


            if (aiUserInput) {

                aiUserInput.value =
                    question;

                sendAIMessage();

            }

        }
    );

});