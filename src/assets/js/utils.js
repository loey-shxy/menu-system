/**
 * @author:qinhu
 * @date:2018.06.29
 * @description 常用操作
 */

import axios from 'axios'
import element  from 'element-ui';
import config from './config'
// import store from './../../store/store'
import Router from './../../router'


var utils = {
    $ajax: axios.create({}),
    Loading: element.Loading,
    element: element,
    loading : "",
    config: config,
    // store: store,
    router:Router,
    messageMask:false
};

/**
 *日期对象转为日期字符串
 * @param date 需要格式化的日期对象
 * @param sFormat 输出格式,默认为yyyy-MM-dd                        年：y，月：M，日：d，时：h，分：m，秒：s
 * @example  dateFormat(new Date())                               "2017-02-28"
 * @example  dateFormat(new Date(),'yyyy-MM-dd')                  "2017-02-28"
 * @example  dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')         "2017-02-28 13:24:00"   ps:HH:24小时制
 * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 01:24:00"   ps:hh:12小时制
 * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
 * @example  dateFormat(new Date(),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
 * @example  dateFormat(new Date('2017-02-28 13:24:00'),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
 * @returns {string}
 */
utils.dateFormat = function(params) {
	params = params || {};
	
	var date = params.noFormat ? params.date : (params.date ? new Date(params.date.replace(/-/g,'/')) : new Date());
    var time = {
        Year: 0,
        TYear: '0',
        Month: 0,
        TMonth: '0',
        Day: 0,
        TDay: '0',
        Hour: 0,
        THour: '0',
        hour: 0,
        Thour: '0',
        Minute: 0,
        TMinute: '0',
        Second: 0,
        TSecond: '0',
        Millisecond: 0
    };
    var sFormat = params.sFormat || "yyyy-MM-dd";
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();



    return sFormat.replace(/yyyy/ig, String(time.Year))
      .replace(/yyy/ig, String(time.Year))
      .replace(/yy/ig, time.TYear)
      .replace(/y/ig, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/ig, time.TDay)
      .replace(/d/ig, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/ig, time.TSecond)
      .replace(/s/ig, String(time.Second))
      .replace(/fff/ig, String(time.Millisecond))
};

utils.ajax = function(params,successFun,errorFun) {
	
	if(!params.maskFlag) this.loadingFun(params.load || {});
   
    this.$ajax({
        method: params.type ||'post',
        url: params.url,
	    dataType:"json",
        timeout: params.timeout || 1000 * 60 * 10,
        data: params.data,
	   
    }).then((res) => {
        this.loading && this.loading.close();
        if(res.status === 200) {
        	
	        res = res.data;
	       
        	if(res.code === 401 ) {
        		this.exit(res);
        		return;
	        } else if(res.code === 403) {
		        this.element.Message({
			        message: res.msg || '无权限',
			        type: 'error'
		        });
		        return;
	        } else if(res.code === 407) {
		        this.element.Message({
			        message: res.msg || '请退出登录',
			        type: 'error'
		        });
        		return;
	        }
         
	        successFun && successFun(res);
        }
    }).catch((res) => {
	    errorFun && errorFun(res);
        this.loading && this.loading.close();
    });
};


//上传文件
utils.upload = function(params,successFun,errorFun) {
    // if(!params.noCheckToken && !this.store.state.user.token) {
        // this.validateLogin();
        return;
    // }

    if(!params.maskFlag) this.loadingFun(params.load || {});
    
    let that = this;
  
 
	if(params.noCheckDepart) params.department = "";
	else params.department = "/" + this.config.activeMenu.department;
	
	// params.data.set('token',this.store.state.user.token);
	
    params.url = this.config.api + this.config.PROJECTNAME + params.department + params.url;
    this.$ajax({
        method: params.type ||'post',
        url: params.url,
        timeout: params.timeout || 1000 * 60 * 10,
        data: params.data,
	    onUploadProgress(progressEvent){
		    if (progressEvent.lengthComputable) {
			    let val = (progressEvent.loaded / progressEvent.total * 100).toFixed(0);
			    that.loading.setText(val + '%');
		    }
	    }
    }).then((res) => {
	   
        this.loading && this.loading.close();
        if(res.status === 200) {
            res = res.data;
            // this.validateLogin(res,successFun);
        }
    }).catch((res) => {
        console.log(res);
        errorFun && errorFun(res);
        this.loading && this.loading.close();
    });
};


utils.loadingFun = function(params= params ||{}) {
	
    this.loading = this.Loading.service({
        lock: params.lock ||true,
        text:  params.text || '正在加载中...',
        spinner: params.spinner ||'el-icon-loading',
        background: params.background || 'rgba(0, 0, 0, 0.8)',
        target: params.target ||'body',
    });
};



//退出系统
utils.exit = function(res) {
	if(res)
		this.element.Message({
			message: res.msg || '请登录',
			type: 'error'
		});
	this.router.replace({
		path: "login"
	});
	
	this.clearLocalStorage();
	this.config.userMessage = {};
	
};

//导出
utils.exportFun = function(param) {
	
	param = param || {};
	param.tableId = param.tableId || 'exportTable';
	param.tableName = param.tableName || 'sheetjs.xlsx';
	if(param.tableName.indexOf('.xlsx') === -1 )
		param.tableName = param.tableName + '.xlsx';
	
	let table = document.querySelector("#"+param.tableId);
	var wb = this.XLSX.utils.table_to_book(table,{raw: true});
	var wbout = this.XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
	try {
		if(this.FileSaver && this.FileSaver.saveAs) {
			this.FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), param.tableName);
			return ;
		}
		this.FileSaver(new Blob([wbout], { type: 'application/octet-stream' }), param.tableName);
	} catch (e) { if (typeof console != 'undefined') console.log(e, wbout) }
};




//localhost存储信息
utils.writeLocalStorage = function(key,value) {
    if (value)
        value = JSON.stringify(value);
    localStorage.setItem(key,value);
};

//读取存取信息
utils.readLocalStorage = function(key) {

    var value = localStorage.getItem(key);
    if (value && value != "undefined" && value != "null")
        return JSON.parse(value);
    return null;
};
//移除存储信息
utils.removeLocalStorage = function(key) {
    localStorage.removeItem(key);
};
//清除存储信息
utils.clearLocalStorage = function() {
    localStorage.clear();
};



//清楚
export default utils;
