'use strict';

import Base from './base.js';

export default class extends Base {
	/**
	 * index action
	 * @return {Promise} []
	 */
	indexAction() {
		//auto render template file index/index.html
		this.assign("style", "mainPage");
		return this.display();
	}

	* loginAction() {
		if (this.isPost()) {
			let data = this.post();
			console.log(data);
			data.password = encryptPassword(data.password);
			data.login_time = new Date().valueOf();
			let user = yield this.model('user').where({name: data.name}).find();
			if (think.isEmpty(user)) {
				return this.success(-1);//不存在此用户
			} else {
				if (data.password == user.password) {
					console.log("Login success");
					yield this.model('user_login_record').add({
						user_id: user.user_id,
						login_time: dateformat('Y-m-d H:i:s', data.login_time)
					});
					yield this.model('user').where({name: data.name}).update({is_online: 1})
					let userInfo = {
						'id': user.user_id,
						'username': data.name,
						// 'mem_type': data.memberType,
						'is_online': 1,
						'is_vip': 0,
						'login_time': data.login_time
					};
					console.log(userInfo);
					yield this.session('loginuser', userInfo);
					let loginuserinfo = yield this.session('loginuser');
					console.log(loginuserinfo);
					return this.success(1);
				} else {
					console.log("password error");
					return this.success(-2);
				}
			}
		}else {
			return this.display();
		}
	}

	* registerAction() {
		if (this.isAjax('post')) {
			let data = this.post();
			console.log(data);
			let res = yield this.model("user").where({name: ltrim(data.name)}).find();
			if (!think.isEmpty(res)) {
				return this.success(-1);//"用户昵称已存在，请重新填写！"
			}
			data.reg_time = new Date().valueOf();
			data.pwd = encryptPassword(data.pwd);
			yield this.model("user").add({
				name: data.name,
				password: data.pwd,
				add_time: dateformat('Y-m-d H:i:s',data.reg_time),
				is_online: 0,
				is_vip: 0
			});
			return this.success(1);
		} else {
			return this.display();
		}
	}
}