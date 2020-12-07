sap.ui.define([
		'jquery.sap.global',
		'sap/m/MessageToast',
		'sap/m/UploadCollectionParameter',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel'
	], function(jQuery, MessageToast, UploadCollectionParameter, Controller, JSONModel) {
	"use strict";

	var PageController = Controller.extend("sap.m.sample.UploadCollection.Page", {
		onInit: function () {
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ztest_mr_1_srv/");
			this.getView().setModel(oModel);
		},

		onChange: function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			var oSecurityToken = this.getView().getModel().getSecurityToken();

			// Header Token
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name : "x-csrf-token",
				value : oSecurityToken
			});
			// Header Slug
			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name : "slug",
				value : oEvent.getParameter("files")[0].name
			});

			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			oUploadCollection.addHeaderParameter(oCustomerHeaderSlug);
			MessageToast.show("Event change triggered");
		},

		onFileDeleted: function(oEvent) {
			var oModel = this.getView().getModel();
			var oItem = oEvent.getParameter("item");

			oModel.remove("/Files('" + oItem.getFileName() + "')/$value", null, function(){
				this.getView().getModel().refresh();
			}.bind(this),function(){
			   alert("Delete failed");
			});

			MessageToast.show("Event fileDeleted triggered");
		},

		onFilenameLengthExceed : function(oEvent) {
			MessageToast.show("Event filenameLengthExceed triggered");
		},

		onFileRenamed: function(oEvent) {
			var oData = this.oView.getModel().getData();
			var aItems = oData.items;
			var sDocumentId = oEvent.getParameter("documentId");
			jQuery.each(aItems, function(index) {
				if (aItems[index] && aItems[index].documentId === sDocumentId) {
					aItems[index].fileName = oEvent.getParameter("item").getFileName();
				};
			});
			this.oView.getModel().setData(oData);
			MessageToast.show("Event fileRenamed triggered");
		},

		onFileSizeExceed : function(oEvent) {
			MessageToast.show("Event fileSizeExceed triggered");
		},

		onTypeMissmatch : function(oEvent) {
			MessageToast.show("Event typeMissmatch triggered");
		},

		onUploadComplete: function(oEvent) {
			this.getView().getModel().refresh();
		},

		onPress: function (oEvent) {
			MessageToast.show(oEvent.getSource().getId() + " Pressed");
		},

		onSelectChange:  function(oEvent) {
			var oUploadCollection=sap.ui.getCore().byId(this.getView().getId() + "--UploadCollection");
			oUploadCollection.setShowSeparators(oEvent.getParameters().selectedItem.getProperty("key"));
		}
	});

	return PageController;
});
