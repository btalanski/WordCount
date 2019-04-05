const assert = require('assert')
const fs = require("fs");
const path = require("path");
const render = require('../functions/templateRender.js');
const expect = require('chai').expect;

describe('templateRender', () => {
    it('should return rendered template from string', () => {
        const template = "<p>Hello {{name}}</p>";
        const data = { name: "Joe" };
        const expected = "<p>Hello Joe</p>";
        expect(render(template, data)).to.be.equal(expected);
    });
})