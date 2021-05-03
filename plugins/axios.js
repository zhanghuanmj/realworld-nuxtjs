import axios from 'axios';

export const request = axios.create({
    baseURL: 'https://conduit.productionready.io'
});

export default ({ store }) => {


    // 在发送请求之前做某件事(添加请求拦截器)
    request.interceptors.request.use(
        (config) => {
            let token = '';
            if (store.state.user) {
                token = store.state.user.token
            }
            
            if (token) {
                config.headers = Object.assign(config.headers, {
                    "Authorization": `Token ${token}`, // 让每个请求携带自定义 token 请根据实际情况自行修改
                    withCredentials: true, // 允许后台获取cookie
                });
            }
            if (config.method === "get") {
                config.params = {
                    _: Date.parse(new Date()) / 1000, //get方法加时间标识，防止缓存
                    ...config.params,
                };
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
}