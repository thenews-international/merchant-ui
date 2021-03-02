import React, { useContext, createContext, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css'

import Auth from 'layouts/Auth'
import Admin from 'layouts/Admin'

import axiosInstance, { authAxiosInstance } from '../src/api/http'
import { toast } from 'react-toastify'

export default function AuthExample () {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route path="/auth" component={Auth}/>
          <PrivateRoute path="/">
            <Admin/>
          </PrivateRoute>
        </Switch>
      </Router>
    </ProvideAuth>
  )
}

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
const authContext = createContext()

function ProvideAuth ({ children }) {
  const auth = useProvideAuth()
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  )
}

function useAuth () {
  return useContext(authContext)
}

function useProvideAuth () {
  const [user, setUser] = useState(null)

  const notify = () => toast.error(
    'The username or password you entered is incorrect, please try again.')
  const successRegister = () => toast.success(
    'Successfully registered. Please login with same username and password')

  const register = async (form, cb) => {
    try {
      await authAxiosInstance.post('/register', {
        username: form.username,
        email: form.email,
        password: form.password,
      })
      await successRegister()
      cb()
    } catch (error) {
      console.error(error)
      notify()

    }
  }

  const signin = async (form, cb) => {
    try {
      const response = await authAxiosInstance.post('/login', {
        email: form.email,
        password: form.password,
      })
      axiosInstance.defaults.headers['Authorization'] = 'Bearer ' +
        response.data.token
      localStorage.setItem('access_token', response.data.token)

      setUser('user')
      cb()
      return response.data
    } catch (error) {
      console.error(error)
      notify()

    }
  }

  const signout = cb => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    axiosInstance.defaults.headers['Authorization'] = null
    setUser(null)
    cb()
  }

  return {
    user,
    signin,
    signout,
    register,
  }
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute ({ children, ...rest }) {
  let accessToken = localStorage.getItem('access_token')
  return (
    <Route
      {...rest}
      render={({ location }) =>
        accessToken ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/auth/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}

export { useAuth }
