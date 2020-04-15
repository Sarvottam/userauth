const express =require('express');
const path =require('path');
class Routes {
  constructor(app) {
    this.app = app;
    
  }

  /* creating app Routes starts */
  appRoutes() {
   
    this.app.use('/authorize', require("./authorize"));
    this.app.use('/users', require("./users"));
    this.app.use('/admin', require("./admin"));
    // this.app.use('/', require("./common"));
    this.app.use('/public', express.static(path.join(__dirname, '/../public')));
  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
