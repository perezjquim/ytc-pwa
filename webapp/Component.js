sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device"
], function(UIComponent, Device) {
	"use strict";

	return UIComponent.extend("com.perezjquim.iglivemode.pwa.Component", {

		metadata: {
			manifest: "json"
		},

		init: function() {
			this._validateCache();
			this._reloadConfig();

			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
		},

		_validateCache: function() {
			const oApplicationCache = window.applicationCache;
			if (oApplicationCache) {
				oApplicationCacheaddEventListener('updateready', function(e) {
					if (oApplicationCache.status == oApplicationCache.UPDATEREADY) {
						// Browser downloaded a new app cache.
						// Swap it in and reload the page to get the new hotness.
						oApplicationCache.swapCache();
						window.location.reload();
					} else {
						// Manifest didn't changed. Nothing new to server.
					}
				}, false);
			}
		},

		_reloadConfig: function() {
			const sConfig = Storage.get("config");
			const oConfig = JSON.parse(sConfig);

			const oModel = this.getModel("config");
			oModel.setData(oConfig);
		}
	});
});