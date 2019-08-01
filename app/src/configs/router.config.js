import React from 'react'
import { Router,Route,IndexRoute,hashHistory } from 'react-router' 
import * as base from '@pages/base'


export default ()=>{
    <Router history={hashHistory}>
        <Route path="/" component={base.app}>


        </Route>

    </Router>

}