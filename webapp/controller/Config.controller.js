sap.ui.define([
	"./util/BaseController",
	"sap/ui/util/Storage"
], function(BaseController, Storage) {
	"use strict";
	return BaseController.extend("com.perezjquim.iglivemode.pwa.controller.Config", {
		onConfigChange: function() {
			const oModel = this.getModel("config");
			const oConfig = oModel.getData();
			const sConfig = JSON.stringify(oConfig);
			Storage.put("config", sConfig);
		}
	});
});