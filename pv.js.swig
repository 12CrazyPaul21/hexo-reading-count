'use strict';

(()=> {
    const fetchPVs = (posts) => {
        axios({
            method: 'get',
            url: `{{ config.fetch_url }}?${Object.keys(posts).map((n, _) => {return 'ids=' + n}).join('&')}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            responseType: 'json'
        })
        .then(response => {
            response.data.forEach(pvs => {
                if ('id' in pvs && 'pv' in pvs) {
                    if (pvs.id in posts) {
                        posts[pvs.id].tag.innerText = pvs.pv;
                    }
                }
            });
        })
        .catch(error => {
            console.error(`reading count: ${error.message}`);
        });
    };

    const fetchAndIncrease = (post) => {
        axios({
            method: 'post',
            url: '{{ config.increase_url }}',
            data: {
                id: post.id,
                title: post.title
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            responseType: 'json'
        })
        .then(response => {
            if ('pv' in response.data) {
                post.tag.innerText = response.data.pv;
            }
        })
        .catch(error => {
            console.error(`reading count: ${error.message}`);
        });
    };

    const refreshPV = function() {
        if (CONFIG.page.isHome) {
            let posts = {};
            document.querySelectorAll('.post-reading-count').forEach((tag) => {
                let id = tag.getAttribute('data-post-id').toString();
                posts[id] = {
                    id: id,
                    title: tag.getAttribute('data-post-title'),
                    tag: tag
                };
            });

            if (Object.getOwnPropertyNames(posts).length != 0) {
                fetchPVs(posts);
            }
        } else {
            let tag = document.querySelector('.post-reading-count');
            if (tag) {
                fetchAndIncrease({
                    id: tag.getAttribute('data-post-id').toString(),
                    title: tag.getAttribute('data-post-title'),
                    tag: tag
                });
            }
        }
    };

    if (NexT != undefined && 'boot' in NexT) {
        let nextRefresh = NexT.boot.refresh;
        NexT.boot.refresh = () => {
            nextRefresh();
            refreshPV();
        };
    } else {
        document.addEventListener('DOMContentLoaded', refreshPV);
        document.addEventListener('pjax:success', refreshPV);
    }
})();