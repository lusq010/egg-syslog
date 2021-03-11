# egg-syslog

## why&how

- 现有node应用部署后查看日志的方式比较繁琐且不友好，需要登录服务器、通过命令行查看等

- 通过将应用产生的日志写入统一的syslog服务的方式进行日志采集，最终可通过web搭建的日志平台来结构化查询log


## 开启插件

```js
// config/plugin.js
exports.syslog = {
  enable: true,
  package: 'egg-syslog',
};
```

## syslog简介
syslog是一种收发日志数据的标准网络服务，支持TCP/UDP等协议；

## 详细配置
- appName - {String}应用名，默认为应用package.json中的name字段（通过web查看日志时可通过应用名application_name字段进行过滤）
- level - {String}日志级别（默认为INFO，即INFO及以上级别的日志会被写入syslog服务，可选值为NONE、DEBUG、INFO、WARN、ERROR，传入NONE时关闭syslog）
- target - {String}syslog服务主机地址
- port - {Number}syslog服务端口，默认514
- transport - {Number}，syslog服务协议（TCP:1/UDP:2），默认UDP

## 配置示例
```js
// config/config.default.js
exports.syslog = {
  appName: 'app1',
  level: 'DEBUG',
};
```

## License

[MIT](LICENSE)
