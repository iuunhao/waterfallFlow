window.addEventListener('load', function() {
    var margin = 10, //边距
        h = [], //存放排序数组
        column = 2, //设置没列显示多少个
        eUl = document.querySelector('ul'),
        eLoad = document.querySelector('.loading'),
        eBody = document.body,
        aLen = 0,
        eScrollHeight = document.documentElement.scrollHeight,
        eClientHeight = document.documentElement.clientHeight,
        eScrollTop = document.body.scrollTop;

    // 扩展数组方法
    Array.min = function(array) {
        return Math.min.apply(Math, array);
    };
    Array.max = function(array) {
        return Math.max.apply(Math, array);
    };

    // 获取元素对应的索引
    function getIndex(arr, val) {
        for (var i in arr) {
            if (arr[i] == val) return i;
        }
    }

    // 定位函数
    function position() {
        var eLi = document.querySelectorAll('li');
        for (var i = 0; i < eLi.length; i++) {
            var marginLen = margin * (column + 1),
                curWidth = (document.documentElement.offsetWidth - marginLen) / column;
            eLi[i].style.width = Math.ceil(curWidth) + 'px';

            var eWidth = eLi[0].offsetWidth + margin,
                eHeight = eLi[i].offsetHeight;

            if (i < column) {
                eLi[i].style.top = 0;
                eLi[i].style.left = (i * eWidth) + 'px';
                h[i] = eHeight;
            } else {
                var minH = Array.min(h);
                eLi[i].style.top = minH + margin + 'px';
                var minIndex = getIndex(h, minH);
                eLi[i].style.left = minIndex * eWidth + 'px';
                h[minIndex] += eHeight + margin;
                eUl.style.height = Array.max(h) + margin + 'px';
            }
        }
    };

    // 创建元素并插入
    function cEle(data, index) {
        var html = '';
        html += '<a class="_imgLink" href=""><img class="_img" src="' + data.list[index].imgUrl + '" alt="">';
        html += '</a>';
        html += '<div class="_Info">';
        html += '<p class="_txtContent">' + data.list[index].text + '</p>';
        html += '<a class="_userLink" href="' + data.list[index].userInfoUrl + '"><img class="_userImg" src="' + data.list[index].userImg + '" alt=""><span class="_userName">' + data.list[index].userName + '</span></a>';
        html += '</div>';
        // 创建li
        var ele = document.createElement('li');
        // 添加动画class
        ele.classList.add('fadeIn');
        ele.classList.add('animated');
        // 赋值innerHTML内容
        ele.innerHTML = html;
        eLoad.classList.add('none');
        if (!index) {
            // 如果当前元素为第一个直接插入元素
            document.querySelector('._List').appendChild(ele);
        } else {
            // 创建一个image元素
            var _img = new Image();
            // 设置此images为当前获取的src并添加
            _img.setAttribute('src', data.list[index].imgUrl);
            // 添加一个class，方便后面删除
            _img.classList.add('_NewImg');
            // 将其images插入body内
            document.body.appendChild(_img);
            console.log('正在加载第' + index + '张图')
            // 监听插入的iamges是否加载完成
            _img.addEventListener('load', function() {
                console.log('第' + index + '加载完成')
                // 如果加载完成将上面定义的li插入到ul内
                eUl.appendChild(ele);
                // 在图片没有加载完成，无法获取其宽度，在插入了图片之后就可以让其显示
                // 每次插入都要重新计算数组来初心定位
                position();

            });
            eUl.classList.add('_block');
            // 插入完成即可删除创建的图片
            eBody.removeChild(document.querySelector('._NewImg'));
            // 如果图片加载失败
            _img.addEventListener('error', function() {
                // console.log('第' + index + '加载失败')
                // 如果加载失败也需要讲起li插入ul内
                eUl.appendChild(ele);
                // js动态添加元素后需要重续获取元素列表
                var curLi = document.querySelectorAll('li');
                // 获取图片元素
                var courlImg = curLi[index].querySelector('._img');
                // 给其设置一个默认图片，告诉用户图片加载失败（此处有待优化，可以重新发起请求）
                curLi.setAttribute('src', data.option.failUrl)
                    // console.log('替换图片为默认图')
                    // 需要重新定位
                position();
            })
        }
    }

    // 事件监听
    // 浏览器窗口发生变化
    window.addEventListener('resize', function() {
        position();
    });
    // 用户滚动请求数据
    window.addEventListener('scroll', function() {

        aLen++;
        // 如果用户滚动页面至距底部200px位置，请求数据
        if ((eScrollHeight - eClientHeight - eScrollTop) <= 200) ajax(aLen);
    })

    //请求数据
    function ajax(n) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("get", "../js/data.json");
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var data = eval('(' + xmlHttp.responseText + ')');
                // 延时抛出每个li，为了动画效果
                var timer;
                // 模拟后台分段请求
                for (var i = aLen; i < (aLen + 4); i++) {
                    if (i <= (aLen + 4)) {
                        (function(i) {
                            // 每500毫秒向ul插入一个li，形成逐个添加动画效果
                            timer = setTimeout(function() {
                                cEle(data, i);
                            }, i * 500)
                        })(i)
                    } else {
                        // 如果已经遍历至要求的个数清除定时器
                        clearTimeout(timer);
                        // 同时返回
                        return;
                    }
                }
            }
        }
        xmlHttp.send(null);
    }
    // 页面刚加载需要显示默认显示的一部分
    ajax(aLen);

});
