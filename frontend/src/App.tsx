import "./index.css"
import { RouterProvider } from 'react-router'
import router from './routes/app.routes.ts'

export default function App() {
  return (
    <>
    <RouterProvider router={router} />
    </>
  );
}