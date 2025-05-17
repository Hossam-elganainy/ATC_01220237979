import Branches from "./Components/Branches";
import Hero from "./Components/Hero";
import Events from "./Components/Events";
// import HI from "./Components/HI";

export default function Home() {
  return (
   <div>
    <Hero/>
    <Events type="Home" />
    {/* <Branches/> */}
   </div>
  );
}
