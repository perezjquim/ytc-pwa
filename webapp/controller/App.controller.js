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
				const oNavigationListItem = oEvent.getSource();
				const oNavigationList = oNavigationListItem.getParent();
				const oSideNavigation = oNavigationList.getParent();
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
				oApplicationCache.addEventListener('updateready', (e) => {
					if (oApplicationCache.status == oApplicationCache.UPDATEREADY) {
						const sText = this.getText("updating");
						this.toast(sText);
						oApplicationCache.swapCache();
						setTimeout(() => {
							window.location.reload();
						}, 2000);
					} else {}
				}, false);
			}
		},

		_reloadConfig: function() {
			const sConfig = Storage.get("config");
			if (sConfig) {
				const oConfig = JSON.parse(sConfig);
				if (oConfig) {
					const oModel = this.getModel("config");
					oModel.setData(oConfig);
				}
			}
		}

	});
});