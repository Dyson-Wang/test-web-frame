"use server"
import axios from "axios";
import path from "path";
import fs from "fs";

const hanfuapi = async (binaryData2: any) => {
    const hanfu = fs.readFileSync('./public/hanfu.jpg', {
        encoding: 'base64'
    })
    console.log(hanfu.slice(0, 100))
    // 构造 multipart/form-data 数据
    const boundary = '----boundary' + Date.now().toString(16); // 随机生成分隔符
    const body = [];
    body.push('--' + boundary);
    body.push('Content-Disposition: form-data; name="api_key"');
    body.push('');
    body.push('ysSrjYycByg--CPWCfEG6C1ThumurZGg');
    body.push('--' + boundary);
    body.push('Content-Disposition: form-data; name="api_secret"');
    body.push('');
    body.push('LIttFOrPG6t49j9KQairOyxSqKehpQoG'); // 其他字符串参数
    body.push('--' + boundary);
    body.push('Content-Disposition: form-data; name="template_base64"');
    body.push('');
    body.push('data:image/jpeg;base64,' + hanfu);
    body.push('--' + boundary);
    body.push('Content-Disposition: form-data; name="merge_base64"');
    body.push('');
    body.push(binaryData2);
    body.push('--' + boundary);
    body.push('Content-Disposition: form-data; name="merge_rate"');
    body.push('');
    body.push(20); // 其他字符串参数
    body.push('--' + boundary);
    body.push('Content-Disposition: form-data; name="feature_rate"');
    body.push('');
    body.push(30); // 其他字符串参数
    body.push('--' + boundary + '--');
    body.push('');

    const bodyStr = body.join('\r\n'); // 使用 CRLF 作为行分隔符
    try {
        let res = await axios.request({
            url: 'https://api-cn.faceplusplus.com/imagepp/v1/mergeface',
            data: bodyStr,
            headers: {
                'Content-Type': 'multipart/form-data; boundary=' + boundary // 设置请求头
            },
            method: 'POST',
        })
        console.log('上传成功', res.data)
        if (res.data.error_message) {
            console.log(res.data.error_message)
            return
        }
        if (res.data.result) {
            let tempFileName = saveBase64ToTempPath(res.data.result)
            console.log(tempFileName)
            return
        }
    } catch (error: any) {
        console.error('上传失败', error.response.data);
    }
}

function saveBase64ToTempPath(base64Data: any) {
    // 去掉 Base64 数据的前缀（如 data:image/png;base64,）
    const base64 = base64Data.replace(/^data:image\/\w+;base64,/, "");

    // 生成唯一的临时文件名
    const timestamp = Date.now(); // 获取当前时间戳
    const randomString = Math.random().toString(36).substring(2, 8); // 随机字符串
    const tempFileName = `tempImage_${timestamp}_${randomString}.jpg`;

    return tempFileName
}

export default hanfuapi