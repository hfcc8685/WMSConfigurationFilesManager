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

function scanFile(filePath,scanFileFilter,callback) {
	var fileStat = fs.statSync(filePath);
	if(fileStat.isDirectory()) {	
		fs.readdir(filePath,function(err,childPaths) {
			if(err) { 
				showError(err.toString());
        callback(err);
				return;
			}
			if(childPaths.length >0) {
        var asyncTasks = []; 
        $.each(childPaths,function() {
					var childPath = path.join(filePath,this.toString());
          asyncTasks.push(function(childCallback) {
            scanFile(childPath,scanFileFilter,childCallback);
          });
				});
        async.parallel(asyncTasks,function() { 
          callback(); 
        });
			} else {
				callback();
			}
		});
	} else if (fileStat.isFile()) {
		var fileName = path.basename(filePath);
		$.each(scanFileFilter,function() {
			if(fileName.match(this) == null) return;
			var a = document.createElement("A");
			var icon = document.createElement("span");
			icon.className = 'glyphicon glyphicon-file';			
			a.appendChild(icon);
			a.appendChild(document.createTextNode(" "+fileName));
			a.href = '#';
			a.className = 'list-group-item filePath';
			a.setAttribute("data-toggle", "tooltip");
			a.setAttribute("data-placement", "left");
			a.setAttribute("title", filePath);
			a.addEventListener("click", function(){
			  $('.list-group-item').removeClass('active');	
				$(this).addClass("active");
				showFileContent(filePath);
		 	}, false);
			$('#div-file-list').append(a);
	 	});
		callback();
	} else {
		callback();
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
