import { Skeleton } from "@mui/material";

export default function SuggestionSkeletonBody() {
    return (
        <section className="flex flex-1 flex-col w-full max-w-7xl mx-auto p-4 gap-y-8">
            
            <header className="flex justify-center">
                <Skeleton variant="text" sx={{ bgcolor: 'grey.300', fontSize: '2rem' }} width="20%" />
            </header>

            <div className="flex w-full flex-row items-center justify-between">
                <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={190} height={40} />
                
                <div className="flex flex-row items-center gap-x-4">
                    <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={140} height={40} />
                    <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={150} height={40} />
                </div>
            </div>

            <div className="flex h-full w-full flex-row flex-wrap justify-center gap-6">
                {Array.from(new Array(8)).map((_, index) => (
                    <Skeleton key={index} sx={{ bgcolor: 'grey.300' }} variant="rounded" width={286} height={236} />
                ))}
            </div>
        </section>
    );
}