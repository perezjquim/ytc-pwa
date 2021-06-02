sap.ui.define([
	"./util/BaseController"
], function(BaseController) {
	"use strict";
	return BaseController.extend("com.perezjquim.iglivemode.pwa.controller.Home", {

		API_BASE_URL: "https://perezjquim-ig-live-mode.herokuapp.com",

		onPressEnableLive: function(oEvent) {
			this._callEndpoint("enable-live");
		},

		onPressDisableLive: function(oEvent) {
			this._callEndpoint("disable-live");
		},

		_callEndpoint: function(sEndpoint) {
			this.setBusy(true);

			const oConfigModel = this.getModel("config");
			const sIGUser = oConfigModel.getProperty("/iguser");
			const sIGPw = oConfigModel.getProperty("/igpw");

			if (sIGUser && sIGPw) {

				const oBody = {
					"user": sIGUser,
					"pw": sIGPw
				};

				fetch(`${this.API_BASE_URL}/${sEndpoint}`, {
					method: "POST",
					body: JSON.stringify(oBody)
				}).finally(() => this.setBusy(false));

			} else {

				this.setBusy(false);
				this.toast(this.getText("userpass_required"));
			}
		}
	});
});