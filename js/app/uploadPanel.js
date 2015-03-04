Ext.ux.uploadPanel = Ext.extend(Ext.Panel,{
	layout:'fit',
	region:'south',
	height:200,
	initComponent: function () {
		
		var me = this;
		var config = {
			items:[
				me.createObjUpload()
			]
		};
		
		me.addEvents('afterupload');
		
		Ext.apply(me, config);
		Ext.apply(me.initialConfig, config);
		Ext.ux.uploadPanel.superclass.initComponent.apply(me, arguments);		
	},
	
	createObjUpload:function(){
		this.objUpload = new AwesomeUploader({
			border:false,
			gridWidth:880,
			gridHeight:150,
			frame:true,
			flashButtonSprite:'js/extjs/ux/swfupload_browse_button_trans_56x22.PNG',
			flashSwfUploadPath:'js/extjs/ux/swfupload.swf',
			iconStatusAborted:'js/extjs/ux/cross.png',
			iconStatusDone:'js/extjs/ux/tick.png',
			iconStatusError:'js/extjs/ux/cross.png',
			iconStatusPending:'js/extjs/ux/hourglass.png',
			iconStatusSending:'js/extjs/ux/loading.gif',
			flashUploadUrl:'src/upload.php',
			extraPostData:{
				node:''
			},
			listeners:{
				scope:this,
				fileupload:this.onFireUpload
			}
		});
		
		return this.objUpload;
	},
	
	openDialog:function(){
		this.openDialogFile.openDialogFile();
	},
	
	onFireUpload:function(obj,success,response){
		if(success){
			this.fireEvent('afterupload',this);
		}
	},
	
	setNodePath:function(node){
		this.objUpload.extraPostData.node = node;
	}
});