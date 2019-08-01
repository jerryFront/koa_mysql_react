import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import Routes from '@configs/router.config'
import {App} from '@pages/base/index'


ReactDOM.render(
    <App />,
    document.getElementById('app')
)
