import './styles/styles.scss'
import './ui_lib/router'
import {Router} from "./ui_lib/router"
import {homeViewHandler} from "./views/home"
import {loginViewHandler} from "./views/Login"
import { projectInfoViewHandler } from './views/ProjectInfo';

const router = new Router([
    projectInfoViewHandler,
    homeViewHandler,
    loginViewHandler
])
