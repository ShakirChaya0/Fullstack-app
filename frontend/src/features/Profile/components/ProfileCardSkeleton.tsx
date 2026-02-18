import { Skeleton, Box } from "@mui/material";

export default function ProfileCardSkeleton() {
    return (
        <Box component="section" sx={{ width: '100%', p: 2, display: 'flex', justifyContent: 'center' }}>
            <Skeleton 
                variant="rectangular" 
                sx={{
                    width: '100%', 
                    maxWidth: '698px', 
                    height: 'auto',      
                    aspectRatio: '698/682'
                }} 
            />
        </Box>
    )
}