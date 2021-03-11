'use strict';

const Transport = require('egg-logger').Transport;
const syslog = require('syslog-client');

let client;

let options;

// 初始化udp client
// syslog服务在服务器本地514端口
function init() {
  return new Promise((resolve, reject) => {
    if(!options.target) reject(new Error('请配置target属性'));
    const syslogHost = options.target;
    client = syslog.createClient(syslogHost, {
      transport: options.transport in [ syslog.Transport.Tcp, syslog.Transport.Udp ] ? options.transport : syslog.Transport.Udp,
      port: options.port || 514,
      appName: options.appName,
    });
    // 检测服务网络连通性
    client.log(`${options.appName} 连接到日志平台`, {
      facility: syslog.Facility.Local7,
      severity: 6,
    }, error => {
      if (error) {
        reject(new Error('无法访问统一syslog服务'));
      } else {
        resolve();
      }
    });
  });
}

const LOG_LEVEL = {
  DEBUG: 7,
  INFO: 6,
  WARN: 4,
  ERROR: 3,
};

// 写入syslog
function logToSys(level, msg) {
  client && client.log(`${options.appName} ${msg}`, {
    facility: syslog.Facility.Local7,
    severity: level,
  });
}

// egg日志重定向到syslog
class RemoteTransport extends Transport {
  log(level, args, meta) {
    const msg = super.log(level, args, meta);
    if (typeof msg === 'string' && (level in LOG_LEVEL)) {
      const formattedMsg = `[${this._syslogLogger}] ${msg}`;
      logToSys(LOG_LEVEL[level], formattedMsg);
    }
  }
}

module.exports.initSyslog = async function(ctx, args = {}) {
  if (!ctx) throw '请传入应用上下文';
  if (args.level === 'NONE') return;
  options = args;
  options.appName = args.appName || ctx.name;
  const level = args.level || 'INFO';

  await init();

  for (const logger of ctx.loggers.keys()) {
    if (logger === 'errorLogger') continue;
    const remoteLogger = new RemoteTransport({
      level: Object.keys(LOG_LEVEL).includes(level) ? level : 'INFO',
    });
    remoteLogger._syslogLogger = logger;
    ctx.getLogger(logger).set('remote', remoteLogger);
  }
  return options;
};
