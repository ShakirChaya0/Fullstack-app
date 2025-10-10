import { Skeleton } from "@mui/material";

export default function OrdersSkeleton() {
    return (
        <section className="flex flex-1 flex-col justify-center items-center w-full p-8 gap-y-8">
            
            <header className="w-full flex justify-center">
                <Skeleton variant="text" width="25%" height={40} />
            </header>

            <div className="w-full grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg p-5 flex flex-col border-t-4 border-[#0F766E]"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <Skeleton variant="text" width="50%" height={28} />
                            <Skeleton
                                variant="rounded"
                                width={60}
                                height={28}
                                className="rounded-full"
                            />
                        </div>

                        <div className="space-y-3 mb-4 border-t border-b border-gray-200 py-3">
                            <div className="flex items-center gap-2">
                                <Skeleton variant="text" width="70%" height={20} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton variant="text" width="50%" height={20} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton variant="text" width="60%" height={20} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <Skeleton variant="rounded" width="60%" height={28} />
                        </div>

                        <footer className="mt-auto">
                            <div className="flex justify-between mb-1">
                                <Skeleton variant="text" width="25%" height={18} />
                                <Skeleton variant="text" width="10%" height={18} />
                            </div>
                            <Skeleton variant="rounded" width="100%" height={10} />
                        </footer>
                    </div>
                ))}
            </div>
        </section>
    );
}