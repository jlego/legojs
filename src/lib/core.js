// import { Router } from 'director';//v1.8.0之前的版本
import page from 'page';
window.page = page;

class Core {
    constructor() {
        let that = this;
        this.config = {
            alias: 'Lego',
            version: '1.0.0',
            isDebug: true,
            isAnimate: false,  //是否开启动画
            permit(){},  //操作权限
            isMultiWindow: false, //是否多窗口
            pageEl: '',     //页面渲染容器
            defaultApp: '', //默认应用
            rootUri: '',    //根目录
            screenWidth: window.innerWidth  //应用窗口宽度
        };
        this._debugger();
        this.prevApp = ''; //上一个应用名称
        this.currentApp = ''; //当前应用名称
        // 基类
        // this.Route = Router;

        this.idCounter = 0;
        // 实例容器
        this.views = new WeakMap(); //视图容器
        this.datas = {};    //数据容器
        this.timer = new Map();   //计时器对象
        this.UI = {};
        this.routers = new Map();
        // 监听hash变化
        window.onhashchange = function(){
            let hashStr = location.hash.replace('#', '');
            if(hashStr) page(hashStr);
        };
        return this;
    }
    /**
     * [extend 深拷贝对象]
     * @param  {...[type]} opts [description]
     * @return {[type]}         [description]
     */
    extend(...opts){
        let that = this;
        function assign(target = {}, source = {}){
            for (let key in source) {
                if (source.hasOwnProperty(key)) {
                    if(typeof source[key] !== 'object'){
                        target[key] = source[key];
                    }else{
                        if(Array.isArray(source[key])){
                            target[key] = Array.from(source[key]);
                        }else{
                            if(!Lego.isEmptyObject(source[key])){
                                target[key] = assign(target[key], source[key]);
                            }else{
                                target[key] = Object.assign({}, source[key]);
                            }
                        }
                    }
                }
            }
            return target;
        }
        if(opts.length > 0){
            let result = opts[0];
            if(typeof result == 'object' && !Array.isArray(result)){
                for(let i = 1; i < opts.length; i++){
                    if(typeof opts[i] == 'object' && !Array.isArray(opts[i])){
                        result = assign(result, opts[i]);
                    }
                }
            }
            return result;
        }
        return {};
    }
    /**
     * [create 实例化视图]
     * @param  {Object} view, option [description]
     * @return {[type]}        [description]
     */
    create(view, opts = {}){
        const that = this;
        opts.vid = this.uniqueId('v');
        opts.createBefore = opts.createBefore && opts.createBefore.bind(this);
        opts.createAfter = opts.createAfter && opts.createAfter.bind(this);
        if(!view) return;
        // 操作权限
        if(this.config.permit){
            if(typeof this.config.permit == 'function' && opts.permis){
                if(!this.config.permit(opts.permis)) return;
            }
        }
        typeof opts.createBefore === 'function' && opts.createBefore();

        const viewObj = new view(opts);
        this.views.set(viewObj.el, viewObj);

        typeof opts.createAfter === 'function' && opts.createAfter(viewObj);
        return viewObj;
    }
    /**
     * [init 初始化系统]
     * @param  {Object} opts [description]
     * @return {[type]}      [description]
     */
    setting(...opts){
        if(opts.length > 1){
            if(typeof opts[0] == 'string'){
                this.config[opts[0]] = opts[1];
            }
        }else{
            if(typeof opts[0] == 'object'){
                Object.assign(this.config, opts[0]);
            }
        }
        page.base(this.config.routeRoot);
        this._debugger();
        return this;
    }
    /**
     * [components 注册UI组件]
     * @param  {Object} opts [description]
     * @return {[type]}      [description]
     */
    components(comName, coms = {}, isReset = false){
        if(typeof comName === 'string') this.UI[comName] = coms;
        if(typeof comName === 'object'){
            if(!this.isEmptyObject(comName)){
                Object.assign(this.UI, comName);
            }else{
                this.UI = comName;
            }
        }
    }
    /**
     * [param 序列化普通对象]
     * @param  {Object} obj [description]
     * @return {[type]}     [description]
     */
    param(obj = {}){
        let result = [];
        for(let key in obj){
            if(typeof obj[key] === 'object'){
                obj[key] = JSON.stringify(obj[key]);
            }
            result.push(key + '=' + obj[key]);
        }
        return result.join('&');
    }
    /**
     * [randomKey 随机字符串]
     * @param  {[type]} len [description]
     * @return {[type]}     [description]
     */
    randomKey(len) {
        len = len || 32;
        const $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
    /**
     * [uniqueId 实例唯一码]
     * @param  {[type]} prefix [description]
     * @return {[type]}        [description]
     */
    uniqueId(prefix) {
        const id = ++this.idCounter + '';
        return prefix ? prefix + id : id;
    }
    /**
     * [isEmptyObject description]
     * @param  {[type]}  obj [description]
     * @return {Boolean}   [description]
     */
    isEmptyObject(obj = {}) {
        for (let val in obj) return !1;
        return !0;
    }
    /**
     * _debugger 调试器
     * @return {[type]} [description]
     */
    _debugger() {
        window.debug = {};
        if (!window.console) return function() {}
        if (this.config.isDebug) {
            for (let m in console) {
                if (typeof console[m] == 'function') {
                    debug[m] = console[m].bind(window.console);
                }
            }
        } else {
            for (let m in console) {
                if (typeof console[m] == 'function') {
                    debug[m] = function() {};
                }
            }
        }
    }
    /**
     * [_clearObj 清理旧应用对象]
     * @param  {[type]} appName [description]
     * @return {[type]}         [description]
     */
    _clearObj(appName){
        const that = this;
        if(appName !== this.currentApp){
            this.timer.forEach(function(value, key){
                clearTimeout(value);
                clearInterval(value);
                that.timer.delete(key);
            });
            if(!this.config.isMultiWindow){
                this.routers.delete(appName);
            }
        }
    }
    /**
     * [ns 命名空间]
     * @param  {[type]} nameSpaceStr [description]
     * @param  {[type]} obj          [description]
     * @return {[type]}              [description]
     */
    ns(nameSpaceStr, obj = {}) {
        if (typeof nameSpaceStr !== 'string' && Array.isArray(obj) || typeof obj !== 'object') {
            debug.error('namespace error', obj);
            return;
        }
        if (nameSpaceStr.substring(0, 5) !== 'Lego.') nameSpaceStr = 'Lego.' + nameSpaceStr;
        let nameSpaceArr = nameSpaceStr.split('.'),
            tempArr = ['Lego'],
            that = this;
        function getNameSpace(nameSpaceObj, num) {
            if (num < nameSpaceArr.length) {
                let itemStr = nameSpaceArr[num];
                tempArr.push(itemStr);
                let allStr = tempArr.join('.');
                let subObj = eval(allStr);
                if (num == nameSpaceArr.length - 1) {
                    if(that.isEmptyObject(nameSpaceObj[itemStr])){
                        nameSpaceObj[itemStr] = obj;
                    }
                }else{
                    nameSpaceObj[itemStr] = typeof subObj == 'object' && !Array.isArray(subObj) ? subObj : {};
                }
                return getNameSpace(nameSpaceObj[itemStr], num + 1);
            } else {
                return nameSpaceObj;
            }
        }
        return getNameSpace(this, 1);
    }
    /**
     * [loadScript 加载js]
     * @param  {[type]}   url      [description]
     * @param  {Function} callback [description]
     * @param  {[type]}   appName  [description]
     * @return {[type]}            [description]
     */
    loadScript(url, callback, appName) {
        let script = document.createElement("script"),
            theId = 'Lego-js-' + appName;
        script.setAttribute('id', theId);
        script.type = "text/javascript";
        if (script.readyState) { // IE
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { // FF, Chrome, Opera, ...
            script.onload = function() {
                callback();
            };
        }
        script.src = url;
        if(document.getElementById(theId)) document.getElementsByTagName("head")[0].removeChild(document.getElementById(theId));
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    /**
     * startApp 应用加载器
     * @param  {object} opts 参数
     * @return {[type]}        [description]
     */
    startApp(appPath, fileName = 'app', opts = {}) {
        let options = {
            startBefore() {},
            startAfter() {}
        }, that = this, appName, index;
        Object.assign(options, opts);
        const hash = window.location.hash.replace(/#/, '');
        let newHash = hash.indexOf('/') == 0 ? hash.replace(/\//, '') : '';
        newHash = newHash !== 'index' ? newHash : '';
        appPath = appPath || newHash || this.config.defaultApp;
        appName = !this.currentApp ? 'index' : (appPath.indexOf('/') > 0 ? appPath.split('/')[0] : appPath);
        this.prevApp = this.currentApp;
        this.currentApp = !this.currentApp ? 'index' : appName;
        if (typeof options.startBefore == 'function') options.startBefore();
        this.loadScript(this.config.rootUri + appName + '/' + fileName + '.js?' + this.config.version, function() {
            if(appPath && appName !== 'index'){
                // if(that.routers.get(appName)) that.routers.get(appName).setRoute(appPath);//v1.8.0之前的版本
                page(appPath.indexOf('/') !== 0 ? ('/' + appPath) : appPath);
                let prevId = 'Lego-js-' + that.prevApp;
                if(document.getElementById(prevId)){
                    document.getElementsByTagName("head")[0].removeChild(document.getElementById(prevId));
                }
                that._clearObj(that.prevApp);
            }
            if (typeof options.startAfter == 'function') options.startAfter();
        }, appName);
    }
    /**
     * getUrlParam 获取网址参数
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    getUrlParam(name) {
        window.pageParams = {};
        if (window.pageParams[name]) return window.pageParams[name];
        let url = decodeURI(document.location.search);
        if (url.indexOf('?') >= 0) {
            let paramArr = url.substr(1).split('&'),
                valArr = [];
            for (let i = 0; i < paramArr.length; i++) {
                valArr = paramArr[i].split('=');
                window.pageParams[valArr[0]] = valArr[1];
            }
            return window.pageParams[name] || '';
        } else {
            return '';
        }
    }
    /**
     * getAppName 当前模块名称
     * @return {[type]} [description]
     */
    getAppName() {
        let hash = window.location.hash.replace(/#/, '');
        hash = hash.indexOf('/') == 0 ? hash.replace(/\//, '') : '';
        return hash.split('/')[0] || this.config.defaultApp;
    }
    /**
     * [getView 取应用视图]
     * @param  {[type]} alias   [description]
     * @param  {[type]} appName [description]
     * @return {[type]}         [description]
     */
    getView(el){
        let _el = typeof el == 'string' ? document.querySelector(el) : el;
        if(window.$ && typeof el == 'object'){
            _el = el instanceof window.$ ? el[0] : _el;
        }
        if(this.views.has(_el)){
            return this.views.get(_el);
        }
        return null;
    }
    /**
     * [setTimer 设置计时器]
     * @param {[type]} name  [description]
     * @param {[type]} timer [description]
     */
    setTimer(name, timer){
        if(name && timer){
            let oldTimerMap = this.timer,
                oldTimer = oldTimerMap.get(name);
            if(oldTimer){
                clearTimeout(oldTimer);
                clearInterval(oldTimer);
                oldTimerMap.clear();
            }
            oldTimerMap.set(name, timer);
        }
    }
    /**
     * [router 实例化路由]
     * @param  {[type]} routerOption [description]
     * @return {[type]}           [description]
     */
    router(routerOption = {}){
        if(!this.isEmptyObject(routerOption)){
            for(let key in routerOption){
                let value = routerOption[key],
                    routerName = key;
                value = Array.isArray(value) ? value : [value];
                value.unshift(key);
                if(!this.routers.get(routerName)){
                    page(...value);
                    this.routers.set(routerName, value);
                }
                // const routerObj = Router(routerOption).init(); //v1.8.0之前的版本
            }
        }
    }
}
window.Lego = window.Lego || new Core();
export default window.Lego;
