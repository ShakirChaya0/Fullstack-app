import DrinksLink from "../components/drinks/drinksLink";
import FoodsLink from "../components/foods/foodsLink";
import { OrderList } from "../components/orderList";

export default function Menu(){
    return(
        <div className="flex flex-1 flex-col justify-center items-center gap-5">
            <FoodsLink/>
            <DrinksLink/>
            <OrderList/>
        </div>
    )
}