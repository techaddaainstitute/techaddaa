// src/data/authDataSource.js
import supabase from "../supabase";
import { toast } from 'react-toastify';

export const StudentAuthDataSource = {
    async sendOtp(phone) {
        try {
            const otp = this.generateOtp();

            // Call external OTP API
            this.callOtpApi(phone, otp);
            await this.storeOtpInDatabase(phone, otp);
            console.log(`📱 OTP sent to ${phone} via API`);
            return true;

        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error('Failed to send OTP. Please try again.', {
                position: "top-center",
                autoClose: 5000,
            });
            return false;
        }
    },
    async verifyOtp(phone, otp) {
        try {
            // First check OTP from database
            const dbOtpData = await this.getOtpFromDatabase(phone, otp);

            if (!dbOtpData) {

                throw new Error('Invalid OTP. Please check and try again.');

            }

            // Clear used OTP from localStorage


            let user = await this.studentByPhone(phone);
            if (user) {
                this.saveUserToStorage(user);
            }

            let response = {
                user: user,
                otpVerify: true
            }
            return response;
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

    // Call external OTP API
    async callOtpApi(phone, otp) {
        try {
            const apiUrl = `https://otp.indiahost.org/send_otp.php?mobile=+91${phone}&otp=${otp}&user=techaddaainstitute@gmail.com&key=OJWOSUWGUYWXIUWXIWHIOWLDUGWIGWUI`;

            const response = await fetch(apiUrl, {
                method: 'GET',
            });

            // Check if the request was successful
            if (response.ok) {
                const result = await response.text(); // API might return text instead of JSON
                console.log('OTP API Response:', result);
                return { success: true, data: result };
            } else {
                console.error('OTP API Error - Status:', response.status);
                return { success: false, error: `HTTP ${response.status}` };
            }
        } catch (error) {
            console.error('Error calling OTP API:', error);
            return { success: false, error: error.message };
        }
    },

    // Store OTP in Supabase database
    async storeOtpInDatabase(phone, otp) {
        try {
            const { data: existingOtp, error: checkError } = await supabase
                .from('otps')
                .select('id')
                .eq('phone', phone)
                .maybeSingle();

            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                console.error('Error checking existing OTP:', checkError);
                throw new Error(checkError.message);
            }

            let result;
            if (existingOtp) {
                const { data, error } = await supabase
                    .from('otps')
                    .update({
                        otp: otp,
                        created_at: new Date().toISOString()
                    })
                    .eq('id', existingOtp.id);

                if (error) {
                    console.error('Error updating OTP in database:', error);
                    throw new Error(error.message);
                }
                result = data;
            } else {
                // Insert new OTP
                const { data, error } = await supabase
                    .from('otps')
                    .insert([
                        {
                            phone: phone,
                            otp: otp,
                        }
                    ]);

                if (error) {
                    console.error('Error storing OTP in database:', error);
                    throw new Error(error.message);
                }
                result = data;
            }

            return result;
        } catch (error) {
            console.error('Error storing OTP in database:', error);
            throw error;
        }
    },

    // Get OTP from database for verification
    async getOtpFromDatabase(phone, otp) {
        try {
            const { data, error } = await supabase
                .from('otps')
                .select('*')
                .eq('phone', phone)
                .eq('otp', otp)
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error('Error getting OTP from database:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error getting OTP from database:', error);
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
