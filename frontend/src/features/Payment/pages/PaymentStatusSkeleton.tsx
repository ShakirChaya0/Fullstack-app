import { Box, Skeleton } from "@mui/material";

export default function PaymentStatusSkeleton() {
    return (
        <section className="w-full bg-[var(--background-200)] flex flex-col items-center justify-center p-4">
            <div className="w-full flex flex-col justify-center max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            
                <Box className="mb-6 flex justify-center">
                    <Skeleton variant="circular" width={96} height={96} />
                </Box>

                <Skeleton 
                    variant="text" 
                    sx={{ fontSize: '2.25rem', margin: 'auto' }} 
                    width="60%" 
                />
                
                <Box className="mt-4 mb-8">
                    <Skeleton variant="text" sx={{ fontSize: '1rem', margin: 'auto' }} width="90%" />
                    <Skeleton variant="text" sx={{ fontSize: '1rem', margin: 'auto', marginTop: '0.5rem' }} width="80%" />
                </Box>
                
                <Box className="flex justify-center">
                    <Skeleton variant="rounded" width={160} height={48} />
                </Box>

            </div>
        </section>
    );
};