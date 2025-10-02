// Add this debug code to StudentDashboard.js temporarily to check user context

// Add this inside the loadDashboardData function, right after the user check:
console.log('🔍 DEBUG: User context in StudentDashboard:');
console.log('- loading:', loading);
console.log('- user:', user);
console.log('- user.id:', user?.id);
console.log('- user.email:', user?.email);

// Add this right after the FeesUsecase call:
console.log('🔍 DEBUG: Fees result:');
console.log('- feesResult.success:', feesResult.success);
console.log('- feesResult.data:', feesResult.data);
console.log('- feesResult.error:', feesResult.error);

// Add this in the render section to check feesData state:
console.log('🔍 DEBUG: Fees state in render:');
console.log('- feesData:', feesData);
console.log('- feesData?.fees:', feesData?.fees);
console.log('- feesData?.fees?.length:', feesData?.fees?.length);