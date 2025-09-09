import { Skeleton } from "@mui/material";

export default function SkeletonInstitution() {
    return(
        <section className="flex-1 flex flex-col items-center justify-center w-full p-4">
            <div className="flex flex-col w-full max-w-7xl h-full">
                <Skeleton
                    sx={{ bgcolor: 'grey.700', height: "100%", borderRadius: 8 }}
                    variant="rectangular"
                />
            </div>
        </section>
    )
}
