import { useState } from 'react'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-gray-400 flex justify-center w-full p-2'>
      <h1 className='bg-amber-300 w-fit p-2'>Hello from WinnieThePooh</h1>
    </div>
  )
}

export default App
