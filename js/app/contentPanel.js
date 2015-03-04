Ext.ux.contentPanel = Ext.extend(Ext.Panel,{
	border:false,
	layout:'card',
	region:'center',
	activeItem:0,
	title:'Addres :',
	iconCls:'icon-folder-home',
	node:'',
	nodeTmp:null,
	recSelected:null,
	initComponent: function () {		
		var me = this;

		me.contextFolderMenu =  new Ext.menu.Menu({
			items:[
				//{pid:1,text:'Upload File(s)...'},
				//'-',
				//{pid:2, text:'Custom Properties...'},
				//'-',
				{pid:3,text:'Copy'},
				{pid:4,text:'Cut'},
				{pid:5,text:'Paste'},
				'-',
				{pid:6,text:'Rename...'},
				{pid:7,text:'Delete'}
			],
			listeners:{
				scope:me,
				itemclick:me.oncontextMenuItemClcik,
				show:me.onShowFolderMenu
			}			
		});		
		
		me.contextFileMenu = new Ext.menu.Menu({
			items:[
				//{pid:8,text:'Update File...'},
				//'-',
				{pid:9,text:'Open/Download'},
				//'-',
				//{pid:2,text:'Custom Properties..'},
				'-',
				{pid:3, text:'Copy'},
				{pid:4, text:'Cut'},
				'-',
				{pid:6,text:'Rename..'},
				{pid:7,text:'Delete'}
			],
			listeners:{
				scope:me,
				itemclick:me.oncontextMenuItemClcik
			}
		});
		
		me.contextMenu = new Ext.menu.Menu({
			items:[
				{pid:1, text:'New Folder...'},
				//{pid:2, text:'Upload File(s)...'},
				'-',
				{
					pid:3,
					text:'View',
					menu:{
						items:[
							{text:'Extra large icons',checked:false,group:'view-menu_1',pid:1},
							{text:'Large icons',checked:false,group:'view-menu_1',pid:2},
							{text:'Medium icons',checked:false,group:'view-menu_1',pid:3},
							{text:'Details',checked:true,group:'view-menu_1',pid:4}					
						],
						listeners:{
							scope:me,
							itemclick:me.viewChange
						}
					}
				},
				{pid:4, text:'Paste'},
				{pid:5, text:'Refresh'}
			],
			listeners:{
				scope:me,
				itemclick:me.menuBodyChange,
				show:me.onmenuBodyShow
			}
		});		
		var config = {
			items:[
				me.createDetailGrid(),
				me.createMediumView(),
				me.createLargeView(),
				me.createExtraView()
			]
		};
		
		me.addEvents('menuviewchange','listenchangenode','aftersuccess','aftercopycut','afterpaste');
		
		me.operation = new OperationFunction({
			listeners:{
				scope:me,
				aftersuccess:me.onOperationSuccess				
			}
		});
		
		Ext.apply(me, config);
		Ext.apply(me.initialConfig, config);
		Ext.ux.contentPanel.superclass.initComponent.apply(me, arguments);		
		
	},
	
	onShowFolderMenu:function(menu){
		if(this.nodeTmp){
			menu.items.items[2].enable();			
		}else{
			menu.items.items[2].disable();
		}

	},
	
	onmenuBodyShow:function(menu){
		if(this.nodeTmp){
			menu.items.items[3].enable();
		}else{
			menu.items.items[3].disable();
		}
		
	},
	
	menuBodyChange:function(item){
		switch(item.pid){
			
			case 1:
				this.operation.newFolder(item.id,this.node);
				break;
			
			case 4:
				if(this.nodeTmp.action == 'copy'){
					this.operation.copyAction(
						this.nodeTmp.node,
						this.node,
						this.nodeTmp.file_name
					);
				}
				
				if(this.nodeTmp.action == 'cut'){
					this.operation.cutAction(
						this.nodeTmp.node,
						this.node,
						this.nodeTmp.file_name
					);
				}				
			
				if(this.nodeTmp.action =='cut')
					this.nodeTmp = null;
				break;
				
				this.fireEvent('afterpaste',this.nodeTmp);
				
			case 5:
				this.layout.activeItem.reloadStore();
				break;
				
		};
	},
	
	oncontextMenuItemClcik:function(item){
		this.recSelected = item.parentMenu.record;
		switch(item.pid){
			
			case 3:
			
				this.nodeTmp = {
					action:'copy',
					file_name:this.recSelected.data.file_name,
					node:this.recSelected.data.file_dir
				};
				
				this.fireEvent('aftercopycut',this.nodeTmp);
				break;
			
			case 4:
			
				this.nodeTmp = {
					action:'cut',
					file_name:this.recSelected.data.file_name,
					node:this.recSelected.data.file_dir
				};
				
				this.fireEvent('aftercopycut',this.nodeTmp);
				break;
				
			case 5:
			
				if(this.nodeTmp.action == 'copy'){
					this.operation.copyAction(
						this.nodeTmp.node,
						this.recSelected.data.file_dir,
						this.nodeTmp.file_name
					);
				}
				
				if(this.nodeTmp.action == 'cut'){
					this.operation.cutAction(
						this.nodeTmp.node,
						this.recSelected.data.file_dir,
						this.nodeTmp.file_name
					);
				}				
							
			
				if(this.nodeTmp.action =='cut')
					this.nodeTmp = null;
				break;
				
				this.fireEvent('afterpaste',this.nodeTmp);
				
			case 6:
				this.operation.renameAction(
					item.id,
					item.parentMenu.record.data.file_dir,
					item.parentMenu.record.data.file_name
				);				
				break;
			
			case 7:
				this.operation.removeAction(item.parentMenu.record.data.file_dir);
				break;
			
			case 9:
				window.open(this.recSelected.data.file_dir);
				break;
		}
	},
	
	viewChange:function(item){
		this.fireEvent('menuviewchange',item.pid);
		this.changeActiveView(item.pid);
	},
	
	changeActiveView:function(pid){
		switch(pid){
			case 1:
				this.layout.setActiveItem(this.extraView);
			break;
			case 2:
				this.layout.setActiveItem(this.largeView);
			break;
			
			case 3:
				this.layout.setActiveItem(this.mediumView);
			break;
			
			case 4:
				this.layout.setActiveItem(this.detailGrid);
			break;
		}
		
		this.changeNode(this.node);
	},
	
	onOperationSuccess:function(action,node,text){
		if(action=='new'){			
			this.layout.activeItem.reloadStore();
		}
		
		if(action=='rename'){			
			this.layout.activeItem.reloadStore();
		}
		
		if(action=='copy'){
			this.layout.activeItem.reloadStore();
		}
		
		if(action=='cut'){
			this.layout.activeItem.reloadStore();
		}		
		
		if(action=='delete'){
			if(this.recSelected){
				this.layout.activeItem.storeData.remove(this.recSelected);
				this.recSelected = null;
			}
		}
		
		this.fireEvent('aftersuccess',action,node,text);
	},
	
	createDetailGrid:function(){
		this.detailGrid = new Ext.ux.detailGrid({
			contextMenu:this.contextMenu,
			contextFileMenu:this.contextFileMenu,
			contextFolderMenu:this.contextFolderMenu,
			listeners:{
				scope:this,
				listenchangenode:this.fireListenChangeNode
			}
		});
		
		return this.detailGrid;
	},
	
	fireListenChangeNode:function(o,dir){
		this.fireEvent('listenchangenode',this,dir);
		this.changeNode(dir);
	},
	
	createMediumView:function(){
		this.mediumView = new Ext.ux.mediumView({
			contextMenu:this.contextMenu,
			contextFileMenu:this.contextFileMenu,
			contextFolderMenu:this.contextFolderMenu, 
			listeners:{
				scope:this,
				listenchangenode:this.fireListenChangeNode
			}			
		});		
		
		return this.mediumView;
	},
	
	createExtraView:function(){
		this.extraView = new Ext.ux.extraView({
			contextMenu:this.contextMenu,
			contextFileMenu:this.contextFileMenu,
			contextFolderMenu:this.contextFolderMenu, 
			listeners:{
				scope:this,
				listenchangenode:this.fireListenChangeNode
			}		
		});
		
		return this.extraView;
	},
	
	createLargeView:function(){
		this.largeView = new Ext.ux.largeView({
			contextMenu:this.contextMenu,
			contextFileMenu:this.contextFileMenu,
			contextFolderMenu:this.contextFolderMenu, 
			listeners:{
				scope:this,
				listenchangenode:this.fireListenChangeNode
			}		
		});
		
		return this.largeView;
	},
	
	changeNode:function(node){
		this.node = node;
		this.setTitle('Address : ' + node);
		this.layout.activeItem.nodeChange(node);
	},
	
	refreshNode:function(){
		this.layout.activeItem.nodeChange(this.node);
	},
	
	removeNode:function(node){		
		var store = this.layout.activeItem.storeData;
		store.reload();
		/**
		 * still does not working :(
		var rec = store.find('file_dir',node);
		if(rec){
			store.remove(rec);
		}
		**/
	}
	
});

Ext.reg('contentPanel', Ext.ux.contentPanel);