export interface BusinessType {
	businessTypeId: number;
	businessTypeName: string;
}

export interface UseType {
	memberTypeId: number;
	memberTypeName: string;
	businessTypes: BusinessType[];
}

export interface UserRegister {
	useType: UseType[];
}

export interface ShopInfo {
	id: number;
	name: string;
	type: number;
	environment: number;
	property: number;
	self: number;
	memberOperate: number;
	openMro: number;
	logoUrl: string;
	describe?: any;
	state: number;
	url: string;
	isDefault: number;
	createTime: number;
	currencyName: string;
	isHelp?: any;
	isAllowDistribution?: any;
}

export interface Web {
	shopInfo: ShopInfo[];
}

export interface Language {
	id: number;
	name: string;
	nameEn: string;
	state: number;
	imgUrl: string;
	createTime: number;
}

export interface SiteInfo {
	id: number;
	name: string;
	logo: string;
	siteUrl: string;
	symbol?: any;
	language: string;
	enableMultiTenancy: number;
	languages: Language[];
}

export interface ParamConfigList {
	code: string;
	value: string;
	description?: any;
}

export interface CustomerServiceInfo {
	id: number;
	platformName: string;
	type: number;
	paramConfigList: ParamConfigList[];
}

export interface Global {
	siteInfo: SiteInfo;
	customerServiceInfo: CustomerServiceInfo;
}

export interface SiteList {
	name: string;
	key: string;
	icon: string;
}

export interface PublicSelect {
	siteList: SiteList[];
}

export interface RootObject {
	userRegister: UserRegister;
	web: Web;
	global: Global;
	publicSelect: PublicSelect;
}