import { Header } from "./components/Header";
import { PhotoList } from "./components/PhotoList";
import { UploadPhotoDialog } from "./components/UploadPhotoDialog";

function App() {
  return (
    <div className="flex flex-col h-dvh">
      <Header />
      <PhotoList />
      <UploadPhotoDialog />
    </div>
  );
}

export default App;
