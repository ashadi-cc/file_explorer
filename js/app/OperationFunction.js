OperationFunction =  Ext.extend(Ext.util.Observable,{
	url:'src/file-operation.php',
	 constructor: function(config){
		this.windowOperation = new Ext.ux.windowOperation({
			url:this.url,
			listeners:{
				scope:this,
				aftersuccess:this.onSuccessSubmit
			}
		});
		
        this.addEvents({
            "aftersuccess" : true
        });
        
        this.listeners = config.listeners;		
        OperationFunction.superclass.constructor.call(this, config)		
		
	},
	
	newFolder :function(id,node){
		this.windowOperation.show(id);
		this.windowOperation.setTitle('New Folder');
		this.windowOperation.setLabel('Folder Name');
		this.windowOperation.action = 'new';
		this.windowOperation.node = node;
		this.windowOperation.resetText();
		
	},
	
	renameAction:function(id,node,text){
		var arr_node = node.split('/');
		var parentNode ='';
		
		for(i=0;i <= arr_node.length-2;i++){
			if (parentNode ==''){
				parentNode = arr_node[i];
			}else{
				parentNode += '/' + arr_node[i];
			}
		}
		
		
		this.windowOperation.show(id);
		this.windowOperation.setTitle('Rename');
		this.windowOperation.setLabel('New Name');
		this.windowOperation.action = 'rename';
		this.windowOperation.setText(text);
		this.windowOperation.node = node;
		this.windowOperation.parentNode = parentNode;
	},
	
	removeAction:function(node){
		var me = this;
		var v_node = node;
		Ext.MessageBox.confirm('Confirm','Are you soure to remove this item?',function(btn){
			if(btn=='yes'){
				Ext.Ajax.request({
					url:me.url,
					params:{
						action:'delete',
						node:node
					},
					success:function(response,opts){
						me.onSuccessSubmit('delete',v_node,'');
					},
					failure:function(reponse,opt){
						Ext.MessageBox.alert('Failure','server-side failure with status code ' + response.status);
					}
					
				});
			}
		});
	},
	
	copyAction:function(source,dest,file_name){
		var me = this;
		var node = source;
		var target = dest +'/' + file_name;
		Ext.Ajax.request({
			url:me.url,
			params:{
				action:'copy',
				node:node,
				target:target
			},
			success:function(response,opts){
				var res = response.responseText;
				var obj = Ext.decode(res);
				if(obj.success){
					me.onSuccessSubmit('copy',dest,'');
				}else{
					Ext.MessageBox.alert('Failure',obj.msg);
				}
				
			},
			failure:function(reponse,opt){
				Ext.MessageBox.alert('Failure','server-side failure with status code ' + response.status);
			}
			
		});
				
		
	},
	
	cutAction:function(source,dest,file_name){
		var me = this;
		var node = source;
		var target = dest +'/' + file_name;
		Ext.Ajax.request({
			url:me.url,
			params:{
				action:'cut',
				node:node,
				target:target
			},
			success:function(response,opts){
				var res = response.responseText;
				var obj = Ext.decode(res);
				if(obj.success){
					me.onSuccessSubmit('cut',source,dest);
				}else{
					Ext.MessageBox.alert('Failure',obj.msg);
				}
				
			},
			failure:function(reponse,opt){
				Ext.MessageBox.alert('Failure','server-side failure with status code ' + response.status);
			}
			
		});
				
		
	},
	
	onSuccessSubmit:function(action,node,text){
		this.fireEvent('aftersuccess',action,node,text);
	}
	
});