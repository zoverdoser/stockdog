import query from "../libs/query.js";

export default {
	serverPath:window.serverPath?window.serverPath:"http://chatdemo.jdytoy.com",
	jssdkURL:window.serverPath?window.serverPath+"/wx/jsticket":"http://chatdemo.jdytoy.com/wx/jsticket",
	apiPath:"/api/",
	apiVersion:"1.0",
	isTest: TEST,
	isAllJsonp: TEST,
	testUser:{
		'FromUserName': 'o2N5jt7vJEHdKQehf03z1JnODRYg',
        'secret':'77e6980cfbde88011ae3b2f16c105410',
        'test':'1',
        'FromOpenid':'orBuIjh7jshxdr-vP_T_uVXajRwA',
	}

}
window.$=$;