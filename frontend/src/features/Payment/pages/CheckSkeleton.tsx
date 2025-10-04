import { Box, Skeleton } from "@mui/material";

export default function CheckSKeleton() {
    return (
        <section className="w-full bg-[var(--background-200)] flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full flex flex-col justify-center max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">

                <header className="text-center border-b-2 border-dashed border-slate-300  pb-6 mb-6">
                    <Skeleton variant="text" sx={{ fontSize: '2rem', margin: 'auto' }} width="75%" />
                    <Skeleton variant="text" sx={{ fontSize: '1rem', margin: 'auto', marginTop: '1rem' }} width="50%" />
                    <Skeleton variant="text" sx={{ fontSize: '1rem', margin: 'auto', marginTop: '0.5rem' }} width="33%" />
                </header>

                <section className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-6 pb-6 border-b-2 border-dashed border-slate-300 ">
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="80%" height={24} />
                    <div className="col-span-2">
                        <Skeleton variant="text" width="50%" height={24} />
                    </div>
                </section>

                <section className="space-y-4 mb-6">
                    {[...Array(5)].map((_, index) => (
                        <Box key={index} className="flex justify-between items-start">
                            <Box className="w-3/5 pr-4">
                                <Skeleton variant="text" width="100%" height={24} />
                                <Skeleton variant="text" width="50%" height={20} />
                            </Box>
                            <Skeleton variant="text" width="25%" height={24} />
                        </Box>
                    ))}
                </section>
                
                <section className="pt-6 border-t-2 border-dashed border-slate-300 ">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Skeleton variant="text" width="25%" height={24} />
                            <Skeleton variant="text" width="33%" height={24} />
                        </div>
                        <div className="flex justify-between">
                            <Skeleton variant="text" width="33%" height={24} />
                            <Skeleton variant="text" width="33%" height={24} />
                        </div>
                        <div className="flex justify-between pt-2 mt-2 border-t border-slate-300 ">
                            <Skeleton variant="text" width="33%" height={48} />
                            <Skeleton variant="text" width="40%" height={48} />
                        </div>
                    </div>
                </section>

                <footer className="mt-8 pt-6 border-t border-slate-200 ">
                    <Skeleton variant="text" sx={{ margin: 'auto' }} width="50%" height={28} />
                    <Skeleton variant="text" sx={{ margin: 'auto', marginTop: '0.5rem' }} width="75%" height={20} />
                </footer>
            </div>
        </section>
    );
};
