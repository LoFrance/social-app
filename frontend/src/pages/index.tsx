import Reac, { useState, useEffect} from 'react'
import axios from 'axios'
import CardComponent from '@/components/CardComponent'

export default function Home() {
  const [newUser, setNewUser ] = useState({
    username: '',
    password: '',
    email: '',
    avatarColor: '',
    avatarImage: ''
  })
  const [postImage, setPostImage] = useState({
    myFile: ''
  })

  const apiUrl = "http://localhost:5005"

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(newUser)
      const response = await axios.post(`${apiUrl}/api/v1/signup`, {...newUser, avatarImage: postImage.myFile})
      console.log(response);
      setNewUser({username: '', email: '', password: '', avatarColor: '', avatarImage: ''})
    } catch (error) {
      console.log('Error creating user:', error)
    }
  }

  const convertToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setPostImage({ ...postImage, myFile: base64 as string});
  };


  return(
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray">
      <div className="space-y-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Users Management</h1>
        <form onSubmit={createUser} className="p-4 bg-blue-100 rounded shadow">
          <input
            placeholder="Name"
            value={newUser.username}
            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
            className="mb.2 w-full p-2 border border-gray-300 rounded"
          />
            <input
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            className="mb.2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            className="mb.2 w-full p-2 border border-gray-300 rounded"
          />
           <input
            placeholder="Avatar Color"
            value={newUser.avatarColor}
            onChange={(e) => setNewUser({...newUser, avatarColor: e.target.value})}
            className="mb.2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="file"
            name="myFile"
            accept=".jpeg, .png, .jpg"
            onChange={(e) => handleFileUpload(e)}
          />
          <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded">SignUp</button>
        </form>
      </div>
    </main>
  )

}