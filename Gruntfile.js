module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // 2. Configuration for concatinating files goes here.
        concat: {
            dist: {
        src: [
            'assets/js/plugins.js',  // This specific file
            'assets/js/main.js'  // This specific file
        ],
        dest: 'assets/js/build/production.js'
            }
        },
        uglify: {
            build: {
                src: 'assets/js/build/production.js',
                dest: 'assets/js/build/production.min.js'
            }
        },
        jshint: {
            options: {
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                quotmark: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                        $: true,
                        _: true,
                        module: true,
                    }
            },
            all: ['assets/js/build/production.js']
        },
        imagemin: {
            dynamic: {
                files: [{
                  expand: true,
                  cwd: 'assets/img/',
                  src: ['**/*.{png,jpg,gif}'],
                  dest: 'assets/img/'
                }],
                content: [{
                  expand: true,
                  cwd: 'src/site/content/',
                  src: ['**/*.{png,jpg,gif}'],
                  dest: 'src/site/content/'
                }]
              }
        },
        sass: {
                dist: {
                    options: {
                        style: 'compressed',
                        compass: true
                    },
                    files: {
                        'assets/css/build/style.css': 'assets/sass/style.scss'
                    }
                } 
        },
        csslint: {
            lax: {
                options: {
                    csslintrc: '.csslintrc'
                },
                src: ['assets/css/build/prefixed/**/*.css']
            },
            strict: {
                options: {
                    import: false
                },
                src: ['assets/css/build/prefixed/**/*.css']
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 version']
            },
            multiple_files: {
                expand: true,
                flatten: true,
                src: 'assets/css/build/*.css',
                dest: 'assets/css/build/prefixed/'
            }
        },
        watch: {
            scripts: {
                files: ['assets/js/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['assets/sass/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false,
                }
            },
        },
        assemble: {
            options: {
                assets: 'src/public/assets', // path of assets e.g. css files available as variable to templates
                layoutdir: 'src/build/layouts', // resolve layouts from this directory
                helpers: 'src/build/helpers/helper-*.js', // Kinda like plugins for the site
                partials: 'src/build/partials/*.hbs', // Reusable snippets
                data: 'src/build/data/*.yml', // Reusable data
            },
            site: {
                options : {
                    engine: 'handlebars', // use handlebars engine to render the pages
                    layout: 'page.hbs', // the layout to use to generate each page
                    flatten: true,
                },
                files: [
                    // transform all markdown files into html files
                    {expand: true, cwd: 'src/site', src: ['*.hbs'], dest: 'src/public', ext: '.html'},
                ]
            }
        },
        // Before generating any new files,
        // remove any previously-created files.
        clean: {
            all: ['src/public']
        },
        copy: {
            main: {
              files: [
                {expand: true, src: ['assets/**'], dest: 'src/public/'},
                {expand: true, flatten: true, src: ['src/site/content/**'], dest: 'src/public/content', filter: 'isFile'}
              ]
            }
          },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/public',
                    src: ['**/*.html'],
                    dest: 'src/public'
                }]
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify', 'jshint', 'imagemin', 'sass', 'csslint:lax', 'autoprefixer', 'clean', 'copy', 'assemble', 'htmlmin']);
};