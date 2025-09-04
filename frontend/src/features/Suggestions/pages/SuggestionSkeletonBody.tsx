import { Skeleton } from "@mui/material";

export default function SuggestionSkeletonBody () {
    return(
        <section className="flex-1 flex flex-col items-center justify-center w-full p-4">
            <div className="flex flex-row flex-wrap gap-6 w-full max-w-7xl h-full">
                <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={286} height={236} />
                <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={286} height={236} />
                <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={286} height={236} />
                <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={286} height={236} />
                <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={286} height={236} />
                <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={286} height={236} />
                <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={286} height={236} />
                <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={286} height={236} />
                <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={286} height={236} />
                <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={286} height={236} />
                <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={286} height={236} />
                <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" width={286} height={236} />
            </div>
        </section>
    )
}