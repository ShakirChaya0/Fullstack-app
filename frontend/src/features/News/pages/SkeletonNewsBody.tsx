import { Skeleton } from "@mui/material";

export default function SkeletonNewsBody () {
    return(
        <div className="w-full max-w-[1500px]  h-full min-h-[400px]">
            <Skeleton
                sx={{ bgcolor: 'grey.700', height: "100%" }}
                variant="rectangular"
            />
        </div>
    )
}