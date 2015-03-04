Ext.ux.largeView = Ext.extend(Ext.Panel,{
	border:false,
	layout:'fit',
	contextFileMenu:null,
	contextFolderMenu: null,
	contextMenu:null,
	autoScroll:true,
	initComponent: function () {
		var me = this;
		var config = {
			id:'images-view-large',
			items:[
				me.createDataView()
			]
		};
		
		me.addEvents('listenchangenode');
		
		Ext.apply(me, config);
		Ext.apply(me.initialConfig, config);
		Ext.ux.largeView.superclass.initComponent.apply(me, arguments);				
	},
	
	onRowRightClick:function(view,rowIndex,node,e){

		e.preventDefault();
		view.select(rowIndex);
		rec = this.storeData.getAt(rowIndex);
		if(rec.data.file_type != 'Folder'){
			var c = this.contextFileMenu;
			c.record = rec;
			c.showAt(e.getXY());
		}else{
			var c = this.contextFolderMenu;
			c.record = rec;
			c.showAt(e.getXY());
		}
	},
	
	bodyRowClick:function(view,e){
		e.preventDefault();
		var c = this.contextMenu;
		c.showAt(e.getXY());
	},
	
	onDoubleClickRow:function(view,index){
		var record = this.storeData.getAt(index);
		if(record.data.file_type =='Folder'){
			this.fireEvent('listenchangenode',this,record.data.file_dir);
		}
	},	
	
	createStore:function(){
		this.storeData = new Ext.data.JsonStore({
			url:'src/getDetails.php',
			autoDestroy:true,
			baseParams:{
				node:'',
				view:'large'
			},
			root:'data',
			successProperty:'success',
			fields:[
				{name:'file_icon',type:'string'},
				{name:'file_dir', type:'string'},
				{name:'file_name',type:'string'},
				{name:'file_id', type:'string'},
				{name:'file_size', type:'float'},
				{name:'file_type', type:'string'},
				{name:'file_modified',type:'date',dateFormat : 'timestamp'}
			],
			listeners:{
				scope:this,
				load:function(){
					this.body.unmask();
				},
				beforeload:function(){
					this.body.mask('loading...','x-mask-loading');
				}
			}
		});
		
		return this.storeData;		
	},
	
	nodeChange:function(node){

		this.storeData.baseParams.node = node;
		this.storeData.reload();
	},
	
	reloadStore:function(){
		this.storeData.reload();
	},
	
	createTemplate:function(){
		var tpl =  new Ext.XTemplate(
					'<tpl for=".">',
			            '<div class="thumb-wrap" id="{file_id}">',
					    '<div class="thumb"><img src="{file_icon}" title="{file_name}"></div>',
					    '<span class="x-editable">{shortName}</span></div>',
			        '</tpl>',
			        '<div class="x-clear"></div>'
		);
		
		return tpl;
	},
	
	createDataView:function(){
		var me = this;
		this.dataView = new Ext.DataView({
            store: this.createStore(),
            tpl: this.createTemplate(),
            singleSelect: true,
            overClass:'x-view-over',
            itemSelector:'div.thumb-wrap',
            emptyText: '',
	        prepareData: function(data){
	        	 data.shortName = Ext.util.Format.ellipsis(data.file_name, 15);
	        	 return data;
	        },
			listeners:{
				scope:me,
				contextmenu:me.onRowRightClick,
				containercontextmenu:me.bodyRowClick,
				dblclick:me.onDoubleClickRow
			}	        
		});
		
		return this.dataView;
	}
});