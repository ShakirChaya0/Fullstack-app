import DrinksLink from "./drinks/drinksLink";
import FoodsLink from "./foods/foodsLink";

export function Menu(){
    return(
        <div className="h-full flex-1 flex flex-col justify-center items-center gap-5">
            <FoodsLink/>
            <DrinksLink/>
        </div>
    )
}