function showSuccess (message){
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

function showError (message) {
	BootstrapDialog.show({
		title: '错误',
		message: message,
		type: BootstrapDialog.TYPE_DANGER,
		buttons: [{
			id: 'btn-error',
			icon: 'glyphicon glyphicon-fire',
			label: 'OK',
			cssClass: 'btn-danger',
			autospin: false,
			action: function (dialogRef) {
				dialogRef.close();
			}			
		}]
	});
}

function scanFile(filePath,scanFileFilter) {
	var fileStat = fs.statSync(filePath);
	if(fileStat.isDirectory()) {
		fs.readdir(filePath,function(err,childPaths) {
			if(err) { 
				showError(err.toString());
				return;
			}
			$.each(childPaths,function() {
				var childPath = path.join(filePath,this.toString());
				scanFile(childPath,scanFileFilter);
			});
		});
	}
	if (fileStat.isFile()) {
		var fileName = path.basename(filePath);
		$.each(scanFileFilter,function() {
			if(fileName.match(this) == null) return;
			var a = document.createElement("A");
			var text = document.createTextNode(fileName);
			a.appendChild(text);
			a.href = '#';
			a.className = 'list-group-item list-group-item-success';
			a.addEventListener("click", function(){ showFileContent(filePath) }, false);
			$('#div-file-list').append(a);
	 	});
	}
}

function showFileContent(filePath) {
	fs.readFile(filePath,function (err, data) {
		if (err) {
			showError(err.toString());
			return;
		}						
		editor.setValue(String(data));
	});	
}
