sap.ui.define([
	"./util/BaseController"
], function(BaseController) {
	"use strict";
	return BaseController.extend("com.perezjquim.ytc.pwa.controller.Home", {

		API_BASE_URL: "https://perezjquim-ytc.herokuapp.com",

		onPressDownload: function() {
			this.setBusy(true);

			const oPromptModel = this.getModel("config");
			const oPromptData = oPromptModel.getData();

			const oSearchParams = new URLSearchParams(oPromptData);
			const sSearchParams = oSearchParams.toString();

			const sDownloadUrl = `${this.API_BASE_URL}/crop-video?${sSearchParams}`;
			window.open(sDownloadUrl);

			this.setBusy(false);
		}

	});
});