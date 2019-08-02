
export const set = 'set$'
export const app_name ='React_news' //slogan


export const app_token ='app_token'

//设置默认超时时间30s
export const timeout=30000

// 设置版本前缀
export const app_version='1.0.0'

export const env =process.env.NODE_ENV||'development'

const hosts = {
    development: 'https://localhost:4000/',
    test: 'https://t.web.joyincar.cn/',
    production: 'https://web.joyincar.cn/'
}

// 此为接口环境前缀
export const rootPath = hosts[env]

// storage写入的前缀
export const storage_prefix = `${app_name}_${app_version}_`
