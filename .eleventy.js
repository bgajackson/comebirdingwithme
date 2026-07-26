const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  // Copy static assets straight through to the output
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Blog posts collection, newest first
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/posts/*.md").reverse();
  });

  // Photo log collection, newest first
  eleventyConfig.addCollection("photos", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/photos/entries/*.md").reverse();
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    const d = new Date(dateObj);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Take the first N items of an array. Nunjucks' built-in "slice" filter
  // splits an array into N groups rather than taking the first N items, so
  // this exists to do what most people expect "slice" to do.
  eleventyConfig.addFilter("head", (arr, n) => {
    if (!Array.isArray(arr)) return arr;
    return arr.slice(0, n);
  });

  // Puts any post/photo with `pinned: true` in its front matter first,
  // ordered by `pinOrder` (lower = earlier; unset counts as last among
  // pinned items). Everything else keeps its existing order after that.
  eleventyConfig.addFilter("pinnedFirst", (items) => {
    if (!Array.isArray(items)) return items;
    const pinned = items.filter((i) => i.data.pinned);
    const rest = items.filter((i) => !i.data.pinned);
    pinned.sort((a, b) => (a.data.pinOrder ?? 999) - (b.data.pinOrder ?? 999));
    return [...pinned, ...rest];
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
