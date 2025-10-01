type Position = {
  top: number,
  left: number
}

export default function GoBackButton({ position }: { position: Position }) {
    const handleClick = () => {
        window.history.back();
    }

    return (
        <div
            className="absolute z-40"
            style={{ top: position.top, left: position.left }}
        >
            <button
                onClick={handleClick}
                className="
                    flex items-center gap-2 rounded-xl px-5 py-2.5
                    text-sm font-semibold text-white
                    bg-gradient-to-r from-orange-500 to-orange-400
                    shadow-lg shadow-orange-500/30 
                    hover:from-orange-600 hover:to-orange-500
                    hover:shadow-orange-600/40
                    active:scale-95 cursor-pointer 
                    transition-all duration-300 ease-in-out
                "
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
                Volver
            </button>
      </div>
    )
}
