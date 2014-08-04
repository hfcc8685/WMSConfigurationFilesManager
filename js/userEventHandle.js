var fs = require('fs');
var path = require('path');
var os = require('os');
var gui = require('nw.gui');
var async = require('async');
var win = gui.Window.get();
var wmscfmConfigFilePath = path.join(path.dirname(process.execPath),"config.json");

var currentFilePath;

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "application/xml",
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
	theme: "eclipse"
});	

$(function(){
	$(window).on('focus', function () {
		$("#nav-title").css("background-color","#222222");
  });

  $(window).on('blur', function () {
		$("#nav-title").css("background-color","#7a7c7c");
  });

	$('#nav-title-close').click(function(){
		win.close();
	});			

	$('#nav-title-minimize').click(function(){
		win.minimize();
	});

	$('#nav-title-settings').click(function(){
		$('#settings').modal();
	  $('#panel-title-configAddress').text(wmscfmConfigFilePath);
		fs.readFile(wmscfmConfigFilePath,function (err, data) {
			if (err) {
				showError(err.toString());
				return;
			}						
			var config = JSON.parse(data);						
			$('#textarea-config-projectAddress').val(config.scanProjectAddress.join("\n"));
			$('#textarea-config-file').val(config.scanFileFilter.join("\n"));
			
			var tempStringReplaceRule = "";
			$.each(config.stringReplaceRule,function() {
				var oneStringReplaceRule = this.join("$");
				tempStringReplaceRule = tempStringReplaceRule.concat(oneStringReplaceRule,"\n");
			});
			tempStringReplaceRule = tempStringReplaceRule.substr(0,tempStringReplaceRule.lastIndexOf("\n"));
			$('#textarea-config-string').val(tempStringReplaceRule);
		});
	});

	$('#button-config-save').click(function() {
		var scanProjectAddress = $('#textarea-config-projectAddress').val().split("\n");
		var scanFileFilter = $('#textarea-config-file').val().split("\n");
		var stringReplaceRule = new Array();
	 	var tempStringReplaceRule =	$('#textarea-config-string').val().split("\n");
		$.each(tempStringReplaceRule,function() {
			var oneStringReplaceRule = this.toString();
			stringReplaceRule.push(oneStringReplaceRule.split('$'));
		});
				
		var config = {
			"scanProjectAddress" : scanProjectAddress,
			"scanFileFilter" : scanFileFilter,
		  "stringReplaceRule" : stringReplaceRule
		};
		fs.writeFile(wmscfmConfigFilePath,JSON.stringify(config),function (err){
			if (err)
				showError(err.toString());
			else
				showSuccess("保存成功");
		});
	});

	$('#button-scanfile').click(function() {
		var btn = $(this);					
		btn.button('loading');
		$("#div-file-list").empty()				
		fs.readFile(wmscfmConfigFilePath,function(err,data){
			if (err) { 
				showError(err.toString());
        btn.button('reset');
				return;
			}
			var configFile = JSON.parse(data);
			var scanProjectAddress = configFile.scanProjectAddress;
			var scanFileFilter = configFile.scanFileFilter;
			var asyncTasks = [];
			$.each(scanProjectAddress,function() {
          var filePath = this.toString();
					asyncTasks.push(function(callback) {
						scanFile(filePath, scanFileFilter, callback);
					});					
			});
      async.parallel(asyncTasks,function() {
        btn.button('reset');
      });
		});
	});

	$('#btn-save-singleFile').click(function() {
		if (currentFilePath) {
			var editfile = editor.getValue(os.EOL);
		 	fs.chmod(currentFilePath, '0777', function (err) {
   			if (err) {
      		showError(err.toString());
					return;
				}
				fs.writeFile(currentFilePath, editfile,function (err){
					if (err)
						showError(err.toString());
					else
						showSuccess("保存成功");
				});	
			});
		}
	});
	
	$('#changeConfigToTest').click(function() {
		changeAllConfigFile(1,2,0);
	});
	$('#changeConfigToPre').click(function() {
		changeAllConfigFile(0,2,1);
	});
	$('#changeConfigToLine').click(function() {
		changeAllConfigFile(0,1,2);
	});
});

function changeAllConfigFile(fromOne,fromTwo,to){
	fs.readFile(wmscfmConfigFilePath,function (err, data) {
		if (err) {
			showError(err.toString());
			return;
		}						
		var config = JSON.parse(data);							
		var tempStringReplaceRule = new Array();
		$.each(config.stringReplaceRule,function() {
			tempStringReplaceRule.push(this);
		});
		var asyncTasks = [];
		$('#div-file-list .filePath').each(function() {
			var filePath = $(this).attr('title');
			asyncTasks.push(function(callback){
				changeOneConfigFile(filePath,tempStringReplaceRule,fromOne,fromTwo,to,callback);
			});	
		});
		async.parallel(asyncTasks, function(){
			showSuccess("执行完毕.");
		});		
	});
}

function changeOneConfigFile(filePath, stringReplaceRule,fromOne,fromTwo,to,callback) {
	fs.chmod(filePath, '0777', function (err) {
   	if (err) {
    	showError(err.toString());
			callback();
			return;
		}
		fs.readFile(filePath,'utf8',function(err,data){
			if (err) { 
				showError(err.toString());
				callback();
				return;
			}
			$.each(stringReplaceRule,function(){
				var regexOne = new RegExp(this[fromOne], "g");
				var regexTwo = new RegExp(this[fromTwo], "g");
				data = data.replace(regexOne,this[to]);
				data = data.replace(regexTwo,this[to]);
			});
			fs.writeFile(filePath, data, 'utf8', function (err){
				if(err) {
					showError(err.toString());
					callback();
				}
				callback();
			});
		});
	});
}
