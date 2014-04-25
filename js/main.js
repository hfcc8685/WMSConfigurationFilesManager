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

			var icon = document.createElement("span");
			icon.className = 'glyphicon glyphicon-file';			
			a.appendChild(icon);
			a.appendChild(document.createTextNode(" "+fileName));
			a.href = '#';
			a.className = 'list-group-item';
			// data-toggle="tooltip" data-placement="left" title="Tooltip on left"
			a.setAttribute("data-toggle", "tooltip");
			a.setAttribute("data-placement", "left");
			a.setAttribute("title", filePath);

			a.addEventListener("click", function(){
			  $('.list-group-item').removeClass('active');	
				$(this).addClass("active");
				showFileContent(filePath);
		 	}, false);
			//if ($('#DivID').length) {
    	//}
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
		currentFilePath = filePath;
		editor.setValue(String(data));
	});	
}

function createFolder(folderName) {
	var div = document.createElement("div");
	div.appendChild(document.createTextNode(folderName));
	div.className = 'list-group-item list-group-item-info';
	$('#div-file-list').append(div);
}
