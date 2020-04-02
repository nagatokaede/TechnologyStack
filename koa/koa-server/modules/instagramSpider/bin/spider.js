'use static';

const axios = require('axios');

const getHtml = url => {
  return new Promise((resolve, reject) => {
    console.info('--- 开始爬取资源 ---');

    axios.get(url)
      .then(res => {
        const reg = /(display_url":")[a-zA-z]+:\/\/[^"]*/ig;
        // 初步解析内容
        const content = body.match(reg);
        // 进一步解析
        const urlList = content.map(item => item.split('display_url":"')[1].replace(/\\u0026/g, '&'));
        // 去重返回
        resolve(new Set(urlList));
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        console.info('--- 爬取资源结束 ---');
      });
  });
};

module.exports = getHtml;
