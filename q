[1mdiff --git a/app/client/scripts/app.js b/app/client/scripts/app.js[m
[1mindex a86f41b..587e1c3 100644[m
[1m--- a/app/client/scripts/app.js[m
[1m+++ b/app/client/scripts/app.js[m
[36m@@ -27,6 +27,38 @@[m [mapplication.controller('Controller', ['$scope', '$http', '$interval', function($[m
 [m
 }]);[m
 [m
[32m+[m[32m// Draw the stub chart[m
[32m+[m[32mvar chart = c3.generate({[m
[32m+[m[32m  bindto: '#chart',[m
[32m+[m[32m  data: {[m
[32m+[m[32m    columns: [[m
[32m+[m[32m      ['trials', 30, 50, 100, 200, 250, 300],[m
[32m+[m[32m      ['deaths', 500, 600, 400, 100, 50, 10],[m
[32m+[m[32m    ],[m
[32m+[m[32m    axes: {[m
[32m+[m[32m      deaths: 'y2',[m
[32m+[m[32m    },[m
[32m+[m[32m    types: {[m
[32m+[m[32m      deaths: 'bar',[m
[32m+[m[32m    },[m
[32m+[m[32m  },[m
[32m+[m[32m  axis: {[m
[32m+[m[32m    y: {[m
[32m+[m[32m      label: {[m
[32m+[m[32m        text: 'trials',[m
[32m+[m[32m        position: 'outer-middle'[m
[32m+[m[32m      },[m
[32m+[m[32m    },[m
[32m+[m[32m    y2: {[m
[32m+[m[32m      show: true,[m
[32m+[m[32m      label: {[m
[32m+[m[32m        text: 'deaths',[m
[32m+[m[32m        position: 'outer-middle'[m
[32m+[m[32m      }[m
[32m+[m[32m    }[m
[32m+[m[32m  },[m
[32m+[m[32m});[m
[32m+[m
 /**[m
  * Process every trial[m
  *[m
[1mdiff --git a/app/views/index.html b/app/views/index.html[m
[1mindex 864fc28..a1c42d4 100644[m
[1m--- a/app/views/index.html[m
[1m+++ b/app/views/index.html[m
[36m@@ -56,8 +56,8 @@[m
         {{ counter.completed }} of these trials are complete,[m
         and {{ counter.resulted }} with results.[m
       </p>[m
[31m-      <p><img src="/images/statistics.png" alt="Statistics"></p>[m
[31m-      <p>Comparision of completed trials versus published results. </p>[m
[32m+[m[32m      <div id="chart"></div>[m
[32m+[m[32m      <p>How publishing trial results affects on deaths count.</p>[m
     </div>[m
 [m
     <div data-ng-if="!trials.length">[m
[1mdiff --git a/app/views/layouts/base.html b/app/views/layouts/base.html[m
[1mindex c539d5e..6e703d1 100644[m
[1m--- a/app/views/layouts/base.html[m
[1m+++ b/app/views/layouts/base.html[m
[36m@@ -13,9 +13,12 @@[m
   <link rel="stylesheet" href="//cdn.rawgit.com/okfn/ok-panel/v1.0.0/assets/css/frontend.css">[m
   <link rel="stylesheet" href="//cdn.rawgit.com/okfn/app-theme/924b03098a3d0fcaa5acf573f51571f519f80c94/css/main.min.css">[m
 [m
[32m+[m[32m  <!-- Libraries -->[m
[32m+[m[32m  <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.css">[m
[32m+[m
   <!-- Application -->[m
[31m-  <link rel="stylesheet" type="text/css" href="/styles/vendor.min.css" />[m
[31m-  <link rel="stylesheet" type="text/css" href="/styles/app.min.css" />[m
[32m+[m[32m  <link rel="stylesheet" type="text/css" href="/styles/vendor.min.css">[m
[32m+[m[32m  <link rel="stylesheet" type="text/css" href="/styles/app.min.css">[m
 [m
   <!-- Icons -->[m
   <link rel="shortcut icon" type="image/png" href="/favicon.png">[m
[36m@@ -43,6 +46,8 @@[m
 <script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js"></script>[m
 <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular.min.js"></script>[m
 <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>[m
[32m+[m[32m<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js"></script>[m
[32m+[m[32m<script src="//cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js"></script>[m
 [m
 <!-- Application -->[m
 <script src="/scripts/vendor.min.js"></script>[m
