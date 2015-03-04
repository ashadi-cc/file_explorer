Ext.ux.mainPanel = Ext.extend(Ext.Panel,{
	height:600,
	width:900,
	layout:'border',
	firstLoad:true,
	root:'resources',
	initComponent: function () {
		var me = this;
		var config = {
			tbar:me.createTbar(),
			items:[
				me.createWestPanel(),
				me.createContentPanel(),
				me.createUploadPanel()
			]
		};
		
		Ext.apply(me, config);
		Ext.apply(me.initialConfig, config);
		Ext.ux.mainPanel.superclass.initComponent.apply(me, arguments);								
	},
	
	createWestPanel:function(){
		var me = this;
		
		this.folderPanel = new Ext.ux.folderPanel({
			rootId:me.root,
			listeners:{
				scope:me,
				click:me.onClickNode,
		        load:function(node){
		        	if(this.firstLoad){
		        		node.select();
		        		this.onClickNode(node);
		        	}		        			        	
		        	this.firstLoad = false;
		        },
		        aftercopycut:function(n){
		        	this.contentPanel.nodeTmp = n;
		        },
		        afterpaste:function(n){
		        	this.contentPanel.nodeTmp = n;
		        },
		        remove:me.onRemoveNode
			}		
		});
		
		this.contentFolderPanel = new Ext.Panel({
			region:'west',
			layout:'border',
			width:250,
			split:true,
			border:true,
		    cmargins: '2 2 2 2',
			margins: '2 0 2 2',	
			minSize:150,
			collapsible:true,
			title:'Folder',
			iconCls:'icon-folder',
			items:[this.folderPanel]			
		});
		
		return this.contentFolderPanel;
	},
	
	onClickNode:function(node){
		this.contentPanel.changeNode(node.id);
		this.uploadPanel.setNodePath(node.id);
	},
	
	onRemoveNode:function(tree,parent,node){
		this.contentPanel.removeNode(node.id);
		parent.select();
		this.uploadPanel.setNodePath(parent.id);
	},
		
	createContentPanel:function(){
		this.contentPanel = new Ext.ux.contentPanel({
			listeners:{
				scope:this,
				menuviewchange:function(pid){
					this.menuView.items.items[(pid-1)].setChecked(true);
				},
				listenchangenode:function(o,node){
					this.folderPanel.expandNode(node);
					this.uploadPanel.setNodePath(node);
				},
				aftersuccess:function(action,node,text){
					this.folderPanel.afterSuccessOperation(action,node,text);
				},
		        aftercopycut:function(n){
		        	this.folderPanel.nodeTmp = n;
		        },
		        afterpaste:function(n){
		        	this.folderPanel.nodeTmp = n;
		        }				
			}
		});
		
		return {
			region:'center',
			layout:'border',
			border:true,
			margins:'2 2 2 0',
			items:[this.contentPanel]
		};
	},
	
	createUploadPanel:function(){
		this.uploadPanel = new Ext.ux.uploadPanel({
			border:false,
			margins:'0 2 2 2',
			listeners:{
				scope:this,
				afterupload:function(){
					this.contentPanel.refreshNode();
				}
			}
		});
		
		return this.uploadPanel;
	},
	
	changeView:function(item){
		var menu_item_view = this.contentPanel.contextMenu.items.items[2];
		menu_item_view.menu.items.items[(item.pid-1)].setChecked(true);
		this.contentPanel.changeActiveView(item.pid);
	},
	
	createTbar:function(){
		
		var me =this;
		me.menuView = new Ext.menu.Menu({
			items:[
				{text:'Extra large icons',checked:false,group:'view-menu',pid:1},
				{text:'Large icons',checked:false,group:'view-menu',pid:2},
				{text:'Medium icons',checked:false,group:'view-menu',pid:3},
				{text:'Details',checked:true,group:'view-menu',pid:4}
			],
			listeners:{
				scope:me,
				itemclick:me.changeView
			}			
		});
		
		return [
			{
				text:'<b>Views</b>',
				iconCls:'icon-view',
				menu:me.menuView
			},'-',{
				text:'<b>Folder</b>',
				iconCls:'icon-folder',
				scope:me,
				handler:me.toggleFolderPanel
			},'-',{
				text:'<b>Up</b>',
				iconCls:'icon-folder-up',
				scope:me,
				handler:me.upFolder
			}		
		];
	},
	
	toggleFolderPanel:function(btn){
		var me = this;
		me.contentFolderPanel.toggleCollapse();
	},
	
	upFolder:function(btn){
		var me = this;
		var node = me.folderPanel.getSelectionModel().getSelectedNode();
		if(node){
			var depth = node.getDepth();
			if(depth>0){
				var parentNode = node.parentNode;
				parentNode.select();
				me.onClickNode(parentNode);
			}
		}
	}
});

Ext.reg('mainPanel',Ext.ux.mainPanel);