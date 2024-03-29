// Requirements.
const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const CleanCSS = require("clean-css");
const htmlmin = require("html-minifier");

// Configuration and plugins.
module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  // Our layouts.
  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");

  // Filters
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "LLLL dd, yyyy"
    );
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toISO();
  });

  // Process content in markdown-it.
  const markdownItRenderer = new markdownIt({
    html: true,
    breaks: true,
    typographer: true,
    quotes: "“”‘’",
  });

  eleventyConfig.addFilter("markdownify", (str) => {
    return markdownItRenderer.renderInline(str);
  });

  // Development filters
  // Minify CSS
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({ sourceMap: true }).minify(code).styles;
  });

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (process.env.ELEVENTY_ENV === "prod" && outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  // Get current year for copyright.
  eleventyConfig.addShortcode("copyrightDates", (startYear) => {
    return startYear + " - " + new Date().getFullYear();
  });

  // Pass these directories through.
  eleventyConfig.addPassthroughCopy("_src/assets");
  eleventyConfig.addPassthroughCopy("_src/favicon.ico");
  eleventyConfig.addPassthroughCopy("_src/robots.txt");
  eleventyConfig.addPassthroughCopy("_src/humans.txt");
  eleventyConfig.addPassthroughCopy("_src/site.webmanifest");

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    typographer: true,
    quotes: "“”‘’",
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  return {
    templateFormats: ["md", "njk", "html"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: "_src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
