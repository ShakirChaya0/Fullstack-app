import ReservationForm from "../components/ReservationForm";


export default function ReservationCRUD() {




    return (
        <main>
            <div className=" flex content-center font-bold-600">
                <h1 className="text-center text-3xl" >Registrar Reserva</h1>
                    <ReservationForm></ReservationForm>
            </div>
        </main>
    )
}