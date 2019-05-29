require('chromedriver'); //导入chrome浏览器 driver
var webdriver = require('selenium-webdriver'); //导入selenium 库
By = webdriver.By,
until = webdriver.until;
function CurentTime(){ 
        var now = new Date(); 
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        var ss = now.getSeconds();          //秒
        var clock = year + "-";
        if(month < 10)
            clock += "0";
        clock += month + "-";
        if(day < 10)
            clock += "0";
        clock += day + " ";
        if(hh < 10)
            clock += "0";
        clock += hh + ":";
        if (mm < 10) clock += '0'; 
        clock += mm + ":"; 
        if (ss < 10) clock += '0'; 
        clock += ss; 
        return(clock); 
}
function openChrom(userId,passwords,res){
    try{
        var driver = new webdriver.Builder().forBrowser('chrome').build(); //创建一个chrome 浏览器实例
        driver.get("https://user.qzone.qq.com/");
        driver.switchTo().frame(driver.findElement(By.id("login_frame")));
        driver.findElement(By.id("switcher_plogin")).click()
        driver.executeScript('document.getElementById("u").value='+userId)
        driver.executeScript('document.getElementById("p").value='+'"'+passwords+'"')
        driver.findElement(By.id("login_button")).click()
        driver.manage().window().maximize(); 
        driver.switchTo().defaultContent();
        dianzan(driver,res)
    }catch(err){
        driver.quit()
        res.json({
            success:false
        })
    }
}
var total = 0
var num = 0
var name = []
function dianzan(driver,res){
    var time = CurentTime()
    driver.findElements(By.className("info-detail")).then((arr)=>{
        arr[arr.length-1].getText().then(v=>{
            if(v.length>5){
                driver.findElements(By.className("fui-icon icon-op-praise")).then((arr2)=>{

                    for(let i=0;i<arr2.length;i++){
                         arr2[i].getCssValue('background-position').then(v=>{
                             total ++
                             if(v=='-52px -921px'){
                                 console.log(i,'已赞')
                             }else{
                                num++
                                 console.log(i,'点赞')
                                 arr2[i].click()
                             }
                         })
                    }
                })
                driver.findElements(By.className("f-single")).then((arr3)=>{
                    arr3.forEach(v=>{
                        v.getText().then(cv=>{
                            name.push(cv)
                        })
                    })
                })


                console.log(time+'的说说已经赞完了')
                driver.quit().then(()=>{
                    res.json({
                        success:true,
                        total:total,
                        num:num,
                        data:time,
                        name:name
                    })
                    num = 0
                    total = 0
                    name = []
                    // driver.sleep(24*60*60*1000)     //点赞时差
                    // openChrom()
                })

            }else{
                driver.executeScript('document.documentElement.scrollTop=100000');          //模拟滚动加载更多动态
                dianzan(driver,res)
            }
        }).catch(err=>{
            console.log(err)
            driver.quit()
            res.json({
                success:false
            })
        })
    }).catch(err=>{
        driver.quit()
        res.json({
            success:false
        })
    })
}
module.exports = openChrom //程序入口