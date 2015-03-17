/*
 combined files :

 gallery/autoResponsive/1.2/config
 gallery/autoResponsive/1.2/anim
 gallery/autoResponsive/1.2/linkedlist
 gallery/autoResponsive/1.2/gridsort
 gallery/autoResponsive/1.2/base
 gallery/autoResponsive/1.2/plugin/hash
 gallery/autoResponsive/1.2/plugin/drag
 gallery/autoResponsive/1.2/plugin/loader
 gallery/autoResponsive/1.2/index

 */
/**
 * @Description:    网页自适应布局全局配置模块
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.2/config',function () {
    'use strict';
    var EMPTY = '';

    /**
     * @name Config
     * @param {String}  container            外层容器
     * @param {String}  selector             单元选择器
     * @param {String}  filter               单元过滤器
     * @param {String}  fixedSelector        [*]占位选择器
     * @param {String}  priority             优先选择器
     * @param {Number}  gridWidth            最小栅格单元宽度<code>px</code>
     * @param {Object}  unitMargin           单元格外边距<code>px</code>
     * @param {Boolean} closeAnim            是否关闭动画（默认开启）
     * @param {Number}  duration             补间动画时间，此项只针对IE系列生效
     * @param {String}  easing               补间动画算子，此项只针对IE系列生效
     * @param {String}  direction            排序起始方向（可选值：<code>'right'</code>）
     * @param {Boolean} random               随机排序开关（默认关闭）
     * @param {String}  sortBy               排序算法（可选值：<code>'grid'</code>或<code>'cell'</code>，默认为<code>'grid'</code>）
     * @param {Boolean} autoHeight           容器高度自适应开关（默认为true）
     * @param {Boolean} suspend              渲染任务队列是否支持挂起（挂起时主动将执行交给UI线程 | 默认为true）
     * @param {Array}   plugins              插件队列
     * @param {Boolean} autoInit             是否自动初始化（默认为true）
     * @param {Boolean} closeResize          是否关闭resize绑定（默认不关闭）
     * @param {Number}  resizeFrequency      resize触发频率
     * @param {Array}   whensRecountUnitWH   重新计算单元宽高的行为时刻（可选值：<code>'closeResize', 'adjust'</code>）
     * @param {Number}  delayOnResize        resize时延迟渲染，主要是解决css3动画对页面节点属性更新不及时导致的渲染时依赖的数据不准确问题[临时解决办法]
     * @param {Boolean} landscapeOrientation 布局方向设置为横向，默认为false，竖向
     */
    function Config() {
        return {
            container: {value: EMPTY},
            selector: {value: EMPTY},
            filter: {value: EMPTY},
            fixedSelector: {value: EMPTY},
            priority: {value: EMPTY},
            gridWidth: {value: 10},
            unitMargin: {value: {x: 0, y: 0}},
            closeAnim: {value: false},
            duration: {value: 1},
            easing: {value: 'easeNone'},
            direction: {value: 'left'},
            random: {value: false},
            sortBy: {value: EMPTY},
            autoHeight: {value: true},
            closeResize: {value: false},
            autoInit: {value: true},
            plugins: {value: []},
            suspend: {value: true},
            cache: {value: false},
            resizeFrequency: {value: 200},
            whensRecountUnitWH: {value: []},
            delayOnResize: {value: -1},
            landscapeOrientation: {value:false}
        };
    }
    return Config;
});
/**
 * @Description: 兼容css3和低版本浏览器动画效果
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.2/anim',function (S) {
    'use strict';
    var D = S.DOM, Anim = S.Anim,

        letIE10 = S.UA.ie < 11,

        prefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''],

        animType = letIE10 ? 'fixedAnim' : 'css3Anim';

    /**
     * @name AutoAnim
     * @class css动画，采用帧重复
     * @constructor
     */
    function AutoAnim(cfg) {
        this.cfg = cfg;
        this._init();
    }

    S.augment(AutoAnim, {
        _init: function () {
            this[animType]();
        },
        /**
         * supply css ua prefix
         */
        cssPrefixes: function (styleKey, styleValue) {
            var fixedRule = {};

            for (var i = 0, len = prefixes.length; i < len; i++) {
                fixedRule[prefixes[i] + styleKey] = styleValue;
            }

            return fixedRule;
        },
        /**
         * css3动画效果
         */
        css3Anim: function () {
            /*
             * css3效果代码添加
             * 为了减少对象读取css3模式去除duration配置，改为css中读取
             */
            var cfg = this.cfg;
            // TODO 优化点：既然css3Anim在循环中，可以考虑将‘cfg.direction !== 'right'’该判断条件在逻辑树上上提，以加快该函数的执行
            D.css(cfg.elm, this.cssPrefixes('transform', 'translate(' + ((cfg.direction !== 'right') ? cfg.x : (cfg.owner.gridSort.containerWH - cfg.elm.__width - cfg.x)) + 'px,' + cfg.y + 'px) '));

            // 单元排序后触发
            cfg.owner.fire('afterUnitArrange', {
                autoResponsive: {     // TODO 优化点：既然是给自定义事件传参，没必要再多挂一层 'autoResponsive' key
                    elm: cfg.elm,
                    position: {
                        x: cfg.x,
                        y: cfg.y
                    },
                    frame: cfg.owner.frame
                }
            });
            S.log('css3 anim success');
        },
        /**
         * 降级模拟css3动画
         */
        fixedAnim: function () {
            var cfg = this.cfg,
                cssRules = {'top': cfg.y};

            if (cfg.closeAnim) {
                this.noneAnim();
                return;
            }

            cssRules[cfg.direction == 'right' ? 'right' : 'left'] = cfg.x;

            new Anim(cfg.elm, cssRules, cfg.duration, cfg.easing, function () {

                // 单元排序后触发
                cfg.owner.fire('afterUnitArrange', {
                    autoResponsive: {
                        elm: cfg.elm,
                        position: {
                            x: cfg.x,
                            y: cfg.y
                        },
                        frame: cfg.owner.frame
                    }
                });
            }).run();
            S.log('kissy anim success');
        },
        /**
         * 无动画
         */
        noneAnim: function () {
            var cfg = this.cfg;

            D.css(cfg.elm, {
                left: cfg.x,
                top: cfg.y
            });

            // 单元排序后触发
            cfg.owner.fire('afterUnitArrange', {
                autoResponsive: {
                    elm: cfg.elm,
                    position: {
                        x: cfg.x,
                        y: cfg.y
                    },
                    frame: cfg.owner.frame
                }
            });
            S.log('maybe your anim is closed');
        }
    });
    return AutoAnim;
}, {requires: ['dom', 'anim']});

/**
 * @Description: 集成一个双向链表方便操作
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.2/linkedlist',function (S) {
    'use strict';
    /**
     * @name LinkedList
     * @class 双向更新链表
     * @constructor
     */
    function LinkedList(cfg) {
        var self = this;
        self.length = 0;
        self.head = null;
        self.tail = null;
        self.type = cfg.type || true;
        self.query = [];
        self.init();
    }

    S.augment(LinkedList, {
        /**
         * 初始化，增加随机序列
         */
        init: function () {
            S.augment(Array, {
                shuffle: function () {
                    for (var j, x, i = this.length;
                         i;
                         j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
                    return this;
                }
            });
        },
        /**
         * 新增节点
         */
        add: function (value) {
            var self = this;
            if (self.type) {
                self.query.push(value);
                return;
            }
            var node = {
                value: value,
                next: null,//前驱
                prev: null//后继
            };
            if (self.length == 0) {
                self.head = self.tail = node;
            } else {
                self.tail.next = node;
                node.prev = self.tail;
                self.tail = node;
            }
            self.length++;
        },
        /**
         * 删除节点
         */
        remove: function (index) {
            var self = this;
            if (index > self.length - 1 || index < 0) {
                return null;
            }
            var node = self.head,
                i = 0;
            if (index == 0) {
                self.head = node.next;
                if (self.head == null) {
                    self.tail = null;
                }
                else {
                    self.head.previous = null;
                }
            }
            else if (index == self.length - 1) {
                node = self.tail;
                self.tail = node.prev;
                self.tail.next = null;
            }
            else {
                while (i++ < index) {
                    node = node.next;
                }
                node.prev.next = node.next;
                node.next.prev = node.prev;
            }
            self.length--;
        },
        /**
         * 获取链表值
         */
        get: function (index) {
            var self = this;
            if (self.type) {
                return self.query[index];
            }
            return self.node(index).value;
        },
        /**
         * 返回链表节点
         */
        node: function (index) {
            var self = this;
            if (index > self.length - 1 || index < 0) {
                return null;
            }
            var node = self.head,
                i = 0;
            while (i++ < index) {
                node = node.next;
            }
            return node;
        },
        /**
         * 更新节点值
         */
        update: function (index, value) {
            var self = this;
            if (self.type) {
                self.query[index] = value;
                return;
            }
            self.node(index).value = value;
        },
        /**
         * 返回query长度
         * @returns {Number}
         */
        size: function(){
            return this.query.length || this.length;
        }
    });
    return LinkedList;
});
/**
 * @Description:    计算排序
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Todo:           gridSort
 */
KISSY.add('gallery/autoResponsive/1.2/gridsort',function (S, AutoAnim, LinkedList) {
    'use strict';
    var D = S.DOM, EMPTY = '';

    /**
     * @name GridSort
     * @class 栅格布局算法
     */
    function GridSort() {
    }

    GridSort.prototype = {
        init: function (cfg, owner) {
            this.cfg = cfg;
            cfg.owner = owner;

            var items = S.query(cfg.selector, cfg.container);
            switch (cfg.sortBy) {
                case EMPTY:
                case 'grid':
                default:
                    this._gridSort(items);
                    break;
                case 'cell':
                    this._cellSort(items);
                    break;
            }
        },

        _gridSort: function (items) {
            var cfg = this.cfg,
                curQuery = this._getCols();
            // 设置关键帧
            this._setFrame();

            if (cfg.random) {
                items = items.shuffle();
            }

            // 排序之前触发beforeLocate
            cfg.owner.fire('beforeLocate', {
                autoResponsive: { // TODO 优化点：既然是给自定义事件传参，没必要再多挂一层 'autoResponsive' key
                    elms: items
                }
            });

            var actions = []; // 注意里面的规则顺序
            if (cfg.filter !== EMPTY) {
                actions.push('_filter');
            }

            if (cfg.priority !== EMPTY) {
                actions.push('_priority');
            }

            var l = actions.length, m = items.length, s = cfg.cache ? cfg.owner._lastPos : 0;

            if (l == 0) { // 没有规则，说明全渲染，那就直接渲染
                for (var i = s; i < m; i++) {
                    this._render(curQuery, items[i]);
                }
            } else { // 有规则，走renderQueue
                var renderQueue = []; // 记录的只是序号

                actions.push('_tail');

                for (var j = s; j < m; j++) {

                    for (var t = 0, r; t < l + 1; t++) {
                        r = this[actions[t]](renderQueue, j, items[j]);

                        // 说明得到明确的插入位置，做插入并停止后面的actions执行
                        if (typeof r === 'number') {
                            renderQueue.splice(r, 0, j);
                            break;
                        }
                        // 没得到明确插入位置，本次就不插入
                        // r为false表示继续向后执行后面的actions
                        // r为true表示停止后面的actions执行
                        else if (typeof r === 'boolean' && r) {
                            break;
                        }
                    }
                }

                for (var k = 0, n = renderQueue.length; k < n; k++) {
                    this._render(curQuery, items[renderQueue[k]]);
                }
            }

            // 记录一下这次渲染结束的位置(即下一次渲染开始的位置)
            cfg.owner._lastPos = m;

            var curMinMaxColHeight = this._getMinMaxColHeight();

            // 排序之后触发
            cfg.owner.fire('afterLocate', {
                autoResponsive: {
                    elms: items,
                    curMinMaxColHeight: curMinMaxColHeight,
                    frame: cfg.owner.frame
                }
            });

            // 更新容器高度
            this.setHeight(curMinMaxColHeight.max);
        },
        _getCols: function () {
            var cfg = this.cfg;
            this.containerWH = cfg.landscapeOrientation ? D.outerHeight(cfg.container) :D.outerWidth(cfg.container);
            if (cfg.owner.curQuery && cfg.cache) {
                return cfg.owner.curQuery;
            } else {
                var curQuery = new LinkedList({});
                for (var i = 0, span = Math.ceil(this.containerWH / cfg.gridWidth); i < span; i++) {
                    curQuery.add(0);
                }
                return cfg.owner.curQuery = curQuery;
            }
        },
        _setFrame: function () {
            this.cfg.owner.frame++;
        },
        _filter: function (queue, idx, elm) {
            var cfg = this.cfg;
            D.show(elm);
            if (D.hasClass(elm, cfg.filter)) {
                D.hide(elm);
                return true; // 停止后面的actions执行，并且不插入
            }
            return false; // 继续执行后面的actions，插入与否由后面的actions决定
        },
        _priority: function (queue, idx, elm) {
            if (queue._priorityInsertPos == undefined) {
                queue._priorityInsertPos = 0;
            }
            var cfg = this.cfg;
            if (D.hasClass(elm, cfg.priority)) {
                return queue._priorityInsertPos++; // 找到了队列的插入位置
            }
            return Infinity; // 找到了队列的插入位置，即队列的末尾
        },
        /**
         * 尾部action，只负责把当前的idx压栈，以免丢失
         * @param queue
         * @param idx
         * @param elm
         * @private
         */
        _tail: function (queue, idx, elm) {
            return Infinity; // 找到了队列的插入位置，即队列的末尾
        },
        _render: function (curQuery, item) {
            var self = this,
                cfg = self.cfg;

            // 遍历单个元素之前触发
            cfg.owner.fire('beforeUnitArrange', {
                autoResponsive: {
                    elm: item,
                    frame: cfg.owner.frame
                }
            });

            var coordinate = self.coordinate(curQuery, item);
            // 排序之后触发
            cfg.owner.fire('afterUnitArrange', {
                autoResponsive: {
                    elm: item,
                    frame: cfg.owner.frame
                }
            });
            // 调用动画
            self.asyncize(function () {
                self.callAnim(item, coordinate);
            });
        },
        coordinate: function (curQuery, elm) {
            var cfg = this.cfg,
                isRecountUnitWH = cfg.isRecountUnitWH;

            if (isRecountUnitWH || !elm.__width) {
                elm.__width = D.outerWidth(elm);
                elm.__height = D.outerHeight(elm);
            }

            return this._autoFit(curQuery, elm.__width, elm.__height);
        },
        /**
         * 返回x，y轴坐标
         */
        _autoFit: function (curQuery, cW, cH) {
            var cfg = this.cfg,_position,
                num = Math.ceil((( cfg.landscapeOrientation ? cH : cW ) + cfg.unitMargin.x) / cfg.gridWidth),
                cur = this._getCur(num, curQuery);
            for (var i = cur[0], len = num + cur[0], newH = cur[1] + (cfg.landscapeOrientation ? cW : cH) + cfg.unitMargin.y; i < len; i++) {
                curQuery.update(i, newH);
            }
            _position = [cur[0] * cfg.gridWidth + cfg.unitMargin.x, cur[1] + cfg.unitMargin.y];
            return cfg.landscapeOrientation ? _position.reverse() : _position;
        },
        /**
         * 获取当前指针
         */
        _getCur: function (num, curQuery) {
            return this._skipALG(num, curQuery);
        },
        /**
         * 单步式算法（常规保守的）
         * @param num 粒度
         * @param curQuery
         * @returns {Array}
         * @private
         */
        _stepALG: function (num, curQuery) {
            var cur = [null, Infinity];

            for (var i = 0, len = curQuery.size(); i < len - num + 1; i++) {
                var max = 0;

                for (var j = i; j < i + num; j++) {
                    if (curQuery.get(j) > max) {
                        max = curQuery.get(j);
                    }
                }
                if (cur[1] > max) {
                    cur = [i, max];
                }
            }
            return cur;
        },
        /**
         * 跳跃式算法（性能优越的）
         * @param num 粒度
         * @param curQuery
         * @returns {Array}
         * @private
         */
        _skipALG: function (num, curQuery) {
            var min = Infinity,
                i = 0, idx = 0;

            for (var len = curQuery.size(); i < len - num + 1; i++) {
                var max = -Infinity, curValue;

                for (var j = 0; j < num; j++) {
                    curValue = curQuery.get(i + j);
                    if (curValue >= min) {
                        i += j + 1; // 向后跳跃
                        if (i > len - num) {// 过界了
                            max = min; // 主要是绕过min > max这个条件，以免污染min
                            break;
                        }

                        j = -1; // reset
                        max = -Infinity; // reset
                        continue;
                    }

                    if (curValue > max) {
                        max = curValue;
                    }
                }
                if (min > max) {
                    min = max;
                    idx = i; // 记录位置
                }
            }
            return [idx, min];
        },
        asyncize: function (handle) {
            var self = this,
                cfg = self.cfg;
            if (cfg.owner.get('suspend')) {
                setTimeout(function () {
                    handle.call(self);
                }, 0);
            } else {
                handle.call(self);
            }
        },
        callAnim: function (elm, coordinate) {
            var cfg = this.cfg;
            new AutoAnim({
                elm: elm,
                x: coordinate[0],
                y: coordinate[1],
                closeAnim: cfg.closeAnim,
                duration: cfg.duration,
                easing: cfg.easing,
                direction: cfg.direction,
                frame: cfg.owner.frame,
                owner: cfg.owner
            });
        },
        _getMinMaxColHeight: function () {
            var cfg = this.cfg,
                min = Infinity,
                doneQuery = cfg.owner.curQuery.query, // TODO 如果使用的类型是链表？
                max = Math.max.apply(Math, doneQuery);

            if (max == 0) { // 说明是空容器
                min = 0;
            } else {
                for (var i = 0, len = doneQuery.length; i < len; i++) {
                    if (doneQuery[i] != 0 && doneQuery[i] < min) {
                        min = doneQuery[i];
                    }
                }
            }

            return {
                min: min,
                max: max
            };
        },
        /**
         * 设置容器高度
         * @param height
         */
        setHeight: function (height) {
            var cfg = this.cfg;
            if (!cfg.autoHeight) {
                return;
            }
            cfg.landscapeOrientation ? D.width(cfg.container, height + cfg.unitMargin.x) :D.height(cfg.container, height + cfg.unitMargin.y);
        },
        /**
         * @deprecated 该功能暂时未完善
         *
         * @param items
         * @private
         */
        _cellSort: function (items) {
            var self = this,
                _maxHeight = 0,
                _row = 0,
                curQuery = [];
            S.each(items, function (i, key) {
                S.log('star from here!');
                curQuery.push(self._getCells());
                //self.callAnim(i,coordinate);
            });
        },
        _getCells: function () {
            return this._getCols();
        }
    };
    return GridSort;
}, {requires: ['./anim', './linkedlist', 'dom']});
/**
 * @Description:    网页自适应布局Base 1.2
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.2/base',function (S, Config, GridSort, Base) {
    'use strict';
    var D = S.DOM, E = S.Event, win = window;

    /**
     * @name AutoResponsive
     * @class 网页自适应布局
     * @constructor
     * @extends Base
     */
    function AutoResponsive() {
        AutoResponsive.superclass.constructor.apply(this, arguments);

        if (!S.get(this.get('container'))) {
            S.log('can not init, lack of container!');
            return;
        }

        this.fire('beforeInit', {
            autoResponsive: this
        });

        if (this.get('autoInit')) {
            this.init();
        }

        this.fire('afterInit', {
            autoResponsive: this
        });
    }

    S.extend(AutoResponsive, Base, {
        /**
         * 初始化组件
         * @return  排序实例
         */
        init: function () {
            this._bindEvent();
            this.initPlugins();
            this.render();
            S.log('AutoResponsive init!');
        },
        /**
         * 初始插件
         */
        initPlugins: function () {
            this.api = {};
            for (var i = 0, a = this.get('plugins'), len = a.length, v; i < len; i++) {
                v = a[i];
                v.init(this);
                S.mix(this.api, v.api);
            }
        },
        /**
         * 渲染排序结果
         */
        render: function () {
            var userCfg = this.getAttrVals(),
                whensRecountUnitWH = this.get('whensRecountUnitWH');
            userCfg.isRecountUnitWH = !!whensRecountUnitWH.length;
            this.frame = this.frame || 0;
            arguments[0] && S.each(arguments[0], function (i, _key) {
                userCfg[_key] = i;
            });

            // 应用插件属性
            S.mix(userCfg, this.api);
            this.gridSort = this.gridSort || new GridSort();
            this.gridSort.init(userCfg, this);
        },
        /**
         * 绑定浏览器resize事件
         */
        _bind: function (handle) {
            var self = this,
                whensRecountUnitWH = self.get('whensRecountUnitWH');
            if (self.get('closeResize')) {
                return;
            }
            E.on(win, 'resize', function () {
                handle.call(self, {isRecountUnitWH: S.inArray('resize', whensRecountUnitWH)});
            });
        },
        /**
         * 添加事件节流阀
         */
        _bindEvent: function () {
            var self = this;
            self._bind(S.buffer(function () {   // 使用buffer，不要使用throttle
                var delayOnResize = self.get('delayOnResize');
                self.fire('beforeResize');
                if(delayOnResize !== -1){
                    setTimeout(function(){
                        self.render(arguments);
                    },delayOnResize);
                }else{
                    self.render(arguments);
                }
                self.fire('resize'); // 浏览器改变触发resize事件
            }, self.get('resizeFrequency'), self));
        },
        /**
         * 重新布局调整
         */
        adjust: function (isRecountUnitWH) {
            var whensRecountUnitWH = this.get('whensRecountUnitWH');
            this.__isAdjusting = 1;
            this.render({
                isRecountUnitWH: isRecountUnitWH || S.inArray('adjust', whensRecountUnitWH)
            });
            this.__isAdjusting = 0;
            S.log('adjust success');
        },
        isAdjusting: function () {
            return this.__isAdjusting || 0;
        },
        /**
         * 优先排序方法
         * @param {String} 选择器
         */
        priority: function (selector) {
            this.render({
                priority: selector
            });
        },
        /**
         * 过滤方法
         * @param {String} 选择器
         */
        filter: function (selector) {
            this.render({
                filter: selector
            });
        },
        /**
         * 调整边距
         * @param {Object} 边距
         */
        margin: function (margin) {
            this.render({
                unitMargin: margin
            });
        },
        /**
         * 方向设置
         * @param {String} 方向
         */
        direction: function (direction) {
            this.render({
                direction: direction
            });
        },
        /**
         * 随机排序
         */
        random: function () {
            this.render({
                random: true
            });
        },
        /**
         * 改变组件设置
         * @param {Object} 设置对象
         */
        changeCfg: function (cfg) {
            var self = this;
            S.each(cfg,function(i,key){
                self.set(key,i);
            });
        },
        /**
         * append 方法,调用跟随队列优化性能
         * @param {Object} 节点对象（可以为单个元素、多个元素数组、fragments，以及混合数组）
         */
        append: function (nodes) {
            D.append(nodes, this.get('container'));
            this.render({
                cache: true
            });
        },
        /**
         * dom prepend 方法,耗费性能
         * @param {Object} 节点对象（可以为单个元素、多个元素数组、fragments，以及混合数组）
         */
        prepend: function (nodes) {
            D.prepend(nodes, this.get('container'));
            this.render();
        }
    }, { ATTRS: new Config()});

    return AutoResponsive;

}, {requires: ['./config', './gridsort', 'base', 'dom', 'event']});
/**
 * @Description:    hash回溯、功能路由
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.2/plugin/hash',function (S) {
    'use strict';
    var AND = '&',
        EQUAL = '=';

    /**
     * @name hash
     * @class 自适应布局
     * @constructor
     */
    function Hash(cfg) {
        var self = this;
        self.prefix = cfg.prefix || 'ks-';
        self.api = {};
    }

    /**
     * 启用插件便开始解析
     */
    S.augment(Hash, {
        init: function (owner) {
            var self = this;
            S.log('hash init!');
            if (!self.hasHash()) {
                return;
            }
            self.parse();
        },
        hasHash: function () {
            return location.hash ? true : false;
        },
        parse: function () {
            var self = this;
            self.getParam();
        },
        /**
         * 解析hash
         * priority,filter
         */
        getParam: function () {
            var self = this;
            self.hash = location.hash.split(AND);
            S.each(self.hash, function (param) {
                self.getPriority(param);
                self.getFilter(param);
            });
        },
        getPriority: function (str) {
            var self = this,
                _priority = self.prefix + 'priority';
            if (str.indexOf(_priority) != -1) {
                S.mix(self.api, {
                    priority: str.split(EQUAL)[1]
                });
            }
        },
        getFilter: function (str) {
            var self = this,
                _filter = self.prefix + 'filter';
            if (str.indexOf(_filter) != -1) {
                S.mix(self.api, {
                    filter: str.split(EQUAL)[1]
                });
            }
        }
    });
    return Hash;
}, {requires: ['event']});
/**
 * @Description:    拖拽功能
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.2/plugin/drag',function (S) {
    'use strict';
    var E = S.Event, DD = S.DD,
        DraggableDelegate = DD.DraggableDelegate,
        Droppable = DD.Droppable;

    /**
     * @name Drag
     * @class 拖拽功能
     * @constructor
     */
    function Drag(cfg) {
    }

    /**
     *
     */
    S.augment(Drag, {
        init: function () {
            var self = this;
            S.log('drag init!');
        },
        _bindDrop: function (elm) {
            var self = this;
            if (self.drag != 'on') {
                return;
            }
            new Droppable({
                node: elm
            }).on("dropenter", function (ev) {
                    D.insertAfter(ev.drag.get("node"), ev.drop.get("node"));
                    self.owner.render();
                });
        },
        _bindBrag: function () {
            var self = this;
            if (self.drag != 'on') {
                return;
            }
            new DraggableDelegate({
                container: self.container,
                selector: self.selector,
                move: true
            }).on('dragstart',function (ev) {
                    var _target = ev.drag.get("node")[0];
                    this.p = {
                        left: _target.offsetLeft,
                        top: _target.offsetTop
                    };
                }).on('drag',function () {
                }).on('dragend', function (ev) {
                    D.css(ev.drag.get("node"), this.p);
                });
        }
    });
    return Drag;
}, {requires: ['event', 'dd']});
/**
 * @Description:    Loader
 * @Author:         dafeng.xdf[at]taobao.com zhuofeng.ls[at]taobao.com
 * @Date:           2013.03.05
 *
 * @Log:
 *    - 2013.07.03 zhuofeng.ls
 *      1.[!] fill loader detail functions.
 *
 *    - 2013.03.05 dafeng.xdf
 *      1.[+] build this file.
 */
KISSY.add('gallery/autoResponsive/1.2/plugin/loader',function (S) {
    'use strict';
    var D = S.DOM, E = S.Event, win = window,

        SCROLL_TIMER = 50;

    /**
     * @name Loader
     * @class 加载器
     * @constructor
     */
    function Loader(cfg) {
        if (!(this instanceof Loader)) {
            return new Loader(cfg);
        }

        this._makeCfg(cfg);
    }

    /**
     * 启用插件便开始解析
     */
    S.augment(Loader, S.EventTarget, {
        /**
         * loader插件初始化
         * @public 供宿主对象在插件初始化时调用
         * @param owner Base对象（即插件宿主对象）
         */
        init: function (owner) {

            this.owner = owner;

            this.__bindMethods();

            this._reset();

        },
        /**
         * 状态及绑定重置
         * @private
         */
        _reset: function(){
            var self = this,
                userCfg = self.config,
                mod = userCfg.mod;

            self.__started = self.__destroyed = self.__stopped = 0;

            if (mod === 'manual') { // 手动触发模式 | 这种情况多是用户自定义load触发条件，如点击更多按钮时触发
                // nothing to do

            } else { // 自动触发模式

                self.__onScroll(); // 初始化时立即检测一次，但是要等初始化 adjust 完成后.

                self.start();
            }
        },
        /**
         * 用户配置修正
         * @param cfg
         * @private
         */
        _makeCfg: function(cfg){
            cfg = {
                load: typeof cfg.load == 'function' ? cfg.load : function (success, end) {
                    S.log('AutoResponsive.Loader::_makeCfg: the load function in user\'s config is undefined!', 'warn');
                },
                diff: cfg.diff || 0,  // 数据砖块预载高度
                mod: cfg.mod == 'manual' ? 'manual' : 'auto',  // load触发模式
                qpt: 15 // 每次渲染处理的最大单元数量，如15表示每次最多渲染15个数据砖块，多出来的部分下个时间片再处理
            };

            this.config = cfg;
        },
        /**
         * 暴露成外部接口，主要目的是让使用者可以动态改变loader某些配置（如mod），而不需要重新实例化
         * 修改的配置会立即生效
         * @param cfg
         */
        changeCfg: function(cfg){
            this.stop(); // 终止原来的loader
            this._makeCfg(S.merge(this.config, cfg)); // 重新配置
            this._reset(); // 状态及事件重置
        },
        /**
         * 在自动触发模式下，监测屏幕滚动位置是否满足触发load数据的条件
         * @private
         */
        __doScroll: function (e) {
            var self = this,
                owner = self.owner,
                userCfg = self.config;

            if(self.__scrollDirection === 'up')
                return;

            S.log('AutoResponsive.Loader::__doScroll...');

            if (self.__loading) {
                return;
            }
            // 如果正在调整中，等会再看；
            // 调整中的高度不确定，现在不适合判断是否到了加载新数据的条件
            if (owner.isAdjusting()) {
                // 恰好 __onScroll 是 buffered
                self.__onScroll();
                return;
            }

            var container = S.get(owner.get('container'));
            // in case that the container's current style is 'display: none'
            if (!container.offsetWidth) {
                return;
            }

            var offsetTop = D.offset(container).top,
                diff = userCfg.diff,
                minColHeight = owner.getMinColHeight(),
                scrollTop = D.scrollTop(win),
                height = D.height(win);

            // 动态加载 | 低于预加载线(或被用户看到了)时触发加载
            if (diff + scrollTop + height >= offsetTop + minColHeight) {
                self.load();
            }
        },
        /**
         * 使用用户自定义load函数对数据进行loading
         * @public 在手动模式时可以供外部调用
         */
        load: function () {
            var self = this,
                userCfg = self.config,
                load = userCfg.load;

            if (self.__stopped) {
                S.log('AutoResponsive.Loader::load: this loader has stopped, please to resume!', 'warn');
                return;
            }

            S.log('AutoResponsive.Loader::loading...');

            self.__loading = 1;

            load && load(success, end);

            function success(items, callback) {
                self.__addItems(items, function () {

                    callback && callback.call(self);

                    self.__doScroll(); // 加载完不够一屏再次检测
                });

                self.__loading = 0;
            }

            function end() {
                self.stop();
            }
        },
        isLoading: function () {
            return this.__loading;
        },
        isStarted: function () {
            return this.__started;
        },
        isStopped: function () {
            return this.__stopped;
        },
        isDestroyed: function () {
            return this.__destroyed;
        },
        /**
         * 将指定函数（__appendItems）封装到时间片函数中
         * @private
         * @param items
         * @param callback
         * @returns {*}
         */
        __addItems: function (items, callback) {
            var self = this;

            // 创建一个新的时间片管理器（旧的如果任务还没处理完还会继续处理，直到处理完毕自动销毁）
            timedChunk(items, self.__appendItems, self,function () {

                callback && callback.call(self);

                // TODO revise...
                self.fire('autoresponsive.loader.complete', {
                    items: items
                });
            }).start();

        },
        /**
         * 向容器中插入新节点
         * @private
         * @param items
         */
        __appendItems: function (items) {
            var self = this,
                owner = self.owner;

            items = S.makeArray(items);
            owner.append(items);
        },
        /**
         * 挂载一次，终身受用：
         * 1.为Base对象挂载getMaxColHeight、getMinColHeight方法;
         * 2.为Loader对象挂载__onScroll、__onMouseWheel私有方法
         * @private
         */
        __bindMethods: function () {
            var self = this,
                owner = self.owner,
                curMinMaxColHeight = {min: 0, max: 0};
            owner.on('afterLocate', function (e) {
                curMinMaxColHeight = e.autoResponsive.curMinMaxColHeight;
            });
            owner.getMaxColHeight = function () {
                return curMinMaxColHeight.max;
            };
            owner.getMinColHeight = function () {
                return curMinMaxColHeight.min;
            };

            self.__onScroll = debounce(self.__doScroll, SCROLL_TIMER, self, true); // 建议不要使用Kissy.buffer，否则感觉loader太不灵敏了
            self.__onMouseWheel = function (e) {
                self.__scrollDirection = e.deltaY > 0 ? 'up' : 'down';
            };
        },
        /**
         * 启动loader数据load功能
         * @public
         */
        start: function () {
            E.on(win, 'mousewheel', this.__onMouseWheel);
            this.resume();
        },
        /**
         * 停止loader数据load功能
         * @public
         */
        stop: function () {
            this.pause();
            E.detach(win, 'scroll', this.__onMouseWheel);
            this.__stopped = 1;
        },
        /**
         * 暂停loader数据load功能
         * @public
         */
        pause: function () {
            if (this.__destroyed)
                return;

            E.detach(win, 'scroll', this.__onScroll);
        },
        /**
         * 恢复（重新唤醒）loader数据load功能
         * @public
         */
        resume: function () {
            var self = this;
            if (self.__destroyed) {
                return;
            }
            E.on(win, 'scroll', self.__onScroll);
            self.__started = 1;
            self.__stopped = 0;
        },
        /**
         * 停止loader所有工作，销毁loader对象
         * @deprecated 该功能暂时未完善
         * @public
         */
        destroy: function () {
            // TODO ...
            this.__destroyed = 1;
        }
//        Status: {INIT: 0, LOADING: 1, LOADED: 2, ERROR: 3, ATTACHED: 4}
    });

    /**
     * 时间片轮询函数
     * @param items
     * @param process
     * @param context
     * @param callback
     * @returns {{}}
     */
    function timedChunk(items, process, context, callback) {

        var monitor = {}, timer, todo = []; // 任务队列 | 每一个时间片管理函数（timedChunk）都维护自己的一个任务队列

        var userCfg = context.config,
            qpt = userCfg.qpt || 15;

        monitor.start = function () {

            todo = todo.concat(S.makeArray(items)); // 压入任务队列

            // 轮询函数
            var polling = function () {
                var start = +new Date;
                while (todo.length > 0 && (new Date - start < 50)) {
                    var task = todo.splice(0, qpt);
                    process.call(context, task);
                }

                if (todo.length > 0) { // 任务队列还有任务，放到下一个时间片进行处理
                    timer = setTimeout(polling, 25);
                    return;
                }

                callback && callback.call(context, items);

                // 销毁该管理器
                monitor.stop();
                monitor = null;
            };

            polling();
        };

        monitor.stop = function () {
            if (timer) {
                clearTimeout(timer);
                todo = [];
            }
        };

        return monitor;
    }

    /**
     * 等同于kissy的buffer（保留尾帧的任务，延迟指定时间threshold后再执行）
     * 比kissy的buffer优越的一点是可以设置保留首帧还是尾帧任务（execAsap=true表示保留首帧）
     *
     * @param fn reference to original function
     * @param threshold
     * @param context the context of the original function
     * @param execAsap execute at start of the detection period
     * @returns {Function}
     * @private
     */
    function debounce (fn, threshold, context, execAsap) {
        var timeout; // handle to setTimeout async task (detection period)
        // return the new debounced function which executes the original function only once
        // until the detection period expires
        return function debounced() {
            var obj = context || this, // reference to original context object
                args = arguments; // arguments at execution time
            // this is the detection function. it will be executed if/when the threshold expires
            function delayed() {
                // if we're executing at the end of the detection period
                if (!execAsap)
                    fn.apply(obj, args); // execute now
                // clear timeout handle
                timeout = null;
            }

            // stop any current detection period
            if (timeout)
                clearTimeout(timeout);
            // otherwise, if we're not already waiting and we're executing at the beginning of the detection period
            else if (execAsap)
                fn.apply(obj, args); // execute now
            // reset the detection period
            timeout = setTimeout(delayed, threshold || 100);
        };
    }

    return Loader;

}, {requires: ['dom', 'event']});
/**
 * @Description: 目前先挂载base，effect效果插件，hash插件
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.2/index',function (S, AutoResponsive, Hash, Drag, Loader) {
    AutoResponsive.Hash = Hash;
    AutoResponsive.Drag = Drag;
    AutoResponsive.Loader = Loader;
    return AutoResponsive;
}, {requires: ['./base', './plugin/hash', './plugin/drag', './plugin/loader']});
