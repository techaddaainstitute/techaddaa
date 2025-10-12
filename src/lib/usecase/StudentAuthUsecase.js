
import { StudentAuthDataSource } from "../datasource/StudentAuthDatasource";

export const StudentAuthUsecase = {
    // return bool
    async sendOtp(phone) {
        return await StudentAuthDataSource.sendOtp(phone);
    },

    async verifyAndLogin(phone, otp) {
        const { user } = await StudentAuthDataSource.verifyOtp(phone, otp);
        const userId = user?.id;

        if (!userId) throw new Error("OTP verification failed");
        const existingProfile = await StudentAuthDataSource.getProfile(userId);

        let result;
        if (existingProfile) {
            result = { user, isNew: false, profile: existingProfile };
        } else if (!additionalInfo) {
            result = { user, isNew: true, profile: null };
        } else {
            const profile = await StudentAuthDataSource.createProfile({
                id: userId,
                name: additionalInfo.name,
                email: additionalInfo.email,
                phone,
                dob: additionalInfo.dob,
            });
            result = { user, isNew: false, profile };
        }

        // Save to local storage after successful login
        if (result.profile) {
            StudentAuthDataSource.saveUserToStorage(result.user, result.profile);
        }

        return result;
    },

    async logout() {
        // Clear local storage and logout from Supabase
        return await StudentAuthDataSource.logout();
    },

    async restoreFromStorage() {
        try {
            const storedData = StudentAuthDataSource.getUserFromStorage();

            if (!storedData) {
                return { success: false, error: 'No stored user data found' };
            }

            // Verify the user is still valid with Supabase
            const currentUser = await StudentAuthDataSource.getCurrentUser();

            if (!currentUser || currentUser.id !== storedData.user.id) {
                // User session is invalid, clear storage
                StudentAuthDataSource.clearUserFromStorage();
                return { success: false, error: 'Stored user session is invalid' };
            }

            // If we have a profile in storage, return it
            if (storedData.profile) {
                return {
                    success: true,
                    user: storedData.user,
                    profile: storedData.profile
                };
            }

            // If no profile in storage, try to fetch it
            try {
                const profile = await StudentAuthDataSource.getProfile(storedData.user.id);
                if (profile) {
                    // Update storage with the fetched profile
                    StudentAuthDataSource.saveUserToStorage(storedData.user, profile);
                    return {
                        success: true,
                        user: storedData.user,
                        profile
                    };
                }
            } catch (profileError) {
                console.warn('Could not fetch profile:', profileError);
            }

            // Return user without profile
            return {
                success: true,
                user: storedData.user,
                profile: null
            };

        } catch (error) {
            console.error('Error restoring from storage:', error);
            StudentAuthDataSource.clearUserFromStorage();
            return { success: false, error: error.message };
        }
    },
};
