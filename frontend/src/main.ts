import './styles/styles.scss'
import './ui_lib/router'
import {Router} from "./ui_lib/router"
import {homeViewHandler} from "./views/home"
import {loginViewHandler} from "./views/Login"

const router = new Router([
    homeViewHandler,
    loginViewHandler
])