import Skeleton from "@mui/material/Skeleton";

export default function SkeletonBody () {
    return (
        <div className="scroll-mt-55">
            <Skeleton
              variant="rectangular"
              sx={{ bgcolor: "grey.700", height: 2, width: "100%", marginY: 2 }}
            />
            <div className="grid grid-cols-1 col-start-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                  <>
                      <Skeleton
                        key={i}
                        variant="rectangular"
                        sx={{
                          bgcolor: "grey.700",
                          minWidth: 200,
                          maxWidth: 680,
                          minHeight: 110,
                          borderRadius: "4px",
                          marginY: 1,
                        }}
                      />
                  </>
              ))}
            </div>
        </div>
  )
}