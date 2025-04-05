import { Header } from "./components/Header";
import { PhotoList } from "./components/PhotoList";

function App() {
  return (
    <div className="flex flex-col">
      <Header />
      <PhotoList />
    </div>
  );
}

export default App;
