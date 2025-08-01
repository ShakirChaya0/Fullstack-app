import DrinksLink from "./drinksLink";
import FoodsLink from "./foodsLink";

export function Menu(){
    return(
        <div className="h-full flex-1 flex flex-col justify-center items-center gap-5">
            <FoodsLink/>
            <DrinksLink/>
        </div>
    )
}