Ext.ux.detailGrid = Ext.extend(Ext.grid.GridPanel,{
	border:false,
	stripeRows:false,
	loadMask: true,
	contextFileMenu:null,
	contextFolderMenu: null,
	contextMenu:null,
	initComponent: function () {
		var me = this;
		var config = {
			store:me.createStore(),
			columns:me.createColumns(),
			listeners:{
				scope:me,
				rowcontextmenu:me.onRowRightClick,
				containercontextmenu:me.bodyRowClick,
				celldblclick:me.onDoubleClickRow
			}
		};
		
		me.addEvents('listenchangenode');
		
		Ext.apply(me, config);
		Ext.apply(me.initialConfig, config);
		Ext.ux.detailGrid.superclass.initComponent.apply(me, arguments);		
	},
	
	onRowRightClick:function(grid,rowIndex,e){
		e.preventDefault();
		grid.getSelectionModel().selectRow(rowIndex);
		rec = grid.getStore().getAt(rowIndex);
		if(rec.data.file_type != 'Folder'){
			var c = grid.contextFileMenu;
			c.record = rec;
			c.showAt(e.getXY());
		}else{
			var c = grid.contextFolderMenu;
			c.record = rec;
			c.showAt(e.getXY());		
		}
	},
	
	bodyRowClick:function(grid,e){
		e.preventDefault();
		var c = grid.contextMenu;
		c.showAt(e.getXY());
	},
	
	onDoubleClickRow:function(grid,index){
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
				view:'detail'
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
			]
		});
		
		return this.storeData;
	},
	
	nodeChange:function(node){
		this.storeData.baseParams.node = node;
		this.storeData.reload();
	},
	
	formatDate:function(val){
		return Ext.util.Format.date(val,'m-d h:i a');
	},
	
	formatFileSize:function(val,meta,record){
		if(record.data.file_type != 'Folder'){
			return Ext.util.Format.fileSize(val);	
		}else{
			return '';
		}
	},
	
	showIcon:function(value, data, record, rowIndex){
		return String
				.format(
						'<div><img class="x-panel-inline-icon " src="{0}" /></div>',value);		
	},
	
	createColumns:function(){
		var me = this;
		return [
			{dataIndex:'file_icon',header:'',width:30,menuDisabled:true,sortable:false,resizable :false,renderer:me.showIcon},
			{dataIndex:'file_name',header:'Name',width:230,menuDisabled:true,sortable:false},
			{dataIndex:'file_size',header:'Size',width:80,menuDisabled:true,sortable:false,renderer:me.formatFileSize},
			{dataIndex:'file_type',header:'Type',width:80,menuDisabled:true,sortable:false},
			{dataIndex:'file_modified',header:'Date Modified',width:120,menuDisabled:true,sortable:false,renderer:me.formatDate}
		];
	},
	
	reloadStore:function(){
		this.storeData.reload();
	}
});

Ext.reg('detailGrid',Ext.ux.detailGrid);