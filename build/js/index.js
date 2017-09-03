/**
 * Created by wss19 on 2017/6/19.
 */
'use strict';
var app = angular.module('app',['ui.router','ngAnimate'])
// .run(['$rootScope'],function ($rootScope) {
//     // $rootScope.im = function () {
//     //     console.log('im')
//     // }
// });
/**
 * Created by wss19 on 2017/6/25.
 */
'use strict';
angular.module('app').value('dict',{}).run(['dict','$http',function (dict,$http) {
    //创建全局变量
    $http.get('data/city.json').then(function (res) {
        dict.city = res.data
    })

    $http.get('data/salary.json').then(function (res) {
        dict.salary = res.data
    })
    $http.get('data/scale.json').then(function (res) {
        dict.scale = res.data
    })
}])
/**
 * Created by wss19 on 2017/7/2.
 */
'use strict'
angular.module('app').config(['$provide',function ($provide) {
    $provide.decorator('$http',['$delegate','$q',function ($delegate,$q) {
        // 这里的 $delegate 相当于是$http
        $delegate.post = function (url, data, config) {
            var def = $q.defer();
            $delegate.get(url).then(function (res) {
                def.resolve(res)
            },function (err) {
                def.reject(err)
            })
            return {
                success: function (cb) {
                    def.promise.then(cb)
                },
                error: function (cb) {
                    def.promise.then(null,cb)
                }
            }
        }
        return $delegate;
    }])
}])
/**
 * Created by wss19 on 2017/6/19.
 */
'use strict';
angular.module('app').config(['$stateProvider','$urlRouterProvider',
    function ($stateProvider,$urlRouterProvider) {
        $stateProvider.state('main',{
            url: '/main',
            templateUrl: 'view/main.html',
            controller: 'mainCtrl'
        }).state('position',{
            url: '/position/:id',
            templateUrl: 'view/position.html',
            controller: 'positionCtrl'
        }).state('company',{
            url:'/company/:id',
            templateUrl:'view/company.html',
            controller:'companyCtrl'
        }).state('search',{
            url:'/search',
            templateUrl:'view/search.html',
            controller:'searchCtrl'
        }).state('login',{
            url:'/login',
            templateUrl:'view/login.html',
            controller:'loginCtrl'
        }).state('register',{
            url:'/register',
            templateUrl:'view/register.html',
            controller:'registerCtrl'
        }).state('favorite',{
            url:'/favorite',
            templateUrl:'view/favorite.html',
            controller:'favoriteCtrl'
        }).state('post',{
            url:'/post',
            templateUrl:'view/post.html',
            controller:'postCtrl'
        }).state('me',{
            url:'/me',
            templateUrl:'view/me.html',
            controller:'meCtrl'
        })
        $urlRouterProvider.otherwise('main')
}])
/**
 * Created by wss19 on 2017/6/19.
 */
'use strict';
angular.module('app').controller('companyCtrl',['$http','$state','$scope',function ($http,$state,$scope) {
    $http.get('data/company.json?id='+$state.params.id).then(function (res) {
        $scope.company = res.data
        $scope.$broadcast('abc',{id:1})  // 向下级传播广播
    })
    $scope.$on('cba',function (event, data) {
        console.log(data)
    })
}])
/**
 * Created by wss19 on 2017/6/19.
 */
'use strict';
angular.module('app').controller('favoriteCtrl',['$http','$scope',function ($http,$scope) {
    $http.get('data/myFavorite.json').then(function (res) {
        $scope.list = res.data
    })
}])
/**
 * Created by wss19 on 2017/6/19.
 */
'use strict';
angular.module('app').controller('loginCtrl',['$cacheFactory','$http','$state','$scope',function ($cacheFactory,$http,$state,$scope) {
    $scope.submit = function () {
        $http.post('data/login.json').success(function (res) {
            var myAppCache = $cacheFactory("myAppCache");
            myAppCache.put('item', res.data);
            // cache.put('name',res.data.name)
            // cache.put('image',res.data.image)
            $state.go('main')
        })
     }
}])
/**
 * Created by wss19 on 2017/6/19.
 */
'use strict';
angular.module('app').controller('mainCtrl',['$http','$scope',function ($http,$scope) {
    $http.get('data/positionList.json').then(function (res) {
        $scope.list = res.data
        console.log($scope.list)
    })
}])
/**
 * Created by wss19 on 2017/6/19.
 */
'use strict';
angular.module('app').controller('meCtrl',['$state','$cacheFactory','$http','$scope',function ($state,$cacheFactory,$http,$scope) {
    // 从http中去获取缓存
    // get("$http")这里的$http就是上面cache:true创建的缓存实体
    // var httpCache = $cacheFactory.get('$http');
    // // get("./api/getdata.php")中的字符串就是上面url的地址作为名字
    // var res= httpCache.get('../../data/login.json');
    // if(res){
    //     $scope.name = JSON.parse(res[1]).name
    //     myAppCache.put('item1', $scope.name);
    // }
    var item = $cacheFactory.get('myAppCache');
    if ($cacheFactory.get('myAppCache')) {
        $scope.name = $cacheFactory.get('myAppCache').get('item').name;
        $scope.image = $cacheFactory.get('myAppCache').get('item').image;
        // $cacheFactory.get('myAppCache').get('item').name = ""
        // $cacheFactory.get('myAppCache').get('item').image =""
    }
    $scope.logout = function () {
        item.removeAll();
        // $cacheFactory("myAppCache").remove('item')
        // $cacheFactory("myAppCache").destroy();
        $state.go('main')
    }
}])
/**
 * Created by wss19 on 2017/6/19.
 */
'use strict';
angular.module('app').controller('positionCtrl',['$cacheFactory','$q','$http','$state','$scope',function ($cacheFactory,$q,$http,$state,$scope) {
    if($cacheFactory.get('myAppCache')) {
        $scope.isLogin= !!$cacheFactory.get('myAppCache').get('item').name
        console.log($scope.isLogin)
    }
    function getPosition() {
        var def = $q.defer(); // 延迟加载对象
    $http.get('../data/position.json').then(function (res) {
       $scope.position=res.data
        def.resolve(res.data)
    });
       // console.log(def.promise)
    return def.promise  // 利用$q，在进行异步操作
    }
    function getCompany(id) {
      // console.log(id)
        $http.get('data/company.json?id='+id).then(function (res) {
            $scope.company=res.data
          //  console.log(res)
        })
    }
    getPosition().then(function (obj) {  // 同步操作
        getCompany(obj.companyId)
    })

/****************对两个异步方法都进行操作*************************/
            //在两个异步的方法执行完成之后在进行下面的操作
        // $q.all([fun1(),fun2()]).then(function (result) {
        //
        // })
}])
/**
 * Created by wss19 on 2017/6/19.
 */
'use strict';
angular.module('app').controller('postCtrl',['$http','$scope',function ($http,$scope) {
    $scope.tabList = [{
        id: "all",
        name: "全部"
    },{
        id: "pass",
        name: "面试邀请"
    },{
        id: "fail",
        name: "不合适"
    }];
    $http.get('data/myPost.json').then(function (res) {
        $scope.positionList = res.data
        console.log($scope.positionList)
    })
    $scope.filterObj = {};
    $scope.tClick = function (id,name) {
        switch (id) {
            case 'all':
                delete $scope.filterObj.state
                break;
            case 'pass':
                $scope.filterObj.state = "1"
                break;
            case 'fail':
                $scope.filterObj.state = "-1"
                break;
        }
    }
}])
/**
 * Created by wss19 on 2017/6/19.
 */
'use strict';
angular.module('app').controller('registerCtrl',['$interval','$http','$scope','$state',function ($interval,$http,$scope,$state) {
    $scope.submit=function () {
        $scope.user = {
            "username": $scope.username,
            "password": $scope.password
        }
        $http.post('data/regist.json',$scope.user).success(function (res) {
            $state.go('login')
        })
    }
    var count = 60;
    $scope.send=function () {
        $http.get('data/code.json').then(function (res) {
            if (1===res.data.state) {
                count = 60;
                $scope.time = '60s';
               var interval = $interval(function () {
                    if (count==0){
                        $interval.cancel(interval)
                        $scope.time= ""
                        count=60
                        return
                    }else {
                        count--;
                        $scope.time = count + 's'
                    }
                },1000)
            }
        })
    }
}])
/**
 * Created by wss19 on 2017/6/19.
 */
'use strict';
angular.module('app').controller('searchCtrl',['$http','$state','$scope','dict','$rootScope',function ($http,$state,$scope,dict,$rootScope) {
    $scope.name = ""
    $scope.search = function () {
        $http.get('data/positionList.json?name='+$scope.name).then(function (res) {
            $scope.positionList = res.data
        })
    }
    $scope.search();
    $scope.sheet={};
    $scope.tabList = [{
        id:"city",
        name:"城市"
    },{
        id:"salary",
        name:"薪水"
    },{
        id:"scale",
        name:"公司规模"
    }]
    $rootScope.showSearch = false;
    $scope.sheet.visible =""
    $scope.filterObj={}
    var tabId = ""
    $scope.tClick = function (id,name) {
        tabId = id
        $scope.sheet.list=dict[id]
        //console.log($scope.sheet.list)
        $scope.sheet.visible = !$scope.sheet.visible
        $rootScope.showSearch = true
    }
    $scope.done =function () {
        $scope.sheet.visible = false
        $rootScope.showSearch = false
    }
    $scope.sClick = function (id,name) {
        console.log(id)
        if(id){
            angular.forEach($scope.tabList,function (item) {
                if(item.id===tabId){
                    item.name = name
                }
            })
            $scope.filterObj[tabId + 'Id'] = id
        }else {
            delete $scope.filterObj[tabId + 'Id']
            angular.forEach($scope.tabList,function (item) {
                if(item.id===tabId){
                   switch (item.id) {
                       case 'city':
                           item.name = "城市";
                           break;
                       case 'salary':
                           item.name = "薪水";
                           break;
                       case 'scale':
                           item.name = "公司规模";
                           break;
                       default:
                   }
                }
            })
        }
    }
}])












/**
 * Created by wss19 on 2017/6/21.
 */
'use strict';
angular.module('app').directive('appCompany',[function () {
    return {
        restrict: 'A',
        replace: true,
        scope:{
          company:'='
        },
        templateUrl: 'view/template/company.html'
    }
}])
/**
 * Created by wss19 on 2017/6/19.
 */
'use strict';
angular.module('app').directive('appFoot',[function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/foot.html'
    }
}])
/**
 * Created by wss19 on 2017/6/19.
 */
'use strict';
angular.module('app').directive('appHead',['$cacheFactory',function ($cacheFactory) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/head.html',
        link:function ($scope) {
            if($cacheFactory.get('myAppCache')){
                $scope.name = $cacheFactory.get('myAppCache').get('item').name
            }

        }
    }
}])
/**
 * Created by wss19 on 2017/6/21.
 */
'use strict';
angular.module('app').directive('appHeadBar',[function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/headBar.html',
        scope:{
            text: '@'
        },
        link:function ($scope) {
            $scope.back=function () {
                window.history.back();
            }
            $scope.$on('abc',function (event, data) {  // 接受上级广播的值
                console.log(data)
            })
            $scope.$emit('cba',{name:2}) // 向上级传播广播
        }
    }
}])
/**
 * Created by wss19 on 2017/6/21.
 */
'use strict';
angular.module('app').directive('appPositionClass',[function () {
    return {
        restrict: 'A',
        replace: true,
        scope:{
            company:'='
        },
        templateUrl: 'view/template/positionClass.html',
        link: function ($scope) {
            $scope.showPositionList = function (idx) {
                $scope.positionList = $scope.company.positionClass[idx].positionList
                $scope.isActive = idx
            }
            $scope.$watch('company',function (newVal) {
                if (newVal) {
                    $scope.showPositionList(0) // 监听到company值改变时，才执行下面的函数
                }
            })
        }
    }
}])
/**
 * Created by wss19 on 2017/6/21.
 */
'use strict';
angular.module('app').directive('appPositionInfo',[function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionInfo.html',
        scope:{
            isActive:'=',
            isLogin:'=',
            position:'='
        },
        link: function ($scope) {
            $scope.imagePath=$scope.isActive? '../../image/star-active.png':'../../image/star.png'
            $scope.favorite=function () {

            }
        }
    }
}])
/**
 * Created by wss19 on 2017/6/21.
 */
'use strict';
angular.module('app').directive('appPositionList',['$cacheFactory','$http',function ($cacheFactory,$http) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionList.html',
        scope:{
            data: "=",
            filterObj:"=",
            isFavorite: "="
        },
        link: function ($scope) {
            //$scope.name = $cacheFactory.get('myAppCache') || '';
            $scope.select = function (item) {
                $http.post('data/favorite.json',{id:item.id,select:!item.select}).success(function (res) {
                    item.select = !item.select
                })
            }
        }
    }
}])
/**
 * Created by wss19 on 2017/6/21.
 */
'use strict';
angular.module('app').directive('appSheet',['$rootScope',function ($rootScope) {
    return {
        restrict: 'A',
        replace: true,
        scope:{
          list:"=",
          visible:"=",
          select: "&"
        },
        templateUrl: 'view/template/sheet.html',
        link:function ($scope) {
            $scope.done =function () {
                $scope.visible = false
                $rootScope.showSearch = false
            }
        }
    }
}])
/**
 * Created by wss19 on 2017/6/24.
 */
'use strict';
angular.module('app').directive('appTab',[function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl:'view/template/tab.html',
        scope:{
          list:"=",
          tabClick:"&"
        },
        link:function ($scope) {
            $scope.click = function (tab) {    // 在这里接收子组件传来的值，然后通过tabClick传值给控制器
                $scope.selectId = tab.id
                //console.log(tab)
                $scope.tabClick(tab)
            }
        }
    }
}])
/**
 * Created by wss19 on 2017/6/26.
 */
'use strict';
angular.module('app').filter('filterByObj',[function () {
    return function (list, obj) {
        var result = []

        angular.forEach(list,function (item) {
            var isEqual = true
            for (var e in obj) {
                //console.log(item[e])
                if(item[e]!==obj[e]){
                    isEqual = false
                }
            }
            if(isEqual){
                result.push(item)
            }
        })
        console.log(result)
        return result;
    }
}])
/**
 * Created by wss19 on 2017/6/24.
 */
'use strict';
// angular.module('app').service('cache',['$cookies',function ($cookies) {
//     this.put = function (key, value) {
//         $cookies.put(key, value)
//     };
//     this.get = function (key) {
//         return $cookies.get(key)
//     }
//     this.remove = function (key) {
//         $cookies.remove(key)
//     }
// }])

angular.module('app').factory('cache',['$cookies',function ($cookies) {
    // factory 的好处：可以申明内部的私有属性
    var obj = {};
    return {
        put:function (key, value) {
            $cookies.put(key,value)
        },
        get:function (key) {
            return $cookies.get(key)
        },
        remove: function (key) {
            $cookies.remove(key)
        }
    }
}])