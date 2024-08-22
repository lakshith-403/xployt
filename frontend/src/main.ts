import './styles/styles.scss'
import './ui_lib/router'
import {Router} from "./ui_lib/router"
import {homeViewHandler} from "./views/home"
import {loginViewHandler} from "./views/Login"
import { projectInfoViewHandler } from './views/ProjectInfo';
import { testCreateButtonViewHandler } from './views/ButtonTest';

const router = new Router([
    projectInfoViewHandler,
    homeViewHandler,
    loginViewHandler,
    testCreateButtonViewHandler
])
