/**
 * https://github.com/chjj/marked
 * https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
 */
var marked = require('marked');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

exports.tohtml = function (content) {
    return marked(content);
};