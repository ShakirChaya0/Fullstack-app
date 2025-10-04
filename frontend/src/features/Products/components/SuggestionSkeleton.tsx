import { Skeleton } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"

export default function SuggestionSkeleton() {
  return (
    <div className="min-h-[260px] flex items-center justify-center py-4 w-full relative">
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          1000: { slidesPerView: 2 },
          1500: { slidesPerView: 3 },
        }}
        className="px-8"
      >
        {[1, 2, 3].map((item) => (
          <SwiperSlide key={item} className="px-8">
            <div
              className="border border-gray-300 min-h-[200px] flex-shrink-0 
                         flex flex-col bg-white rounded-xl shadow-md justify-evenly
                         py-4 px-2"
            >
              <Skeleton variant="text" width="70%" height={32} className="self-center" />
              <Skeleton variant="text" width="50%" height={24} className="self-center" />
              <Skeleton variant="text" width="40%" height={28} className="self-center" />

              <div className="self-center w-24">
                <Skeleton variant="rectangular" width={96} height={36} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}