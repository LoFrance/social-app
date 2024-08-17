import Reac, { useState, useEffect} from 'react'
import axios from 'axios'
import CardComponent from '@/components/CardComponent'

export default function Home() {
  const [newUser, setNewUser ] = useState({
    name: '',
    email: ''
  })
  const apiUrl = "http://localhost:5005"

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/v1/signup`, newUser)
      console.log(response);
      setNewUser({name: '', email: ''})
    } catch (error) {
      console.log('Error creating user:', error)
    }
  }

  return(
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray">
      <div className="space-y-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Users Management</h1>
        <form onSubmit={createUser} className="p-4 bg-blue-100 rounded shadow">
          <input
            placeholder="Name"
            defaultValue={newUser.name}
            className="mb.2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Email"
            defaultValue={newUser.email}
            className="mb.2 w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded">SignUp</button>
        </form>
      </div>
    </main>
  )

}