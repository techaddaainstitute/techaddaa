// src/data/authDataSource.js
import supabase from "../supabase";
import { toast } from 'react-toastify';

export const StudentAuthDataSource = {
    async sendOtp(phone) {
        try {
            const otp = this.generateOtp();
            this.storeOtp(phone, otp);
            toast.success(`🔐 Development OTP: ${otp}`, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.log(`📱 OTP for ${phone}: ${otp}`);
            return true;
        } catch (error) {
            return false;
        }
    },
    async verifyOtp(phone, otp) {
        try {
            const storedOtpData = this.getStoredOtp();

            if (!storedOtpData) {
                throw new Error('OTP expired or not found. Please request a new OTP.');
            }

            if (storedOtpData.phone !== phone) {
                throw new Error('Phone number mismatch. Please request a new OTP.');
            }

            if (storedOtpData.otp !== otp) {
                throw new Error('Invalid OTP. Please check and try again.');
            }

            // Clear used OTP
            localStorage.removeItem('techaddaa_otp_data');
            let user = await this.studentByPhone(phone);
            if (user) {
                this.saveUserToStorage(user);
            }
            let respons = {
                user: user,
                otpVerify: true
            }
            return respons;
        } catch (error) {
            throw error;
        }
    },

    async registerUser({ name, email, phone, dob }) {
        console.log(name, email, phone, dob);
        try {
            await this.createStudent({
                name: name,
                email: email,
                phone: phone,
                dob: dob,
            });
            let data = await this.studentByPhone(phone);
            if (!data) throw new Error("Failed to create student profile");

            if (data) {
                this.saveUserToStorage(data);
            }
            return data;
        } catch (error) {
            throw error;
        }
    },


    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },


    // Store OTP in localStorage with expiration
    storeOtp(phone, otp) {
        const otpData = {
            phone,
            otp,
        };
        localStorage.setItem('techaddaa_otp_data', JSON.stringify(otpData));
    },

    // Get stored OTP data
    getStoredOtp() {
        try {
            const stored = localStorage.getItem('techaddaa_otp_data');
            if (!stored) return null;
            const otpData = JSON.parse(stored);
            if (Date.now() > otpData.expiresAt) {
                localStorage.removeItem('techaddaa_otp_data');
                return null;
            }
            return otpData;
        } catch (error) {
            console.error('Error getting stored OTP:', error);
            localStorage.removeItem('techaddaa_otp_data');
            return null;
        }
    },




    async getUser(userId) {
        const { data, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data;
    },

    // Fetch a student profile by phone number
    async studentByPhone(phone) {
        try {
            const { data, error } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("phone_number", phone)
                .eq("role", "student")
                .maybeSingle();

            if (error) throw new Error(error.message);
            return data; // returns the profile object or null if not found
        } catch (error) {
            console.error("Error fetching student by phone:", error);
            throw error;
        }
    },


    async createStudent({ name, email, phone, dob }) {
        const { data, error } = await supabase.from("user_profiles").insert([
            {
                id: this.generateUUID(),
                full_name: name,
                email,
                phone_number: phone,
                date_of_birth: dob,
                role: "student",
            },
        ]);
        if (error) throw new Error(error.message);
        return data;
    },


    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
        this.clearUserFromStorage();
        return true;
    },

    // Local Storage Functions
    saveUserToStorage(user) {
        try {
            localStorage.setItem('techaddaa_user', JSON.stringify(user));
            return true;
        } catch (error) {
            console.error('Error saving user to storage:', error);
            return false;
        }
    },

    getUserFromStorage() {
        try {
            const stored = localStorage.getItem('techaddaa_user');
            if (!stored) return null;
            return JSON.parse(stored);
        } catch (error) {
            console.error('Error getting user from storage:', error);
            this.clearUserFromStorage();
            return null;
        }
    },

    clearUserFromStorage() {
        try {
            localStorage.removeItem('techaddaa_user');
            return true;
        } catch (error) {
            console.error('Error clearing user from storage:', error);
            return false;
        }
    },


    generateUUID() {
        // Generate a proper UUID v4
        if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
            return window.crypto.randomUUID();
        } else {
            // Fallback UUID generation for older browsers
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    },
};
