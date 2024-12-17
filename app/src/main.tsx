import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from "./router"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider
        router={router}
      />
  </StrictMode>,
)

window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})