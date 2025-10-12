import { StudentAuthProvider } from './context/StudentAuthContext';
import { CourseProvider } from './context/CourseContext';
import { StudentDashboardProvider } from './context/StudentDashboardContext';
import { PaymentProvider } from './context/PaymentContext';

export const AppProvider = ({ children }) => (
    <StudentAuthProvider>
        <CourseProvider>
            <StudentDashboardProvider>
                <PaymentProvider>
                    {children}
                </PaymentProvider>
            </StudentDashboardProvider>
        </CourseProvider>
    </StudentAuthProvider>
);