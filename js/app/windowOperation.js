Ext.ux.windowOperation = Ext.extend(Ext.Window,{
	title:'New Folder',
	url:null,
	node:null,
	parentNode:'',
	action:'new',
	closeAction:'hide',
	layout:'fit',
	height:120,
	modal:true,
	border:false,
	width:250,
	initComponent:function(){
		var me = this;
		var config = {
			items:[
				me.createForm()
			],
			buttons:me.createButton()
		};
		
		me.addEvents('aftersuccess');		
		Ext.apply(me, config);
		Ext.apply(me.initialConfig, config);
		Ext.ux.windowOperation.superclass.initComponent.apply(me, arguments);			
		
	},
	
	createForm:function(){
		this.form = new Ext.FormPanel({
			border:false,
			frame:true,
			bodyStyle:'padding:2px 2px 0',
			defaultType: 'textfield',
			labelWidth:75,
	        defaults: {
	            anchor: '100%',
	            labelSeparator:''
	        },
			items:[
				{name:'text_item',fieldLabel:'Folder Name',allowBlank:false}
			]
		});
		
		return this.form;
	},
	
	resetText:function(){
		this.form.get(0).reset();
	},
	
	setLabel:function(text){
		var txt = this.form.get(0);
		txt.label.update(text);
	},
	
	setText:function(txt){
		this.form.getForm().setValues({text_item:txt});
	},
		
	createButton:function(){
		return [
			{text:'Ok',scope:this,handler:this.onSubmitForm},
			{text:'Cancel',scope:this,handler:this.onCancelButton}
		]
	},
	
	onCancelButton:function(btn){
		this.hide();
	},
	
	onSubmitForm:function(btn){
		var me = this;
		if(me.form.getForm().isValid()){
			me.form.getForm().submit({
				url:me.url,
				waitMsg:'Running Command Operation, Please wait..',
				params:{
					action:me.action,
					node:me.node,
					parentNode:me.parentNode
				},
				success:function(){
					me.hide();
					me.fireEvent('aftersuccess',me.action,me.node,me.form.getForm().getValues().text_item);
				},
				failure:function(form, action) {
					
			        switch (action.failureType) {
			            case Ext.form.Action.CLIENT_INVALID:
			                Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
			                break;
			            case Ext.form.Action.CONNECT_FAILURE:
			                Ext.Msg.alert('Failure', 'Ajax communication failed');
			                break;
			            case Ext.form.Action.SERVER_INVALID:
			               Ext.Msg.alert('Failure', action.result.msg);
			       }
			       
      			}
      			
			});	
		}
	}
	
});