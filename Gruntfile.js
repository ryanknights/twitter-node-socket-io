module.exports = function (grunt)
{
	grunt.initConfig({

		pkg : grunt.file.readJSON('package.json'),

		less :
		{	
			options :
			{
				compress : true
			},

			app :
			{
				files :
				{
					'public/assets/css/master.css' : 'public/src/css/master.less'
				}
			}
		},

		watch :
		{
			options :
			{
				livereload : true,
			},

			stylesheets :
			{
				files : ['public/src/css/**/*.less'],
				tasks : ['less']
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['less', 'cssmin', 'uglify']);
};