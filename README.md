## 安装插件

> note：最好在 [hexo-theme-next](https://github.com/next-theme/hexo-theme-next) 主题下使用

```bash
npm install hexo-reading-count --save
```

## 配置

在全局 `_config.yml` 中修改，参数如下：

```yml
reading_count:
  enable: true
  count: '阅读次数'     # 自定义文本
  increase_url: <url> # 递增并获取单篇文章的阅读次数
  fetch_url: <url>    # 批量获取多篇文章的阅读次数
```

## 服务器接口

该插件使用文章发布时**以秒为单位的时间戳**作为**标识（id）**，另外，还会用到文章的**标题（title）**用作可读的标识。

`increase` 是一个 `post` 接口，其请求和响应格式如下：

```
request(post):
	url: <url>
	form:
		id:<id>
		title:<title>
response(json): {"id":"<id>","pv":<pv>}
```

`fetch` 是一个 `get` 接口，其请求和响应格式如下：

```
request: https://<url>?ids=<id1>&ids=<id2>...
response(json): [{"id":"<id1>","pv":<pv1>},{"id":"<id2>","pv":<pv2>},...]
```

## 刷新服务

```bash
hexo clean
hexo generate
hexo server
```

