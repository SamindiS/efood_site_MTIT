import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      {/* Optional: Add Navbar or Layout here */}
      <Outlet />
    </div>
  );
}

export default App;