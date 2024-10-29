'use strict';

const path = require('path');

const helper = require('./lib/helper');
const js = hexo.extend.helper.get("js").bind(hexo);

hexo.config.reading_count = Object.assign({
    enable: false,
    count: "阅读次数",
    post_meta_order: 0,
    increase_url: '',
    fetch_url: ''
}, hexo.config.reading_count);

function isEnabled() {
    let reading_count = hexo.config.reading_count;
    return reading_count.enable && reading_count.increase_url != '' && reading_count.fetch_url != '';
}

if (isEnabled()) {
    hexo.extend.helper.register('generatePostID', helper.generatePostID);

    hexo.extend.filter.register('theme_inject', injects => {
        injects.postMeta.raw('reading_count', `
            {%- if config.reading_count.count %}
            <span class="post-meta-item" title="{{ config.reading_count.count }}">
                <span class="post-meta-item-icon">
                    <i class="far fa-eye"></i>
                </span>
                <span class="post-meta-item-text">{{ config.reading_count.count + __('symbol.colon')}}</span>
                <span class="post-reading-count" data-post-id="{{ generatePostID(post.date) }}" data-post-title="{{ post.title }}">
                    <i class="fa fa-spinner fa-spin"></i>
                </span>
            </span>
            {%- endif %}
        `, {}, {}, hexo.config.reading_count.post_meta_order);
    }, 0);

    hexo.extend.injector.register('head_end', () => {
        return js('https://cdn.jsdelivr.net/npm/axios@1.7.7/dist/axios.min.js');
    }, 'home');
    hexo.extend.injector.register('head_end', () => {
        return js('https://cdn.jsdelivr.net/npm/axios@1.7.7/dist/axios.min.js');
    }, 'post');

    hexo.extend.injector.register('head_end', () => { return js('/js/pv.js'); }, 'home');
    hexo.extend.injector.register('head_end', () => { return js('/js/pv.js'); }, 'post');

    hexo.extend.generator.register("copy_plugin_scripts", function (locals) {
        return {
            path: 'js/pv.js',
            data: function () {
                return hexo.render.render(
                    {path: path.join(__dirname, 'pv.js.swig')},
                    {config: hexo.config.reading_count}
                );
            },
        };
    });
}