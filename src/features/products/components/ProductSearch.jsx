import { useDispatch } from "react-redux";
import { useDebounce } from "../../../hooks/useDebounce";
import { setSearchTerm } from "../productSlice";

export default function ProductSearch() { 
let dispatch = useDispatch()

    
    return ( 
    <div className="mt-1">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black "
        onChange={(e)=>{dispatch(setSearchTerm(e.target.value))}}
      />
    </div>
    )
 }
