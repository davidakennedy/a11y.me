// Requirements.
const { DateTime } = require("luxon");
const fs = require("fs");
const markdownIt = require("markdown-it");
const Terser = require("terser");

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
  const CleanCSS = require("clean-css");
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({ sourceMap: true }).minify(code).styles;
  });

  // Simple cache busting
  // https://rob.cogit8.org/posts/2020-10-28-simple-11ty-cache-busting/
  eleventyConfig.addFilter("bust", (url) => {
    const [urlPart, paramPart] = url.split("?");
    const params = new URLSearchParams(paramPart || "");
    params.set("v", DateTime.local().toFormat("X"));
    return `${urlPart}?${params}`;
  });

  // Minify CSS
  eleventyConfig.addTemplateFormats("css");

  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async (inputContent) => {
      return async () => {
        if (process.env.ELEVENTY_ENV === "prod") {
          return new Promise((resolve) => {
            new CleanCSS({}).minify(inputContent, (_, data) => {
              resolve(data.styles);
            });
          });
        } else {
          return inputContent.css;
        }
      };
    },
  });

  const htmlmin = require("html-minifier");
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

  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("_site/404.html");

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false,
  });

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
