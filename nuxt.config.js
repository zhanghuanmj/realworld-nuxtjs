/**
 * nuxtjs 配置文件
 */
export default {
    server: {
        port: 9527, // default: 3000
        host: '0.0.0.0', // default: localhost,
    },
    router: {
        linkActiveClass: 'active',
        extendRoutes(routes, resolve) {
            // 删除数组里的所有数据，不能用赋值清空
            routes.splice(0)
            routes.push(...[
                {
                    path: '/',
                    component: resolve(__dirname, 'pages/layout'),
                    children: [
                        {
                            name: 'home',
                            path: '',
                            component: resolve(__dirname, 'pages/home')
                        },
                        {
                            name: 'register',
                            path: 'register',
                            component: resolve(__dirname, 'pages/login/register')
                        },
                        {
                            name: 'login',
                            path: 'login',
                            component: resolve(__dirname, 'pages/login/register')
                        },
                        {
                            name: 'profile',
                            path: 'profile/:username',
                            component: resolve(__dirname, 'pages/profile')
                        },
                        {
                            name: 'settings',
                            path: 'settings',
                            component: resolve(__dirname, 'pages/settings')
                        },
                        {
                            name: 'editor',
                            path: 'editor/:slug?',
                            component: resolve(__dirname, 'pages/editor')
                        },
                        {
                            name: 'article',
                            path: 'article/:slug',
                            component: resolve(__dirname, 'pages/article')
                        },
                    ]
                },
                {
                    name: 'notFind',
                    path: '*',
                    component: resolve(__dirname, 'pages/exception/404.vue')
                }
            ])
        }
    },
    plugins: ['~/plugins/axios.js', '~/plugins/dayjs.js']
}