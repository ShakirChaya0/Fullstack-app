import DrinksLink from "./drinksLink";
import FoodsLink from "./foodsLink";

export function Menu(){
    return(
        <div className="h-auto">
            <div className="flex flex-col justify-center items-center gap-5 mt-45">
                <FoodsLink/>
                <DrinksLink/>
            </div>
        </div>
    )
}