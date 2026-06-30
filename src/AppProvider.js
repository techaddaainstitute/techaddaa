import { StudentAuthProvider } from './context/StudentAuthContext';
import { CourseProvider } from './context/CourseContext';
import { StudentDashboardProvider } from './context/StudentDashboardContext';
import { PaymentProvider } from './context/PaymentContext';
import { CertificateProvider } from './context/CertificateContext';

export const AppProvider = ({ children }) => (
    <StudentAuthProvider>
        <CourseProvider>
            <StudentDashboardProvider>
                <PaymentProvider>
                    <CertificateProvider>
                        {children}
                    </CertificateProvider>
                </PaymentProvider>
            </StudentDashboardProvider>
        </CourseProvider>
    </StudentAuthProvider>
);
