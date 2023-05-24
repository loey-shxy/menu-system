
let config = {
	title:'一本菜谱',
	activeMenu: {},
	userMessage:  {},
	menu: [
		{
			menuList: [
				{
					menuName: "首页",
					path:'/',
				},
				{
					menuName: "基础功能",
					subMenu: [
						{
							menuName: "基础信息",
							path:'basic'
						},
						{
							menuName: "食材类型",
							path:'food-type',
							
						},
						{
							menuName: "菜品类型",
							path:'dishes-type',
							
						},
						{
							menuName: "食材信息",
							path:'food-list',
							
						},
						{
							menuName: "会员信息",
							path:'member-list',
							
						},
						{
							menuName: "供应商信息",
							path:'supplier-list',
							
						},
					]
				},
				{
					menuName: "菜品信息",
					subMenu:[
						{
							menuName: "基础菜品",
							path:'dishes-list',
							
						},
						{
							menuName: "会员菜品",
							path:'dishes-list?type=member',
							
						}
					]
				},
				{
					menuName: "菜谱信息",
					subMenu:[
						{
							menuName: "分享菜谱",
							path:'menu-list?type=share',
							
						},{
							menuName: "会员菜谱",
							path:'menu-list',
							
						}
						
					]
				},{
					menuName: "审批记录",
					path:'approval-list'
				}
			]
		},
		{
			menuList: [
				{
					menuName: "首页",
					path:'/',
				},
				{
					menuName: "菜谱信息",
					subMenu:[
						{
							menuName: "我的菜谱",
							path:'menu-list?type=my',
							
						},{
							menuName: "共享菜谱",
							path:'menu-list?type=share',
							
						}
					]
				},
				{
					menuName: "食材信息",
					subMenu:[
						{
							menuName: "共享食材",
							path:'food-list',
							
						},{
							menuName: "食材补充记录",
							path:'food-supple'
						}
					]
				},
				{
					menuName: "菜品信息",
					subMenu:[
						{
							menuName: "我的菜品",
							path:'dishes-list',
							
						},{
							menuName: "共享菜品",
							path:'dishes-list?type=share',
							
						}
					]
				},
				{
					menuName: "基础功能",
					subMenu:[
						{
							menuName: "审批记录",
							path:'approval-list'
						},
						{
							menuName: "供应商列表",
							path:'supplier-list',
							
						},{
							menuName: "个人信息",
							path:'user-detail'
						}
						
					]
				}
			]
		},
		{
			menuList:[
				{
					menuName: "首页",
					path:'/',
				},{
					menuName: "个人信息",
					path:'user-detail'
				},{
					menuName: "食材列表",
					path:'food-list'
				},{
					menuName: "食材补充记录",
					path:'food-supple'
				}
			]
		}
	],

	unitList:[
		
		{
			label: '箱',
			value: 3
		},
		{
			label: '只',
			value: 4
		},
		{
			label: '斤',
			value: 2
		},
		{
			label: '袋',
			value: 5
		},
		{
			label: '升',
			value: 8
		},
		{
			label: '公斤',
			value: 6
		},
		{
			label: '个',
			value: 1
		}
	]
};
config.getItem = () => {
	let value = localStorage.getItem('userMessage');
	if (value && value !== "undefined" && value !== "null")
		return JSON.parse(value);
	return null;
}
config.userMessage = config.getItem() || {};
config.fileUrl     = 'http://yibcp.com/statics/';

export default config;
