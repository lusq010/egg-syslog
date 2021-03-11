'use strict';
const initSyslog = require('./syslog').initSyslog;

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async didLoad() {
    try {
      const options = await initSyslog(this.app, this.app.config.syslog);
      this.app.logger.info('syslog初始化成功，写入syslog的application_name为' + options.appName + ',日志级别为' + (options.level || 'INFO'));
    } catch (err) {
      this.app.logger.error('syslog初始化失败，具体原因' + err);
    }
  }
}

module.exports = AppBootHook;
