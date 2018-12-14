chrome.cookies.get({
    url:"http://study.teacheredu.cn",
    name:"CAS_SID",
},function(cookies){
    console.log(cookies);
});