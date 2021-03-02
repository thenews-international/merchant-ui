import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

// components

// views

import Login from 'views/auth/Login.js'
import Register from 'views/auth/Register.js'

export default function Auth () {
  let accessToken = localStorage.getItem('access_token')
  return (
    <>
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <Switch>
            {
              accessToken ? <Redirect from="/auth" to="/list"/> :
                <>
                  <Route path="/auth/login" exact component={Login}/>
                  <Route path="/auth/register" exact component={Register}/>
                  <Redirect
                    from="/auth" to="/auth/login"/>
                </>
            }
          </Switch>
          {/*<FooterSmall absolute/>*/}
        </section>
      </main>
    </>
  )
}
