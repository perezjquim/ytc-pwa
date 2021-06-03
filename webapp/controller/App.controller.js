sap.ui.define([
	"./util/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
	"sap/ui/util/Storage",
	"sap/ui/Device"
], function(BaseController, History, Fragment, Storage, Device) {
	"use strict";
	return BaseController.extend("com.perezjquim.iglivemode.pwa.controller.App", {

		onInit: function(oEvent) {
			this._prepareServiceWorker();
			this._validateCache();
			this._reloadConfig();
		},

		onHomeButtonPress: function(oEvent) {
			const oBar = oEvent.getSource();
			const oToolPage = oBar.getParent();
			const oSideContent = oToolPage.getSideContent();
			const oNavigationList = oSideContent.getItem();
			const oNavigationItems = oNavigationList.getItems();
			const oHomeItem = oNavigationItems.find(function(oItem) {
				const sKey = oItem.getKey();
				return sKey == "Home";
			});
			oNavigationList.fireItemSelect({
				item: oHomeItem
			});
		},

		onMenuButtonPress: function(oEvent) {
			const oBar = oEvent.getSource();
			const oToolPage = oBar.getParent();
			const bIsExpanded = oToolPage.getSideExpanded();
			oToolPage.setSideExpanded(!bIsExpanded);
		},

		onNavigationItemSelect: function(oEvent) {
			const oSelectedItem = oEvent.getParameter("item");
			const sKey = oSelectedItem.getKey();
			this.navTo(sKey);

			const bIsPhone = Device.system.phone;
			if (bIsPhone) {
				const oSideNavigation = oEvent.getSource();
				const oToolPage = oSideNavigation.getParent();
				oToolPage.setSideExpanded(false);
			}
		},

		onNavButtonPress: function(oEvent) {
			this.navBack();
		},

		_validateCache: function() {
			const oApplicationCache = window.applicationCache;
			if (oApplicationCache) {
				if (oApplicationCache.status == oApplicationCache.UPDATEREADY) {
					this.onUpdateReady();
				} else {
					oApplicationCache.addEventListener('updateready', this.onUpdateReady.bind(this), false);
				}
			}
		},

		onUpdateReady: function() {
			const sText = this.getText("updating");
			this.toast(sText);

			const iReloadDelay = 2000;
			setTimeout(() => {
				window.location.reload();
			}, iReloadDelay);
		},

		_reloadConfig: function() {
			const oStorage = this.getStorage();
			const sConfig = oStorage.getItem("config");
			if (sConfig) {
				const oConfig = JSON.parse(sConfig);
				const oModel = this.getModel("config");
				oModel.setData(oConfig);
			}
		},

		_prepareServiceWorker: function() {
			if (navigator.serviceWorker) {
				navigator.serviceWorker.register('/sw.js');
			}
		}

	});
});