const htmlmin = require('html-minifier');
const dateFns = require('date-fns');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const markdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const slugify = require('slugify');

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(lazyImagesPlugin, {
    imgSelector: 'img',
    transformImgPath: (imgPath) => `./src/${imgPath}`,
  });

  eleventyConfig.setEjsOptions({
    rmWhitespace: true,
    context: {
      dateFns,
      slugify,
    },
  });

  const generateUniqueTagElt = (collections) => {
    let tagMap = new Map();

    collections.getAllSorted().forEach((item) => {
      if (!item.data.tags) {
        return;
      }

      item.data.tags
        .filter((tag) => !tag.startsWith('_'))
        .forEach((tag) => {
          if (!tagMap.get(tag)) {
            tagMap.set(tag, new Array());
          }

          tagMap.get(tag).push(item);
        });
    });

    return tagMap;
  };

  eleventyConfig.addCollection('tagMap', (collections) => {
    const tagMap = generateUniqueTagElt(collections);

    // Sorted by value in the map
    return new Map([...tagMap.entries()].sort((a, b) => b[1].length - a[1].length));
  });

  eleventyConfig.addCollection('tagArray', (collections) => {
    const tagMap = generateUniqueTagElt(collections);
    const result = [];

    tagMap.forEach((value, key) => {
      result.push({ name: key, posts: value.sort((a, b) => b.date - a.date) });
    });

    // Sorted by value in the map
    return result;
  });

  eleventyConfig.setBrowserSyncConfig({
    files: './_site/assets/styles/main.css',
  });

  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      const minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
      });
      return minified;
    }

    return content;
  });

  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };
  let markdownLib = markdownIt(options).use(markdownItAttrs);
  eleventyConfig.setLibrary('md', markdownLib);

  return {
    dir: { input: 'src', output: '_site', data: '_data' },
  };
};
