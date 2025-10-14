import { Skeleton } from "@mui/material";
import Box from '@mui/material/Box'; // Using Box for simple centering container
import { createTheme, ThemeProvider } from '@mui/material/styles'; // For Skeleton styles

// This is the new skeleton component built with Tailwind CSS, based on your code.
function CreateOrderSkeleton() {
  return (
    // Main container
    <div className="w-full max-w-6xl h-full p-4 sm:p-6 lg:p-8 bg-white flex flex-col items-center">
      
      {/* Header */}
      <div className="flex items-center gap-3 w-auto mb-10">
        <Skeleton variant="rectangular" className="size-8 flex-shrink-0" animation="wave" />
        <Skeleton variant="text" className="w-80 h-12" animation="wave" />
      </div>

      {/* Form Body - Two Column Layout */}
      <div className="w-full flex flex-col md:flex-row gap-10">

        {/* Left Card: Add Product */}
        <div className="w-full md:w-1/2 flex flex-col bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <Skeleton variant="text" className="w-3/4 h-8 mb-8" animation="wave" />
          <Skeleton variant="rectangular" className="w-full h-14 rounded-md mb-5" animation="wave" />
          <Skeleton variant="rectangular" className="w-full h-14 rounded-md mb-5" animation="wave" />
          <Skeleton variant="rectangular" className="w-full h-12 rounded-md mt-auto" animation="wave" />
        </div>

        {/* Right Card: Order Summary */}
        <div className="w-full md:w-1/2 flex flex-col bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <Skeleton variant="text" className="w-1/2 h-8 mb-4" animation="wave" />
          
          {/* Empty Order State */}
          <div className="flex-grow flex items-center justify-center my-4">
             <Skeleton variant="text" className="w-1/3 h-7" animation="wave" />
          </div>
          
          {/* Total */}
          <div className="flex justify-end mb-8">
            <Skeleton variant="text" className="w-1/3 h-10" animation="wave" />
          </div>

          {/* Diners and Observations */}
          <div className="space-y-5">
            <Skeleton variant="rectangular" className="w-full h-14 rounded-md" animation="wave" />
            <Skeleton variant="rectangular" className="w-full h-24 rounded-md" animation="wave" />
          </div>

          {/* Submit Button */}
          <Skeleton variant="rectangular" className="w-full h-12 rounded-md mt-6" animation="wave" />
        </div>
      </div>
    </div>
  );
}


// Main App component to render the skeleton.
// We still use ThemeProvider for the Skeleton component itself to work properly.
export default function App() {
  const theme = createTheme({
      palette: {
          background: {
              default: '#f8f9fa' // Lighter gray background
          }
      }
  });

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 2, md: 4 },
          width: '100%',
        }}
      >
        <CreateOrderSkeleton />
      </Box>
    </ThemeProvider>
  );
}

