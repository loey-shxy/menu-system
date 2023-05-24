import utils from './utils.js';
import config from './config.js';

let commons = {
    utils: utils,
    config: config
};


//删除提示
commons.delTIP = function(params,successFun,errorFun) {
	this.utils.element.MessageBox.confirm(params.title ||'确认是否删除?', '提示', {
		confirmButtonText: params.confirmButtonText ||'确定',
		cancelButtonText: params.cancelButtonText || '取消',
		type: 'warning'
	}).then(() => {
		if(!params.url) {
			successFun && successFun();
			return;
		}
		this.utils.ajax({
			url: params.url,
			data: params.data,
			noCheckDepart: params.noCheckDepart || false
		},(res) => {
			if(res.success) {
				successFun && successFun();
				this.utils.element.Message({
					message: params.successMessage || '删除成功',
					type: 'success'
				});
			} else {
				errorFun && errorFun(res);
				this.utils.element.Message({
					message: res.msg || params.errorMessage || '删除失败',
					type: 'error'
				});
			}
		});
	}).catch(() => {
		errorFun && errorFun();
	});
};


//获取图片
commons.requestPic = function(id,successFun,errorFun) {
	this.utils.ajax({
		url: '/api/upload/getPicture',
		data: {
			id: id
		}
	},(res) => {
		if(res.success){
			successFun && successFun(res)
		} else
			errorFun && errorFun(res)
	});
};

//获取视频
commons.requestVideo = function(id,successFun,errorFun) {
	
	this.utils.ajax({
		url: '/api/upload/getVideo',
		data: {
			id: id
		}
	},(res) => {
		if(res.success){
			successFun && successFun(res)
		} else
			errorFun && errorFun(res)
	});
};

//关闭窗口
commons.close = function() {
	window.opener = null;
	window.open('','_self');
	window.close();
};


//手机号校验
commons.phoneRules = function(phone) {
	let rules = /1[0-9]\d{9}$/;
	if(phone && phone.length >= 11 && rules.test(phone)) {
		return true;
	}
	return false;
};



export default commons;