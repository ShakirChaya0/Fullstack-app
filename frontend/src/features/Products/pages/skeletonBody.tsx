import { Skeleton } from "@mui/material";

export default function SkeletonBody () {
    return(
        <section className="flex-1 grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 p-4 w-full">
            <Skeleton
                sx={{ bgcolor: 'grey.700', height: "100%", borderRadius: 8 }}
                variant="rectangular"
            />
            <Skeleton 
                sx={{ bgcolor: 'grey.700', height: "60%", borderRadius: 8 }}
                variant="rectangular"
            />
        </section>
    )
}