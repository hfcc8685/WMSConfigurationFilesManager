function ShowSuccess (message){
	BootstrapDialog.show({
		title: '成功',
		message: message,
		type: BootstrapDialog.TYPE_SUCCESS,
		buttons: [{
			id: 'btn-ok',
			icon: 'glyphicon glyphicon-check',
			label: 'OK',
			cssClass : 'btn-success',
			autospin: false,
			action: function(dialogRef) {
				dialogRef.close();
			}
		}]
	});
}

function ShowError (message) {
	BootstrapDialog.show({
		title: '错误',
		message: message,
		type: BootstrapDialog.TYPE_DANGER,
		buttons: [{
			id: 'btn-error',
			icon: 'glyphicon glyphicon-fire',
			lable: 'OK',
			cssClass: 'btn-danger',
			autospin: false,
			action: function (dialogRef) {
				dialogRef.close();
			}			
		}]
	});
}

function scanFile(path,scanFileFilter) {
	if(fs.statSync(path).isDirectory()) {
		fs.readdir(path,function(err,files) {
			if(err) return;
			$.each(files,function() {
				var file = fs.statSync(path+"\\"+this.toString());
				var fileName = this.toString();
				if(file.isDirectory()) {
					scanFile(path+"\\"+fileName,scanFileFilter);
				}
				else {
					if(file.isFile()) {
						$.each(scanFileFilter,function() {
							if(fileName.match(this)) {
								var filePath = path.toString()+"\\"+fileName.toString();	
								filePath=filePath.replace(/\\/g,"\\\\");
								$('#div-file-list').append("<a href=\"#\" class=\"list-group-item list-group-item-success\" onclick=\"showFileContent(\'"+filePath+"\')\">" 
																			+fileName
																			+"</a>");
							}	
						});
					}
				}
			});
		});
	}
}

function showFileContent(filePath) {
		fs.readFile(filePath,function (err, data) {
							if (err) {
								ShowError(err.toString());
								return;
							}						
							editor.setValue(String(data));
						});	
}
