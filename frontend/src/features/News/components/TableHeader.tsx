import ModalCreateNews from "./ModalCreateNews";

export default function TableHeader ({currentPage}: {currentPage: number}) {
    return (
        <div className="flex md:flex-row flex-col items-center sm:justify-between w-full">
            <h1 className="font-medium text-center md:text-left">Novedades</h1>
            <ModalCreateNews currentPage={currentPage}/>
        </div>
    )
}