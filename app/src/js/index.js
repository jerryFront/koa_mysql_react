import {register} from './serviceWorkerInstall'

register({})

import React from 'react'
import ReactDOM from 'react-dom'
import {App,Loader} from '@pages/base/index'
import '@styles/base.css'

ReactDOM.render(
    <App />,
    document.getElementById('app')
)

// ReactDOM.render(<Loader />,document.getElementById('loading'))
