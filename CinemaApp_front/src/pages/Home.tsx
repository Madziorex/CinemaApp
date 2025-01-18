import Carousel from "../components/Carousel";
import Coming from "../components/Coming";
import Playing from "../components/Playing";
import "../css/Home.css"

function Home() {
  return (
    <>
      <Carousel />
      <div className="home-content">
        <Playing />
        <Coming />
      </div>
    </>
  );
}

export default Home;
