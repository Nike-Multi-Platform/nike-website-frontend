import axios from "axios";

const URL = `${process.env.REACT_APP_BACKEND_URL}/api/UserAccount/`;

export const RegisterUser = async (payload) => {
    try {
        const url = URL + "register";
        console.log("url", url);
        const response = await axios.post(url, payload);
        return response.data;
    } catch (error) {
        console.log("Error when register", error);
        let errorMessage;
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = error.response.data.message;
                    break;
                case 500:
                    errorMessage = "Server error.";
                    break;
                default:
                    errorMessage =
                        error.response.data.message || "An unexpected error occurred.";
            }
        } else {
            errorMessage = "Network error or server is unreachable.";
        }
        return {
            success: false,
            message: errorMessage,
            status: error.response?.status || 0,
        };
    }
}

export const LoginWithEmailPassword = async (payload) => {
    try {
        const url = URL + "login-with-email-password";
        const response = await axios.post(url, payload);
        return response.data;
    } catch (error) {
        console.log("Error when login", error);
        let errorMessage;
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = error.response.data.message;
                    break;
                case 404:
                    errorMessage = error.response.data.message;
                    break;
                case 500:
                    errorMessage = "Server error.";
                    break;
                default:
                    errorMessage =
                        error.response.data.message || "An unexpected error occurred.";
            }
        } else {
            errorMessage = "Network error or server is unreachable.";
        }
        return {
            success: false,
            message: errorMessage,
            status: error.response?.status || 0,
        };
    }
}

export const verifyUser = async (payload) => {
    try {
        const url = URL + "verify-id-token";
        const idToken = Array.isArray(payload.idToken) ? payload.idToken.join(".") : payload.idToken;
        const response = await axios.post(url, idToken, { 
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.log("Error when verify user", error);
        let errorMessage;
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = error.response.data.message;
                    break;
                case 404:
                    errorMessage = error.response.data.message;
                    break;
                case 500:
                    errorMessage = "Server error.";
                    break;
                default:
                    errorMessage =
                        error.response.data.message || "An unexpected error occurred.";
            }
        } else {
            errorMessage = "Network error or server is unreachable.";
        }
        return {
            success: false,
            message: errorMessage,
            status: error.response?.status || 0,
        };
    }
};

export const LogoutUser = async (payload) => {
    try {
        const url = URL + "logout";
        const response = await axios.post(url, payload);
        return response.data;
    } catch (error) {
        console.log("Error when logout", error);
        let errorMessage;
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = error.response.data.message;
                    break;
                case 500:
                    errorMessage = "Server error.";
                    break;
                default:
                    errorMessage =
                        error.response.data.message || "An unexpected error occurred.";
            }
        } else {
            errorMessage = "Network error or server is unreachable.";
        }
        return {
            success: false,
            message: errorMessage,
            status: error.response?.status || 0,
        };
    }
}

export const LoginGoogle = async (payload) => {
    console.log("payload", payload);
    try {
        const url = URL + "login-with-google";
        const idToken = Array.isArray(payload.idToken) ? payload.idToken.join(".") : payload.idToken;
        const response = await axios.post(url, idToken, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.log("Error when login with google", error);
        let errorMessage;
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = error.response.data.message;
                    break;
                case 500:
                    errorMessage = "Server error.";
                    break;
                default:
                    errorMessage =
                        error.response.data.message || "An unexpected error occurred.";
            }
        } else {
            errorMessage = "Network error or server is unreachable.";
        }
        return {
            success: false,
            message: errorMessage,
            status: error.response?.status || 0,
        };
    }
}

export const updateProfile = async (payload) => {
    console.log("Check update profile payload", payload);
    try {
        const url = URL + "update-profile";
        const response = await axios.post(url, payload);
        return response.data;
    } catch (error) {
        console.log("Error when update profile", error);
        let errorMessage;
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = error.response.data.message;
                    break;
                case 404:
                    errorMessage = error.response.data.message;
                    break;
                case 500:
                    errorMessage = "Server error.";
                    break;
                default:
                    errorMessage =
                        error.response.data.message || "An unexpected error occurred.";
            }
        } else {
            errorMessage = "Network error or server is unreachable.";
        }
        return {
            success: false,
            message: errorMessage,
            status: error.response?.status || 0,
        };
    }
}