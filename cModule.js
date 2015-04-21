var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');


exports.stats = true ;
exports.compileC = function ( envData ,  code , fn ) { 
	//creating source file
	var filename = cuid.slug();
	var path = './temp/';
	//create temp0 
	fs.writeFile( path  +  filename +'.cpp' , code  , function(err ){			
		if(exports.stats){
			if(err){
				console.log('ERROR in creating: '.red + err);
			}else{
		    	console.log('INFO: ' + filename +'.cpp created');	
			}
		}
	});
 	//compiling and excuiting source code
	if(envData.OS === 'Linux' || envData.cmd === 'gcc'){
		commmand = 'gcc ' + path + filename +'.cpp -o '+path + filename;
		exec(commmand , function ( error , stdout , stderr ){  
			if(error){
				if(exports.stats){
					console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
				}					
				var out = { error : stderr };
				fn(out);
			}else{
			    var tempcommand = "cd temp && ./"+ filename;
				exec( tempcommand , function ( error , stdout , stderr ){
					console.log("executing    " ,tempcommand);
					if(error){
						if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1){
							var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
							fn(out);								
						}else{
							if(exports.stats){
								console.log('INFO: '.green + filename + '.cpp contained an error while executing');
							}
							var out = { error : stderr };
							fn(out);								
						}
						var out = { error : stderr };
						fn(out);																				
					}else{
						if(exports.stats){
							console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
						}
						var out = { output : stdout};
						fn(out);
					}
	    		});
			}			
		});
	}
}
//end of compileCPP

exports.compileCWithInput = function ( envData , code , input ,  fn ) { 
	var filename = cuid.slug();
	path = './temp/';
	 			 
	//create temp0 
 	fs.writeFile( path  +  filename +'.cpp' , code  , function(err ){
 		if(exports.stats)
	    {
			if(err)
			console.log('ERROR: '.red + err);
	    	else
	    	console.log('INFO: '.green + filename +'.cpp created');
		} 
	});

	if(envData.OS === 'Linux' || envData.cmd ==='gcc')
	    {	    	    

			//compile c code 
			commmand = 'gcc ' + path + filename +'.cpp -o '+ path + filename ;
			exec(commmand , function ( error , stdout , stderr ){  
				if(error)
				{
					if(exports.stats)
					{
						console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
					}
					var out = { error : stderr };
					fn(out);
				}
				else
				{
					if(input){
						var inputfile = filename + 'input.txt';

						fs.writeFile( path  +  inputfile , input  , function(err ){
							if(exports.stats)
							{
								if(err)
									console.log('ERROR: '.red + err);
			    				else
			    					console.log('INFO: '.green + inputfile +' (inputfile) created');
			    			}
			            });
			            var tempcommand = "cd temp && ./" + filename ;

						exec( tempcommand + '<' + inputfile , function( error , stdout , stderr ){
						if(error)
						{
						if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
							{
								var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.'};
								fn(out);
							}
						else
							{
								if(exports.stats)
									{
										console.log('INFO: '.green + filename + '.cpp contained an error while executing');
									}
								var out = { error : stderr};
								fn(out);
							}																				
						}
						else
						{
							if(exports.stats)
							{
								console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
							}
							var out = { output : stdout};
							fn(out);
						}
						});

					}
					else //input not provided 
					{
						if(exports.stats)
						{
							console.log('INFO: '.green + 'Input mission for '+filename +'.cpp');
						}
					    var out = { error : 'Input Missing' };
						fn(out);
					}
					
				}
			

			});
	    								
	 }							
} //end of compileCPPWithInput
