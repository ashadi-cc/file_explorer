Ext.onReady(function(){
	
	Ext.QuickTips.init();	

	var win = new Ext.Window({
		title:'File Explorer',
		height:600,
		width:800,
		border:false,
		items:[
			new Ext.ux.mainPanel({
				root:'resources'
			})
		]
	}).show();
	
});