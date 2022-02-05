/* keyboard shorcuts ctrl-ctrl to wake up search-block */
const secretKey = ['Ctrl', 'Ctrl']
const secretKeyCode = [17, 17];
let secretKeyCodeStatus = new Array(secretKeyCode.length).fill(0);
const CORRECT_STATUS = 1;
document.onkeyup = function(event) {
    // 查找第一个0的位置，即当前按键应该匹配的位置
    let correctCodeIndex = secretKeyCodeStatus.lastIndexOf(CORRECT_STATUS);
    correctCodeIndex = correctCodeIndex === -1 ? 0 : correctCodeIndex + 1;
    // 如果所有的按键都正确，则返回
    // if (correctCodeIndex > secretKeyCode.length) return true;
    // 如果本次按键正确，则记录
    if (event.keyCode === secretKeyCode[correctCodeIndex]) {
        // console.log('keyCode: ' + event.keyCode + ' code: ' + event.code + '  --correct,index:' + correctCodeIndex);
        // 所有按键都正确则成功
        if (correctCodeIndex + 1 === secretKeyCodeStatus.length) {
            document.getElementById("search-block").click();
            setTimeout(function () { /* 延时对输入框聚焦 */
                document.getElementById("aa-search-input").focus();
            }, 100);
            setTimeout(function () { /* 延时对输入框聚焦 */
                document.getElementById("aa-search-input").focus();
            }, 200);
            secretKeyCodeStatus = new Array(secretKeyCode.length).fill(0);
            return true;
        } else {
            // 否则记录当前按键成功
            secretKeyCodeStatus[correctCodeIndex] = CORRECT_STATUS;
            setTimeout(function (){ /* 第一次按键正确后，设置延时清空，保证只有双击ctrl才触发 */
              secretKeyCodeStatus = new Array(secretKeyCode.length).fill(0);
            }, 500);
        }
    } else {
        // 按键错误则重置
        secretKeyCodeStatus = new Array(secretKeyCode.length).fill(0);
    }
};


/* 顶部阅读进度条 */
// document.addEventListener('DOMContentLoaded', function () {
//     var winHeight = window.innerHeight,
//           docHeight = document.documentElement.scrollHeight,
//           progressBar = document.querySelector('#content_progress');
//     progressBar.max = docHeight - winHeight;
//     progressBar.value = window.scrollY;
  
//     document.addEventListener('scroll', function () {
//           progressBar.max = document.documentElement.scrollHeight - window.innerHeight;
//           progressBar.value = window.scrollY;
//     });
// });


window.onload = function () {
    /* 默认加载评论 */
    if (commentsToggle !== null) {
        loadComments();
        commentsToggle.style = "display: none";
    }
}
