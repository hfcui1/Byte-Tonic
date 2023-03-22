import axios from 'axios';
import { load } from 'cheerio';
import { defer, retry } from 'rxjs';
import { URLS } from './const';

export const channelData$ = defer(queryJavascriptHotArticle).pipe(retry(3));

async function queryJavascriptHotArticle() {
  const response = await axios.get(URLS.HOT_JAVASCRIPT);
  return parseHTML(response.data);
}

function parseHTML(data) {
  const $ = load(data);

  // 获取文章列表
  const articleList = $('body').find('.entry-list .item');

  // 遍历每篇文章并筛选
  return articleList.map((index, element) => {
    const ele = $(element).find('.info-box');
    const title = $(ele).find('.title').text();
    const href = $(ele).find('.title').attr('href');

    // 如果点赞数大于500，输出文章标题、链接和点赞数
    return {
      title,
      href
    };
  });
}
