Ext.ux.folderPanel = Ext.extend(Ext.tree.TreePanel,{	
	dataUrl:'src/getFolder.php',
	rootId:null,
	region:'center',
	nodeTmp:null,
	initComponent: function () {
		var me = this;
		var config = {
			useArrows:false,
			autoScroll: true,
			animate: true,
			border: false,
			root:me.definedRoot(),
			contextMenu:new Ext.menu.Menu({
				items:[
					{id:'new-folder',text:'New Folder..'},
					//{id:'upload-file',text:'Upload File(s)..'},
					//'-',
					//{id:'custom-properties',text:'Custom Properties'},
					'-',
					{id:'file-copy',text:'Copy'},
					{id:'file-cut',text:'Cut'},
					{id:'file-paste',text:'Paste'},
					{id:'file-refresh',text:'Refresh'},
					'-',
					{id:'file-rename',text:'Rename..'},
					{id:'file-delete',text:'Delete'}
				],
				listeners:{
					scope:me,
					itemclick:me.menuItemClick
				}
			}),
		    listeners: {
		    	scope:me,
		        contextmenu: function(node, e) {
		            node.select();
		            this.disableandEnableMenu(node);
		            var c = node.getOwnerTree().contextMenu;
					if(this.nodeTmp){
						c.get('file-paste').enable();
					}else{
						c.get('file-paste').disable();
					}
		            c.contextNode = node;
		            c.showAt(e.getXY());
		        }
		    }			
		};
		
		me.operation = new OperationFunction({
			listeners:{
				scope:me,
				aftersuccess:me.onOperationSuccess				
			}
		});		
		
		me.addEvents('aftercopyput','afterpaste');
		Ext.apply(me, config);
		Ext.apply(me.initialConfig, config);
		Ext.ux.folderPanel.superclass.initComponent.apply(me, arguments);
	},
	
	disableandEnableMenu:function(node){
		depth = node.getDepth();
		if(depth){
			this.contextMenu.get('file-delete').enable();
			this.contextMenu.get('file-rename').enable();
			this.contextMenu.get('file-copy').enable();
			this.contextMenu.get('file-cut').enable();
		}else{
			this.contextMenu.get('file-delete').disable();
			this.contextMenu.get('file-rename').disable();
			this.contextMenu.get('file-copy').disable();
			this.contextMenu.get('file-cut').disable();
			
		}
		
	},
		
	definedRoot:function(){
		return {
			 nodeType: 'async',
			 text: 'resources',
			 id:this.rootId,
			 expanded:true
		};
	},
	
	getAbsolutePath:function(node){
		
		var arr_node = [];
		var parent;
		
		function getParent(node){
			arr_node.push(node.text);
			if(node.parentNode){
				parent = node.parentNode;				
				getParent(parent);
			}
		}
		
		getParent(node);		
		arr_node.reverse();
		
		return arr_node.join('/');
		
	},
	
	menuItemClick:function(item){
		switch(item.id){
			
			case 'new-folder':
				this.operation.newFolder(item.id,item.parentMenu.contextNode.id);
				break;
				
			case 'file-copy':
				var v_node = this.getAbsolutePath(item.parentMenu.contextNode);
				var arr_node = v_node.split('/');
				var file_name = arr_node[arr_node.length-1];
				
				this.nodeTmp = {
					action:'copy',
					file_name:file_name,
					node:v_node
				};
				
				this.fireEvent('aftercopycut',this.nodeTmp);
				
				break;
				
			case 'file-cut':
			
				var v_node = this.getAbsolutePath(item.parentMenu.contextNode);
				var arr_node = v_node.split('/');
				var file_name = arr_node[arr_node.length-1];
				
				this.nodeTmp = {
					action:'cut',
					file_name:file_name,
					node:v_node
				};
				
				this.fireEvent('aftercopycut',this.nodeTmp);
			
				break;
				
			case 'file-paste':
				var dest = this.getAbsolutePath(item.parentMenu.contextNode);
				if(this.nodeTmp.action == 'copy'){
					this.operation.copyAction(
						this.nodeTmp.node,
						dest,
						this.nodeTmp.file_name
					);
				}
				
				if(this.nodeTmp.action == 'cut'){
					this.operation.cutAction(
						this.nodeTmp.node,
						dest,
						this.nodeTmp.file_name
					);
				}					
			
				if(this.nodeTmp.action =='cut')
					this.nodeTmp = null;
					
				this.fireEvent('afterpaste',this.nodeTmp);
				
				break;
				
			case 'file-refresh':
				var n = item.parentMenu.contextNode;
				n.reload();
				break;
			case 'file-delete':
				this.operation.removeAction(item.parentMenu.contextNode.id);
				break;
				
			case 'file-rename':
				var n = item.parentMenu.contextNode;
				var file_dir = n.id;
				var arr_dir = file_dir.split('/');
				var file_name = arr_dir[arr_dir.length -1];
				this.operation.renameAction(item.id,file_dir,file_name);
				break;
		}
	},
	
	expandNode:function(n){
		var node  = this.getNodeById(n);
		if(node){
			node.select();
			node.expand();
		}
	},
	
	afterSuccessOperation:function(action,node,text){
		var fnode  = this.getNodeById(node);
		if(action == 'new'){			
			if(fnode){
				fnode.reload();
			}
		}
		
		if(action == 'copy'){
			if(fnode){
				fnode.reload();
			}
		}
		
		if(action =='cut'){
			if(fnode)
				fnode.remove();
			var fdest = this.getNodeById(text);
			if(fdest)
				fdest.reload();
		}
		
		if(action =='delete'){
			if(fnode){
				fnode.remove();
			}
		}
		
		if(action =='rename'){
			if(fnode){
				fnode.setText(text);
				var id_node = fnode.id;
				var arr_node = id_node.split('/');
				arr_node[arr_node.length-1] = text;
				var new_node_id = arr_node.join('/');
				fnode.id = new_node_id;
			}
		}
	},
	
	onOperationSuccess:function(action,node,text){
		var fnode = this.getSelectionModel().getSelectedNode();
		if(action =='new'){			
			if(fnode){
				fnode.reload();
				this.fireEvent('click',fnode,null);
			}
		}
		
		if(action =='copy'){			
			if(fnode){
				fnode.reload();
				this.fireEvent('click',fnode,null);
			}
		}
		
		if(action =='cut'){
			var fdest = this.getNodeById(node);
			if(fdest){
				fdest.remove();
			}
				
			if(fnode)
				fnode.reload();				
		}		
		
		if(action =='delete'){
			if(fnode){
				fnode.remove();
			}
		}
		
		if(action =='rename'){
			if(fnode){
				fnode.setText(text);
				var id_node = fnode.id;
				var arr_node = id_node.split('/');
				arr_node[arr_node.length-1] = text;
				var new_node_id = arr_node.join('/');
				fnode.id = new_node_id;
				this.fireEvent('click',fnode,null);
			}
		}
	}
	
	
});

Ext.reg('folderPanel', Ext.ux.folderPanel);