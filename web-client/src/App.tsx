import React, {FC, useContext, useEffect, useState} from 'react'
import LoginForm from './components/LoginForm'
import { Context } from './index'
import { observer } from 'mobx-react-lite'
import { IUser } from './models/IUser'
import UserService from './services/UserService'

const App: FC = () => {
  const {store} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  })

  async function getUsers() {
    try {
      const response = await UserService.users()
      console.log(response)
      setUsers(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  // if (store.isLoading) {
  //   return <div>Loading...</div>
  // }

  if (!store.isAuth) {
    return (
      <LoginForm/>
    )
  }

  return (
    <div>
      <h1>{store.isAuth ? `User successfully login: ${store.user.email}` : 'Need to authorization!'}</h1>
      <button onClick={() => store.logout()}>Exit</button>
      <div>
        <button onClick={getUsers}>Get Users</button>
      </div>
      {users?.map(user =>
          <div key={user.email}>{user.email}</div>
      )}
    </div>
  )
}

export default observer(App)