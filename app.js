/* 
   * Tansaku
   * A search engine of sorts (written more as a proof of concept)
   * 2016 Gautam Mittal
/*

/* Tiny scientific computing library */
var nj=function(){function r(r){for(var t=[];t.push(r.length),Array.isArray(r[0]);)r=r[0];return t}function t(r){for(var n=[],i=0;i<r[0];++i)n.push(1==r.length?0:t(r.slice(1)));return n}function n(r){for(var t=[],i=0;i<r[0];++i)t.push(1==r.length?1:n(r.slice(1)));return t}function i(r){return Array.apply(null,new Array(r)).map(function(r,t,n){return n.map(function(r,n){return t===n?1:0})})}function a(t,n){if(r(t)[0]!=r(n)[0])throw"Error: Arrays have different lengths";for(var i=0,a=0;a<r(t)[0];a++)i+=t[a]*n[a];return i}function s(n,i){var s=r(n)[0],e=r(n)[1],h=r(i)[0],u=r(i)[1];if(s==h)return a(n,i);if(e!=h)throw"Error: Incompatible size";for(var o=t([s,u]),f=0;s>f;f++){o[f]=[];for(var c=0;u>c;c++){for(var m=0,p=0;e>p;p++)m+=n[f][p]*i[p][c];o[f][c]=m}}return o}this.array=function(t){this.insert=function(){var r=arguments[arguments.length-1];this.matrix[arguments[0]][arguments[1]]=r},this.matrix=t,this.shape="("+r(this.matrix)+")",this.type="njarray"},this.zeros=function(n){this.matrix=t(n),this.shape="("+r(this.matrix)+")",this.type="njarray"},this.ones=function(t){this.matrix=n(t),this.shape="("+r(this.matrix)+")",this.type="njarray"},this.eye=function(t){this.matrix=i(t),this.shape="("+r(this.matrix)+")",this.type="njarray"},this.inner=function(r,t){this.matrix=a(r,t)},this.dot=function(r,t){this.matrix=s(r,t)}},nj=new nj();


