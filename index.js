import React from 'react'
import { AppRegistry } from 'react-native'
import Dva from './app/Dva'
import Main from './app/Main'
import models from './app/models'

const app = Dva({
  initialState: {},
  models: models,
  onError(e) {
    console.log('onError', e)
  },
})

const App = app.start(<Main />)

AppRegistry.registerComponent('Mars', () => App)