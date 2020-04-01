const logger = require('koa-logger');
const fs = require('fs');
const path = require('path');

// 判断目录是否存在
const accessFile = dir => {
  return new Promise(resolve => {
    fs.access(dir, fs.constants.F_OK, err => {
      if (err) {
        console.warn('目录不存在：' + err);
        resolve(false);
      }
      resolve(true);
    });
  });
};

// 创建文件夹
const creatDir = dir => {
  return new Promise(resolve => {
    fs.mkdir(dir, err => {
      if (err) {
        console.warn('创建文件夹失败：' + err);
        resolve(false);
      }
      resolve(true);
    });
  });
};


// 写入内容
const writeFile = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, { flag: 'a' }, err => {
      if (err) {
        console.warn('logger error: ' + err);
        reject(err);
      }
      resolve(true);
    });
  });
};

const writeLogger = async args => {
  const file = __dirname + '/../log/log.txt';
  const dir = path.dirname(file);
  const date = new Date().toLocaleString('chinese',{ hour12: false });
  const data = args[0].match('-->') ? `--> ${args[1]} ${date} ${args.slice(2).join(' ')}\n` : `<-- ${args[1]} ${date} ${args[2]}\n`;

  const accessFileState = await accessFile(dir);

  if (!accessFileState) await creatDir(dir);

  try {
    await writeFile(file, data);
  } catch (err) {
    console.warn(err);
  }
};

module.exports = logger((str, args) => {
  console.info(str);
  writeLogger(args);
});
