const Handlebars = require('handlebars');

Handlebars.registerHelper('capitalize', function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
});

Handlebars.registerHelper('indexFrom1', function (string) {
    return parseInt(string) + 1;
});

Handlebars.registerHelper('formatGenre', function (string) {
    const genre = string.replace("_", " ");
    return genre.split(' ').map( s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
});

const render = (templateData = "", data = {}) => {
    const template = Handlebars.compile(templateData);
    return template(data);
}

module.exports = render;