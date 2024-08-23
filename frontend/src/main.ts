import './styles/styles.scss';
import './ui_lib/router';
import { Router } from './ui_lib/router';
import { homeViewHandler } from './views/home';
import { loginViewHandler } from './views/Login';
import { projectInfoViewHandler } from './views/validator/ProjectInfo/ProjectInfo';
import { sideBarTestViewHandler } from './views/validator/SideBarTest/SideBarTest';

const router = new Router([
  sideBarTestViewHandler,
  projectInfoViewHandler,
  homeViewHandler,
  loginViewHandler,
]);
