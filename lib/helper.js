'use strict';

module.exports.generatePostID = function(postDate) {
    return parseInt(postDate / 1000);
};